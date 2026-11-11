import * as THREE from "three";
import { TEAL, NAVY, INK, MUTED } from "@/lib/particlePalette";

export type ShapeKey = "logo" | "core" | "branches" | "rings" | "city" | "coin" | "helix";

export type ShapeBuffers = { p: Float32Array; c: Float32Array };

/** Gaussian-ish jitter via averaged uniform samples — matches the original's `G()` helper. */
function gaussianJitter(): number {
  let u = 0;
  for (let i = 0; i < 4; i++) u += Math.random();
  return (u - 2) / 2;
}

function mixColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return a.clone().lerp(b, t);
}

function shuffledPermutation(n: number): Uint32Array {
  const perm = new Uint32Array(n);
  for (let i = 0; i < n; i++) perm[i] = i;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  return perm;
}

/** Writes fn(i)'s [position, color] into the output arrays at a shuffled slot — decorrelates
 * each shape's internal index-based pattern from the per-particle morph stagger order. */
function buildShape(
  n: number,
  perm: Uint32Array,
  fn: (i: number) => { pos: [number, number, number]; color: THREE.Color }
): ShapeBuffers {
  const p = new Float32Array(n * 3);
  const c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const { pos, color } = fn(i);
    const k = perm[i] * 3;
    p[k] = pos[0];
    p[k + 1] = pos[1];
    p[k + 2] = pos[2];
    c[k] = color.r;
    c[k + 1] = color.g;
    c[k + 2] = color.b;
  }
  return { p, c };
}

function buildCore(n: number, perm: Uint32Array): ShapeBuffers {
  return buildShape(n, perm, (i) => {
    const f = i / n;
    if (f < 0.62) {
      const k = i / (n * 0.62);
      const y = 1 - 2 * k;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * 2.39996;
      const rr = 3.1 + gaussianJitter() * 0.05;
      return {
        pos: [Math.cos(th) * r * rr, y * rr, Math.sin(th) * r * rr],
        color: mixColor(NAVY, TEAL, (y + 1) / 2),
      };
    }
    if (f < 0.86) {
      const ring = i % 3;
      const a = Math.random() * Math.PI * 2;
      const r = 4.3 + ring * 0.55 + gaussianJitter() * 0.04;
      const x = Math.cos(a) * r;
      const y = gaussianJitter() * 0.03;
      const z = Math.sin(a) * r;
      const t = [0.5, -0.4, 1.1][ring];
      const cy = Math.cos(t);
      const sy = Math.sin(t);
      const y2 = y * cy - z * sy;
      const z2 = y * sy + z * cy;
      return { pos: [x, y2, z2], color: ring === 1 ? INK : TEAL };
    }
    const r = Math.pow(Math.random(), 2) * 1.1;
    const a = Math.random() * 6.283;
    const b = Math.acos(2 * Math.random() - 1);
    return {
      pos: [r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)],
      color: INK,
    };
  });
}

function buildBranches(n: number, perm: Uint32Array): ShapeBuffers {
  const clusters: [number, number, number][] = [
    [-6, 2.6, -2],
    [-2.4, -2.8, -1],
    [1.5, 3.1, -3],
    [5.6, 1.2, -1.5],
    [6.2, -2.6, -3],
    [-5.4, -1.9, 1],
    [2, -0.6, 0],
  ];
  return buildShape(n, perm, () => {
    if (Math.random() < 0.14) {
      return { pos: [gaussianJitter() * 12, gaussianJitter() * 7, gaussianJitter() * 6 - 2], color: MUTED };
    }
    const k = Math.floor(Math.random() * clusters.length);
    const q = clusters[k];
    const r = 0.35 + Math.random() * 0.7;
    return {
      pos: [q[0] + gaussianJitter() * r, q[1] + gaussianJitter() * r, q[2] + gaussianJitter() * r],
      color: k === 6 ? TEAL : mixColor(NAVY, TEAL, Math.random() * 0.5),
    };
  });
}

function buildRings(n: number, perm: Uint32Array): ShapeBuffers {
  return buildShape(n, perm, (i) => {
    if (i % 18 === 0) {
      const x = -6 + Math.random() * 12;
      return { pos: [x, gaussianJitter() * 0.05, gaussianJitter() * 0.05], color: INK };
    }
    const k = i % 4;
    const cx = -4.6 + k * 3.05;
    const a = Math.random() * 6.283;
    const tube = gaussianJitter() * 0.12;
    const x = Math.cos(a) * (1.35 + tube);
    const y = Math.sin(a) * (1.35 + tube);
    const z = gaussianJitter() * 0.12;
    const rot = k * 0.55 + 0.3;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    const x2 = x * cr - z * sr;
    const z2 = x * sr + z * cr;
    const ry = 0.35 * (k % 2 ? 1 : -1);
    const cY = Math.cos(ry);
    const sY = Math.sin(ry);
    return {
      pos: [cx + x2, y * cY - z2 * sY, y * sY + z2 * cY],
      color: mixColor(TEAL, NAVY, k / 3),
    };
  });
}

function buildCity(n: number, perm: Uint32Array): ShapeBuffers {
  const towers: [number, number, number][] = [];
  for (let gx = -4; gx <= 4; gx++) {
    for (let gz = -4; gz <= 4; gz++) {
      if (Math.random() < 0.25) continue;
      const d = Math.hypot(gx, gz);
      towers.push([gx * 0.82, gz * 0.82, 0.4 + Math.max(0, 3.6 - d * 0.7) * (0.4 + Math.random() * 0.8)]);
    }
  }
  return buildShape(n, perm, (i) => {
    if (Math.random() < 0.22) {
      return { pos: [(Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8], color: MUTED };
    }
    const t = towers[i % towers.length];
    const h = t[2];
    const face = Math.floor(Math.random() * 4);
    const u = Math.random() - 0.5;
    const w = 0.3;
    let x = t[0];
    let z = t[1];
    const y = Math.random() * h;
    if (face === 0) {
      x += u * w * 2;
      z += w;
    } else if (face === 1) {
      x += u * w * 2;
      z -= w;
    } else if (face === 2) {
      z += u * w * 2;
      x += w;
    } else {
      z += u * w * 2;
      x -= w;
    }
    const top = y > h - 0.1;
    const hot = i % towers.length === 7;
    return {
      pos: [x, y - 1.6, z],
      color: top || hot ? TEAL : mixColor(MUTED, NAVY, y / h),
    };
  });
}

function buildHelix(n: number, perm: Uint32Array): ShapeBuffers {
  return buildShape(n, perm, (i) => {
    const t = Math.random();
    const x = -7 + t * 14;
    const ang = t * Math.PI * 5;
    if (i % 7 === 0) {
      const s = Math.random() * 2 - 1;
      return {
        pos: [x, Math.cos(ang) * 1.5 * s + (t - 0.5) * 2, Math.sin(ang) * 1.5 * s],
        color: mixColor(NAVY, INK, t),
      };
    }
    const off = i % 2 ? 0 : Math.PI;
    return {
      pos: [
        x + gaussianJitter() * 0.05,
        Math.cos(ang + off) * 1.5 + (t - 0.5) * 2 + gaussianJitter() * 0.05,
        Math.sin(ang + off) * 1.5 + gaussianJitter() * 0.05,
      ],
      color: t < 0.5 ? TEAL : mixColor(TEAL, NAVY, (t - 0.5) * 2),
    };
  });
}

function buildLogo(n: number, perm: Uint32Array, candidates: Array<[number, number, boolean]>, width: number, height: number): ShapeBuffers {
  const scale = (typeof window !== "undefined" && window.innerWidth < 760 ? 7 : 11) / width;
  return buildShape(n, perm, () => {
    if (!candidates.length || Math.random() < 0.08) {
      return { pos: [gaussianJitter() * 14, gaussianJitter() * 8, gaussianJitter() * 5 - 3], color: MUTED };
    }
    const q = candidates[Math.floor(Math.random() * candidates.length)];
    const [x, y, isIcon] = q;
    return {
      pos: [(x - width / 2) * scale, -(y - height / 2) * scale, gaussianJitter() * 0.12],
      color: isIcon ? TEAL : NAVY,
    };
  });
}

/** Loads and caches the real logo's opaque pixels, split into icon-vs-wordmark by source hue. */
let logoCache: { candidates: Array<[number, number, boolean]>; width: number; height: number } | null = null;
let logoLoadPromise: Promise<void> | null = null;

export function loadLogoPixels(): Promise<void> {
  if (logoCache) return Promise.resolve();
  if (logoLoadPromise) return logoLoadPromise;
  if (typeof window === "undefined") return Promise.resolve();

  logoLoadPromise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = 420;
      const height = Math.round((width * img.height) / img.width) || 98;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        logoCache = { candidates: [], width, height };
        resolve();
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const data = ctx.getImageData(0, 0, width, height).data;
        const candidates: Array<[number, number, boolean]> = [];
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const o = (y * width + x) * 4;
            const alpha = data[o + 3];
            if (alpha <= 140) continue;
            const r = data[o];
            const g = data[o + 1];
            const b = data[o + 2];
            // Icon ("Ai") is saturated teal; wordmark ("Matic") is near-white/pale — split by saturation.
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const isIcon = max - min > 30;
            candidates.push([x, y, isIcon]);
          }
        }
        logoCache = { candidates, width, height };
      } catch {
        logoCache = { candidates: [], width, height };
      }
      resolve();
    };
    img.onerror = () => {
      logoCache = { candidates: [], width: 420, height: 98 };
      resolve();
    };
    img.src = "/ai-matic-logo.png";
  });

  return logoLoadPromise;
}

const COIN_TEAL = new THREE.Color("#1ca494");
const COIN_FACE = new THREE.Color("#d4e3e0");
const COIN_FACE_DARK = new THREE.Color("#b8cbc7");

/** Loads and caches the official UAE Dirham symbol's (U+20C3) opaque pixels, same sampling
 * technique `loadLogoPixels` uses for the real logo — rasterize the SVG to an offscreen canvas,
 * scan for opaque pixels. */
type DirhamPixels = {
  candidates: Array<[number, number]>;
  width: number;
  height: number;
};

let dirhamCache: DirhamPixels | null = null;
let dirhamLoadPromise: Promise<void> | null = null;

export function loadDirhamPixels(): Promise<void> {
  if (dirhamCache) return Promise.resolve();
  if (dirhamLoadPromise) return dirhamLoadPromise;
  if (typeof window === "undefined") return Promise.resolve();

  dirhamLoadPromise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = 300;
      const height = Math.round((width * img.height) / img.width) || 260;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        dirhamCache = { candidates: [], width, height };
        resolve();
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const data = ctx.getImageData(0, 0, width, height).data;
        const candidates: Array<[number, number]> = [];
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const o = (y * width + x) * 4;
            if (data[o + 3] <= 140) continue;
            candidates.push([x, y]);
          }
        }
        dirhamCache = { candidates, width, height };
      } catch {
        dirhamCache = { candidates: [], width, height };
      }
      resolve();
    };
    img.onerror = () => {
      dirhamCache = { candidates: [], width: 300, height: 260 };
      resolve();
    };
    img.src = "/dirham-symbol.svg";
  });

  return dirhamLoadPromise;
}

/** The whole particle swarm assembles into this coin — flat disc face, a denser/brighter
 * raised rim, a thin edge band that reads as thickness when it turns, and a dense embossed
 * dirham symbol at the center. No separate solid mesh, no leftover particles: every one of
 * the n particles lands in one of these four regions. */
function buildCoin(n: number, perm: Uint32Array): ShapeBuffers {
  const dirham = dirhamCache ?? { candidates: [], width: 300, height: 260 };
  const hasDirham = dirham.candidates.length > 0;
  const targetHalfHeight = 0.8;
  const scale = targetHalfHeight / (dirham.height / 2);
  const canvasCx = dirham.width / 2;
  const canvasCy = dirham.height / 2;

  // Heavily weighted toward the symbol — a point cloud needs real density to resolve the thin
  // crossing strokes clearly instead of reading as a blob.
  const pSymbol = hasDirham ? 0.4 : 0;
  const pRim = pSymbol + 0.12;
  const pEdge = pRim + 0.06;

  return buildShape(n, perm, () => {
    const roll = Math.random();

    if (roll < pSymbol) {
      const q = dirham.candidates[Math.floor(Math.random() * dirham.candidates.length)];
      const [px, py] = q;
      return {
        pos: [(px - canvasCx) * scale, -(py - canvasCy) * scale, 0.12 + Math.random() * 0.05],
        color: mixColor(COIN_TEAL, NAVY, Math.random() * 0.6),
      };
    }

    if (roll < pRim) {
      const a = Math.random() * Math.PI * 2;
      const rr = 1.38 + gaussianJitter() * 0.07;
      return {
        pos: [Math.cos(a) * rr, Math.sin(a) * rr, 0.04 + Math.random() * 0.03],
        color: mixColor(COIN_TEAL, NAVY, Math.random()),
      };
    }

    if (roll < pEdge) {
      const a = Math.random() * Math.PI * 2;
      const rr = 1.58 + gaussianJitter() * 0.03;
      return {
        pos: [Math.cos(a) * rr, Math.sin(a) * rr, (Math.random() - 0.5) * 0.3],
        color: mixColor(COIN_TEAL, NAVY, 0.4),
      };
    }

    const r = Math.sqrt(Math.random()) * 1.3;
    const a = Math.random() * Math.PI * 2;
    return {
      pos: [Math.cos(a) * r, Math.sin(a) * r, gaussianJitter() * 0.01],
      color: mixColor(COIN_FACE, COIN_FACE_DARK, Math.random()),
    };
  });
}

const SHAPE_ORDER: ShapeKey[] = ["logo", "core", "branches", "rings", "city", "coin", "helix"];

export function buildAllShapes(n: number): Record<ShapeKey, ShapeBuffers> {
  const perm = shuffledPermutation(n);
  const logo = logoCache
    ? buildLogo(n, perm, logoCache.candidates, logoCache.width, logoCache.height)
    : buildShape(n, perm, () => ({
        pos: [gaussianJitter() * 14, gaussianJitter() * 8, gaussianJitter() * 5 - 3],
        color: MUTED,
      }));

  return {
    logo,
    core: buildCore(n, perm),
    branches: buildBranches(n, perm),
    rings: buildRings(n, perm),
    city: buildCity(n, perm),
    coin: buildCoin(n, perm),
    helix: buildHelix(n, perm),
  };
}

export { SHAPE_ORDER };

/** [xOffset, yOffset, tilt, spin, scale] per shape, in SHAPE_ORDER — mirrors the original's
 * per-chapter framing so each assembled shape sits well-composed in the viewport. */
export const PLACEMENT: Record<"desktop" | "mobile", number[][]> = {
  desktop: [
    [3.6, 0.2, 0, 0.15, 0.62], // logo
    [0, 2.6, 0, 1, 0.55], // core
    [0, 0, 0, 0.4, 1], // branches
    [2.2, 2.1, 0, 0.25, 0.75], // rings
    [4.4, 1.5, 0.55, 0.8, 1], // city
    [0, 3.0, 0.1, 0, 0.85], // coin — above the pricing cards, never over either one
    [0, 0, 0, 0.3, 1], // helix
  ],
  mobile: [
    [0, 3.1, 0, 0.15, 0.75], // logo — sits in the reserved band above the hero text
    [0, 3.2, 0, 1, 0.6],
    [0, 0.5, 0, 0.4, 0.8],
    [0, 1.6, 0, 0.25, 0.7],
    [0, 1.4, 0.55, 0.8, 0.85],
    [0, 3.3, 0.1, 0, 0.6], // coin — above the stacked cards
    [0, 1.6, 0, 0.3, 0.8],
  ],
};
