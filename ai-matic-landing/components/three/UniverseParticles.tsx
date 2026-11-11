"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TEAL } from "@/lib/particlePalette";
import {
  buildAllShapes,
  loadLogoPixels,
  loadDirhamPixels,
  PLACEMENT,
  SHAPE_ORDER,
  type ShapeBuffers,
} from "@/lib/universeShapes";
import { getPerfTier, type PerfTier } from "@/lib/perfTierStore";
import { computeChapterPos, queryChapterEls } from "@/lib/chapterScroll";

const VERTEX_SHADER = `
  attribute vec3 pA,pB,cA,cB;attribute float seed;
  uniform float uMix,uTime,uSize,uPR,uWob;uniform vec3 uMouse;
  varying vec3 vC;varying float vA;
  void main(){
    float m=clamp(uMix*1.4-seed*.4,0.,1.);m=m*m*(3.-2.*m);
    vec3 p=mix(pA,pB,m);
    float t=sin(m*3.14159);
    p+=t*vec3(sin(seed*61.+uTime*.7),cos(seed*37.+uTime*.9),sin(seed*23.-uTime*.6))*1.6;
    p+=uWob*.05*vec3(sin(uTime*1.3+seed*90.),cos(uTime*1.1+seed*70.),sin(uTime*.9+seed*50.));
    vec4 wp=modelMatrix*vec4(p,1.);
    vec3 d=wp.xyz-uMouse;float dl=length(d.xy);
    wp.xyz+=normalize(d+vec3(0.,0.,.001))*uWob*smoothstep(2.2,0.,dl)*.9;
    vec4 mv=viewMatrix*wp;
    gl_PointSize=uSize*uPR*(.35+seed*.9)/-mv.z;
    gl_Position=projectionMatrix*mv;
    vC=mix(cA,cB,m);vA=.55+seed*.45;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uFade;
  varying vec3 vC;varying float vA;
  void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(vC,a*vA*uFade);}
`;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type FrameState = {
  SH: ShapeBuffers[];
  PL: number[][];
  pA: THREE.BufferAttribute;
  pB: THREE.BufferAttribute;
  cA: THREE.BufferAttribute;
  cB: THREE.BufferAttribute;
  geo: THREE.BufferGeometry;
  mat: THREE.ShaderMaterial;
  points: THREE.Points;
  dust: THREE.Points;
  group: THREE.Group;
  curA: number;
  curB: number;
  sm: number;
  count: number;
  pixelRatio: number;
  lite: boolean;
  chapterEls: HTMLElement[];
  mouseNdc: THREE.Vector2;
  mouseWorld: THREE.Vector3;
  raycaster: THREE.Raycaster;
  plane: THREE.Plane;
  camera: THREE.Camera;
  camBaseZ: number;
  cx: number;
  cy: number;
  fpsFrames: number;
  fpsStart: number;
  warmupUntil: number;
  /** Critical tier skips continuous scroll-scrubbed shape blending in favor of a cheap snap +
   * opacity crossfade — see the branch in useFrame below. */
  simpleTransitions: boolean;
  fadeT: number;
  coinFormed: boolean;
  coinFlipping: boolean;
  coinFlipProgress: number;
  mobile: boolean;
};

/** Index of "coin" in SHAPE_ORDER — the chapter that gets dedicated spin/bob/flip motion. */
const COIN_CHAPTER_IDX = 5;

const N_BY_TIER: Record<PerfTier, number> = { high: 22000, low: 9000, critical: 4000, desktopLow: 10000 };
const SIZE_BY_TIER: Record<PerfTier, number> = { high: 30, low: 34, critical: 44, desktopLow: 32 };

type Props = {
  chapterCount: number;
  reducedMotion: boolean;
};

export function UniverseParticles({ chapterCount, reducedMotion }: Props) {
  const { scene, camera, gl } = useThree();
  const frameRef = useRef<FrameState | null>(null);
  const mouseClientRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    let disposed = false;

    const build = async () => {
      await Promise.all([loadLogoPixels(), loadDirhamPixels()]);
      if (disposed) return;

      const mobile = window.innerWidth < 760 || matchMedia("(pointer:coarse)").matches;
      const deviceTier = getPerfTier();
      const tier: PerfTier = deviceTier === "critical" ? "critical" : deviceTier;
      const N = N_BY_TIER[tier];
      const shapes = buildAllShapes(N);
      const SH = SHAPE_ORDER.map((key) => shapes[key]);
      // The camera's FOV is vertical and fixed, so its horizontal frustum width is driven by
      // the viewport's ASPECT RATIO, not its raw pixel width — a tall/narrow phone shows much
      // less horizontal world space than this placement table was tuned against, regardless of
      // how many physical pixels wide it is. Shrink shapes proportionally so wide ones (the
      // AiMatic wordmark, the dirham coin) stay fully inside the frame instead of clipping.
      const aspect = window.innerWidth / window.innerHeight;
      const narrowFit = mobile ? Math.min(1, aspect / 0.66) : 1;
      const PL = (mobile ? PLACEMENT.mobile : PLACEMENT.desktop).map((p) => [p[0], p[1], p[2], p[3], p[4] * narrowFit]);

      const seed = new Float32Array(N);
      for (let i = 0; i < N; i++) seed[i] = Math.random();

      const pA = new THREE.BufferAttribute(SH[0].p.slice(), 3);
      const pB = new THREE.BufferAttribute(SH[0].p.slice(), 3);
      const cA = new THREE.BufferAttribute(SH[0].c.slice(), 3);
      const cB = new THREE.BufferAttribute(SH[0].c.slice(), 3);

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", pA);
      geo.setAttribute("pA", pA);
      geo.setAttribute("pB", pB);
      geo.setAttribute("cA", cA);
      geo.setAttribute("cB", cB);
      geo.setAttribute("seed", new THREE.BufferAttribute(seed, 1));

      const pixelRatio = Math.min(window.devicePixelRatio, tier === "high" ? 2 : tier === "low" ? 1.5 : 1);
      gl.setPixelRatio(pixelRatio);

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uMix: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: SIZE_BY_TIER[tier] },
          uPR: { value: pixelRatio },
          uWob: { value: reducedMotion || tier === "critical" ? 0 : 1 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uFade: { value: 1 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      const group = new THREE.Group();
      group.add(points);
      scene.add(group);

      const dn = tier === "high" ? 1600 : tier === "low" ? 600 : 250;
      const dp = new Float32Array(dn * 3);
      for (let i = 0; i < dn; i++) {
        dp[i * 3] = (Math.random() - 0.5) * 80;
        dp[i * 3 + 1] = (Math.random() - 0.5) * 50;
        dp[i * 3 + 2] = -10 - Math.random() * 40;
      }
      const dg = new THREE.BufferGeometry();
      dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
      const dust = new THREE.Points(
        dg,
        new THREE.PointsMaterial({ color: TEAL.getHex(), size: 0.06, transparent: true, opacity: 0.25, depthWrite: false })
      );
      scene.add(dust);

      const chapterEls = queryChapterEls(chapterCount);

      frameRef.current = {
        SH,
        PL,
        pA,
        pB,
        cA,
        cB,
        geo,
        mat,
        points,
        dust,
        group,
        curA: tier === "critical" ? -1 : 0,
        curB: 0,
        sm: 0,
        count: N,
        pixelRatio,
        lite: false,
        chapterEls,
        mouseNdc: new THREE.Vector2(),
        mouseWorld: new THREE.Vector3(),
        raycaster: new THREE.Raycaster(),
        plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
        camera,
        camBaseZ: 13,
        simpleTransitions: tier === "critical",
        fadeT: 1,
        mobile,
        coinFormed: false,
        coinFlipping: false,
        coinFlipProgress: 1,
        cx: 0,
        cy: 0,
        fpsFrames: 0,
        fpsStart: 0,
        warmupUntil: performance.now() + 1200,
      };
    };

    build();

    const onMouseMove = (e: MouseEvent) => {
      mouseClientRef.current.x = e.clientX;
      mouseClientRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Touch devices get the same parallax/repel response as mouse — track the first finger.
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      mouseClientRef.current.x = touch.clientX;
      mouseClientRef.current.y = touch.clientY;
    };
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onResize = () => {
      const fs = frameRef.current;
      if (!fs) return;
      fs.chapterEls = queryChapterEls(chapterCount);
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      const fs = frameRef.current;
      if (!fs) return;
      fs.fpsFrames = 0;
      fs.fpsStart = 0;
      fs.warmupUntil = performance.now() + 800;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      const fs = frameRef.current;
      if (fs) {
        scene.remove(fs.group);
        scene.remove(fs.dust);
        fs.geo.dispose();
        fs.mat.dispose();
        fs.dust.geometry.dispose();
        (fs.dust.material as THREE.Material).dispose();
      }
      frameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterCount, scene, gl]);

  useFrame((state, delta) => {
    const fs = frameRef.current;
    if (!fs) return;

    const dt = Math.min(delta, 0.05);
    const dtEff = reducedMotion ? 0 : dt;

    const target = computeChapterPos(fs.chapterEls);
    let a: number;
    let b: number;
    let m: number;

    if (fs.simpleTransitions) {
      // Critical tier: no continuous scroll-scrubbed blend — snap straight to the nearest
      // chapter's shape and just crossfade opacity in, far cheaper per frame than smoothing
      // a scrub position and mixing two full position/color buffers every frame.
      const targetIdx = Math.max(0, Math.min(fs.SH.length - 1, Math.round(target)));
      if (targetIdx !== fs.curA) {
        fs.curA = targetIdx;
        fs.curB = targetIdx;
        fs.pA.array.set(fs.SH[targetIdx].p);
        fs.cA.array.set(fs.SH[targetIdx].c);
        fs.pB.array.set(fs.SH[targetIdx].p);
        fs.cB.array.set(fs.SH[targetIdx].c);
        fs.pA.needsUpdate = fs.pB.needsUpdate = fs.cA.needsUpdate = fs.cB.needsUpdate = true;
        fs.fadeT = 0;
        const P = fs.PL[targetIdx];
        fs.group.position.set(P[0], P[1], 0);
        fs.group.scale.setScalar(P[4]);
        fs.group.rotation.set(P[2], 0, 0);
      }
      a = targetIdx;
      b = targetIdx;
      m = 0;
      fs.mat.uniforms.uMix.value = 0;
      fs.fadeT = Math.min(1, fs.fadeT + dt / 0.35);
      fs.mat.uniforms.uFade.value = fs.fadeT;
      fs.mat.uniforms.uTime.value += dtEff;
    } else {
      fs.sm += (target - fs.sm) * Math.min(1, dt * 5);
      fs.sm = Math.max(0, Math.min(fs.SH.length - 1, fs.sm));
      a = Math.floor(fs.sm);
      b = Math.min(fs.SH.length - 1, a + 1);
      const f = fs.sm - a;

      if (a !== fs.curA || b !== fs.curB) {
        fs.curA = a;
        fs.curB = b;
        fs.pA.array.set(fs.SH[a].p);
        fs.cA.array.set(fs.SH[a].c);
        fs.pB.array.set(fs.SH[b].p);
        fs.cB.array.set(fs.SH[b].c);
        fs.pA.needsUpdate = fs.pB.needsUpdate = fs.cA.needsUpdate = fs.cB.needsUpdate = true;
      }

      m = Math.min(1, Math.max(0, (f - 0.15) / 0.7));
      fs.mat.uniforms.uMix.value = m;
      fs.mat.uniforms.uTime.value += dtEff;
      const t = fs.mat.uniforms.uTime.value;

      const e = m * m * (3 - 2 * m);
      const P = fs.PL[a];
      const Q = fs.PL[b];
      fs.group.position.set(lerp(P[0], Q[0], e), lerp(P[1], Q[1], e), 0);
      fs.group.scale.setScalar(lerp(P[4], Q[4], e));
      const spin = lerp(P[3], Q[3], e);
      fs.group.rotation.x = lerp(P[2], Q[2], e) + Math.sin(t * 0.3) * 0.08 * spin;
      fs.group.rotation.y = Math.sin(t * 0.18) * 0.9 * spin + t * 0.06 * spin * (a === 0 ? 1 : 0);
      fs.group.rotation.z = a === 2 ? Math.sin(t * 0.2) * 0.05 : 0;

      // The coin(5)→helix(6) blend spans the full scroll height of the Pricing section,
      // addons table included — on a phone that table is tall enough that the mid-blend
      // cluster drifts down and visibly overlaps it. Dampen opacity through the middle of
      // that one blend (full strength at both resolved ends) so it reads as faint ambient
      // dust there instead of a dense cluster sitting over the cards. Desktop's much wider
      // layout doesn't show this, so it's mobile-only.
      if (fs.mobile && a === COIN_CHAPTER_IDX) {
        fs.mat.uniforms.uFade.value = 1 - Math.sin(m * Math.PI) * 0.75;
      } else {
        fs.mat.uniforms.uFade.value = 1;
      }
    }

    const t = fs.mat.uniforms.uTime.value;

    // Coin: dedicated continuous spin + gentle bob, with a one-time flip the first time it
    // fully resolves (not mid-blend toward/from a neighboring chapter) — overrides whatever
    // rotation.y the branch above set, layered on top of its position/scale.
    const isCoin = a === COIN_CHAPTER_IDX;
    if (isCoin && m <= 0.02 && !fs.coinFormed) {
      fs.coinFormed = true;
      fs.coinFlipping = true;
      fs.coinFlipProgress = 0;
    }
    if (fs.coinFlipping) {
      fs.coinFlipProgress += dtEff / 0.8;
      if (fs.coinFlipProgress >= 1) {
        fs.coinFlipProgress = 1;
        fs.coinFlipping = false;
      }
    }
    if (isCoin) {
      const flipAngle = easeInOutCubic(fs.coinFlipProgress) * Math.PI * 2;
      fs.group.rotation.y = t * 0.22 + flipAngle;
      fs.group.position.y += Math.sin(t * 0.9) * 0.08;
    }

    const mc = mouseClientRef.current;
    const nx = mc.x / window.innerWidth - 0.5;
    const ny = mc.y / window.innerHeight - 0.5;
    // The off-screen sentinel (-9999) is intentional below for the repel raycast — it makes
    // the repel naturally inert until real input arrives. But driving camera parallax off that
    // same huge value has no such built-in falloff, so it would drift the camera toward an
    // absurd position before any pointer event ever fires. Keep parallax neutral until then.
    const mouseActive = mc.x > -9000 && mc.y > -9000;
    fs.cx += ((mouseActive ? nx : 0) - fs.cx) * 0.05;
    fs.cy += ((mouseActive ? ny : 0) - fs.cy) * 0.05;
    fs.camera.position.x = fs.cx * 1.6;
    fs.camera.position.y = -fs.cy * 1.1;
    fs.camera.position.z = fs.camBaseZ;
    fs.camera.lookAt(0, 0, 0);

    // Repel point follows mouse on desktop and the active finger on touch devices.
    fs.mouseNdc.set(nx * 2, -ny * 2);
    fs.raycaster.setFromCamera(fs.mouseNdc, fs.camera);
    if (fs.raycaster.ray.intersectPlane(fs.plane, fs.mouseWorld)) {
      fs.mat.uniforms.uMouse.value.copy(fs.mouseWorld);
    }

    fs.dust.rotation.y = t * 0.01;

    const now = performance.now();
    if (now > fs.warmupUntil) {
      if (!fs.fpsStart) fs.fpsStart = now;
      fs.fpsFrames++;
      if (now - fs.fpsStart > 4000) {
        fs.fpsFrames = 0;
        fs.fpsStart = now;
      } else if (now - fs.fpsStart > 1000) {
        // 45fps/1s covers both asks: mobile wants a reaction within 1s of dropping below 40fps
        // (which is also below 45), desktop wants ~45fps sustained for ~1.5s — 1s is strictly
        // faster, so it satisfies both without needing two separate watchdog paths.
        const fps = (fs.fpsFrames * 1000) / (now - fs.fpsStart);
        if (fps < 45) degrade(fs, gl);
        fs.fpsFrames = 0;
        fs.fpsStart = now;
      }
    }
  });

  return null;
}

/** DPR first — the biggest win on a high-DPI panel — then particle count, then effects
 * (wobble/repel), then a further DPR cut, then a final particle-count floor. Each step only
 * ever tightens; there's no upgrade path, so a transient dip can't cause oscillation. */
function degrade(fs: FrameState, gl: THREE.WebGLRenderer) {
  if (fs.pixelRatio > 1) {
    fs.pixelRatio = 1;
    gl.setPixelRatio(1);
    fs.mat.uniforms.uPR.value = 1;
    return;
  }
  if (fs.count > 2600) {
    fs.count = Math.floor(fs.count * 0.55);
    fs.geo.setDrawRange(0, fs.count);
    fs.mat.uniforms.uSize.value *= 1.15;
    return;
  }
  if (!fs.lite) {
    fs.lite = true;
    fs.mat.uniforms.uWob.value = 0;
    return;
  }
  if (fs.pixelRatio > 0.75) {
    fs.pixelRatio = 0.75;
    gl.setPixelRatio(0.75);
    fs.mat.uniforms.uPR.value = 0.75;
    return;
  }
  if (fs.count > 1500) {
    fs.count = 1500;
    fs.geo.setDrawRange(0, fs.count);
    fs.mat.uniforms.uSize.value *= 1.2;
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
