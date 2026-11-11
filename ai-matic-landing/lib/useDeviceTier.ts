"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = "high" | "low";

/** Coarse heuristic: small viewport, low core count, or low device memory -> lighter 3D. */
function detectTier(): DeviceTier {
  const isNarrow = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  if (isNarrow || cores <= 4 || memory <= 4) return "low";
  return "high";
}

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): DeviceTier {
  return detectTier();
}

function getServerSnapshot(): DeviceTier {
  return "high";
}

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
