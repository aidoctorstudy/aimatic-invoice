"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLenis } from "@/lib/useLenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);

  return <>{children}</>;
}
