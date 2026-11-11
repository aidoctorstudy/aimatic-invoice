"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getSnapshot(): boolean {
  return document.visibilityState === "visible";
}

function getServerSnapshot(): boolean {
  return true;
}

/** Drives the particle Canvas's frameloop — stops the WebGL render loop entirely while the
 * tab is backgrounded (the canvas is a full-viewport fixed layer, so "visible" here reduces
 * to tab visibility; there's no separate on/off-screen state for it to scroll into or out of). */
export function useTabVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
