"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useWebglSupport } from "@/lib/useWebglSupport";

const ParticleUniverseCanvas = dynamic(
  () => import("@/components/three/ParticleUniverseCanvas").then((m) => m.ParticleUniverseCanvas),
  { ssr: false, loading: () => null }
);

const CHAPTER_COUNT = 7;

/** The one persistent, full-page particle scene. Mounted once at the app root. */
export function ParticleUniverse() {
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebglSupport();

  if (reducedMotion || webglSupported !== true) return null;

  return <ParticleUniverseCanvas chapterCount={CHAPTER_COUNT} reducedMotion={reducedMotion} />;
}
