"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Initializes Lenis smooth scrolling for the page. No-ops when reduced motion is preferred,
 * and on touch devices — native scroll is already smooth there, Lenis's wheel-based smoothing
 * mainly adds overhead (and a layer of scroll-event interception) on top of it. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Lenis only re-measures its scroll limit on window resize by default, so it goes
    // stale once lazy-mounted content (3D canvases, images) grows the page after init.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, [enabled]);
}
