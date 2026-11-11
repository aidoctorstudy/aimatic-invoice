"use client";

/** The particle system's starting perf tier, seeded once from device capability detection.
 * "low" = ordinary mobile/narrow viewport. "critical" = weak mobile hardware (low cores/memory
 * or a failing early fps probe) — also where scroll-scrubbed transitions simplify to a crossfade.
 * "desktopLow" = a desktop/laptop with a weak integrated GPU (Intel UHD/Iris, integrated Radeon
 * Graphics, etc.) — capped DPR and fewer particles, but keeps the normal smooth transitions. */
export type PerfTier = "high" | "low" | "critical" | "desktopLow";

let currentTier: PerfTier = "high";

export function getPerfTier(): PerfTier {
  return currentTier;
}

export function setBasePerfTier(tier: PerfTier) {
  currentTier = tier;
}
