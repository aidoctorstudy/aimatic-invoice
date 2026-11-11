"use client";

import { useSyncExternalStore } from "react";
import { getGpuInfo } from "@/lib/gpuTier";

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const hasContext = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
    if (!hasContext) return false;
    // A context can exist yet still be software-rendered (SwiftShader/llvmpipe — hardware
    // acceleration disabled in the browser). That's unusably slow for this scene, so treat it
    // the same as "no WebGL" and let the static fallback take over instead.
    return getGpuInfo().gpuClass !== "software";
  } catch {
    return false;
  }
}

let cached: boolean | null = null;

function getSnapshot(): boolean {
  if (cached === null) cached = detectWebgl();
  return cached;
}

function getServerSnapshot(): boolean | null {
  return null;
}

function subscribe() {
  return () => {};
}

/** Returns null while detecting, then true/false. Avoids SSR/client mismatch. */
export function useWebglSupport(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
