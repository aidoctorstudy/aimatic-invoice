"use client";

import { useEffect } from "react";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { setBasePerfTier } from "@/lib/perfTierStore";
import { probeFps } from "@/lib/fpsProbe";
import { getGpuInfo } from "@/lib/gpuTier";

/** Marks <html data-gpu-weak="true"> so CSS (see .glass-panel in globals.css) can drop
 * backdrop-filter blur on big panels — expensive on the same weak/integrated GPUs this
 * provider is already routing to a lighter 3D tier. */
function markGpuWeak() {
  document.documentElement.setAttribute("data-gpu-weak", "true");
}

/** Seeds the particle system's starting perf tier from device capability detection:
 * - Weak mobile hardware (low cores/memory, or a failing early fps probe) -> "critical".
 * - A capable-looking device but a weak integrated desktop GPU -> "desktopLow".
 * - Otherwise, the existing narrow-viewport-vs-not heuristic picks "low" or "high". */
export function ParticlePerfProvider() {
  const deviceTier = useDeviceTier();

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const weakHardware = cores <= 4 || memory <= 4;

    if (weakHardware) {
      setBasePerfTier("critical");
      markGpuWeak();
      return;
    }

    if (deviceTier === "high") {
      // Not a narrow/mobile viewport — this is the desktop/laptop path. A weak integrated GPU
      // here is exactly the "slight lag on an integrated-graphics laptop" case to catch.
      const { gpuClass } = getGpuInfo();
      if (gpuClass === "integrated") {
        setBasePerfTier("desktopLow");
        markGpuWeak();
      } else {
        setBasePerfTier("high");
      }
    } else {
      setBasePerfTier("low");
    }

    // Quick fps probe — catches devices the hardware/GPU checks above miss (e.g. a mid-spec
    // phone reporting 6 cores but still struggling under the browser's own load, or a desktop
    // throttled by background load). Finishes well under 2s; see lib/fpsProbe.ts.
    let cancelled = false;
    probeFps((fps) => {
      if (!cancelled && fps < 42) {
        setBasePerfTier("critical");
        markGpuWeak();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [deviceTier]);

  return null;
}
