"use client";

import { SceneFallback } from "@/components/three/SceneFallback";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useWebglSupport } from "@/lib/useWebglSupport";

/** Pricing's reserved coin space is otherwise empty when the global particle scene can't run
 * (no WebGL, or software-rendered) — without this, a GPU-less visitor sees a blank gap above
 * the cards instead of any illustration at all. */
export function CoinFallback() {
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebglSupport();
  if (reducedMotion || webglSupported !== false) return null;

  return (
    <div className="mx-auto h-full max-w-[220px] opacity-80">
      <SceneFallback />
    </div>
  );
}
