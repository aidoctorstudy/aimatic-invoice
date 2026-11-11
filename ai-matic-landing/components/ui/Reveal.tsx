"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Fades/slides an element in the first time it enters the viewport. No-ops under reduced motion. */
export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const isVisible = visible || reducedMotion;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: reducedMotion ? "0ms" : `${delay}ms` }}
      className={clsx(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </div>
  );
}
