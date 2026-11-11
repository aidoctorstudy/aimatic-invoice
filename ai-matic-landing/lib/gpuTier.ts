"use client";

export type GpuClass = "software" | "integrated" | "discrete" | "unknown";

const SOFTWARE_PATTERN = /swiftshader|llvmpipe|software/i;
// Weak/integrated GPUs called out explicitly: Intel's integrated lines, AMD's integrated
// "Radeon Graphics" (as opposed to discrete "Radeon RX"/"Radeon Pro"), and the mobile GPU
// vendors that can show up in a desktop-class WebGL context (ChromeOS, Android desktop mode).
const INTEGRATED_PATTERN = /intel|uhd graphics|iris|radeon\(tm\) graphics|radeon graphics|vega \d+ graphics|mali|adreno|powervr/i;

let cached: { gpuClass: GpuClass; renderer: string | null } | null = null;

function detect(): { gpuClass: GpuClass; renderer: string | null } {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return { gpuClass: "unknown", renderer: null };

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    // Browsers increasingly restrict this extension for fingerprinting reasons — when it's
    // unavailable we genuinely can't tell, so don't guess and risk downgrading capable hardware.
    const renderer = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string) : null;
    if (!renderer) return { gpuClass: "unknown", renderer: null };

    if (SOFTWARE_PATTERN.test(renderer)) return { gpuClass: "software", renderer };
    if (INTEGRATED_PATTERN.test(renderer)) return { gpuClass: "integrated", renderer };
    return { gpuClass: "discrete", renderer };
  } catch {
    return { gpuClass: "unknown", renderer: null };
  }
}

/** Cached after first call — the test context is thrown away immediately either way. */
export function getGpuInfo(): { gpuClass: GpuClass; renderer: string | null } {
  if (typeof window === "undefined") return { gpuClass: "unknown", renderer: null };
  if (!cached) cached = detect();
  return cached;
}
