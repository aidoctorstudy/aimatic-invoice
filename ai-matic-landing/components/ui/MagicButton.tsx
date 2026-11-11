"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useDeviceTier } from "@/lib/useDeviceTier";

type MagicButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  /** Smaller pill footprint — used for inline row actions like the add-ons table's "Contact us". */
  compact?: boolean;
};

const SPARKS = [
  { x: "4%", y: "10%", delay: "0s", dur: "2.6s" },
  { x: "92%", y: "15%", delay: "0.6s", dur: "2.2s" },
  { x: "18%", y: "-6%", delay: "1.1s", dur: "2.9s" },
  { x: "78%", y: "-10%", delay: "0.3s", dur: "2.4s" },
  { x: "50%", y: "-14%", delay: "1.6s", dur: "2.7s" },
  { x: "8%", y: "88%", delay: "0.9s", dur: "2.3s" },
];

/** A pill button with a glowing teal border that flares into animated flame-like energy wisps
 * on hover/press — built from a thick blurred SVG stroke run through feTurbulence +
 * feDisplacementMap (not WebGL), so it's cheap enough to use everywhere. The displaced stroke is
 * what gives the licking-flame silhouette; a thin crisp stroke on top keeps the clean neon
 * outline readable through the chaos, same as the reference. */
export function MagicButton({ children, href, onClick, type = "button", className, compact }: MagicButtonProps) {
  const filterId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const deviceTier = useDeviceTier();
  const simplified = reducedMotion || deviceTier === "low";

  const [inView, setInView] = useState(false);
  const [hot, setHot] = useState(false); // hover/focus — sustained brighten
  const [flaring, setFlaring] = useState(false); // press/click — brief burst

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const flare = () => {
    setFlaring(true);
    window.setTimeout(() => setFlaring(false), 650);
  };

  const active = hot || flaring;
  const showWisp = inView && !simplified;
  const strokeW = flaring ? 30 : hot ? 20 : 12;
  const dispScale = flaring ? 46 : hot ? 30 : 16;

  const content = (
    <span
      ref={wrapRef}
      className="relative inline-block isolate"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      onPointerDown={flare}
    >
      {/* Soft ambient halo — pure CSS, works even when the SVG wisp layer is skipped. Deeper and
          more saturated than a "glow on black" treatment needs, so it still reads on white. */}
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-full blur-xl transition-[opacity,transform] duration-500 ease-out",
          active ? "scale-125 opacity-100" : "opacity-55"
        )}
        style={{
          background: "radial-gradient(closest-side, rgba(28,164,148,0.7), rgba(12,40,76,0.3) 65%, transparent 78%)",
        }}
      />

      {showWisp && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <defs>
            {/* Region is heavily biased upward — flames should lick up off the top edge and
                corners, not spread evenly, same as the reference. */}
            <filter id={filterId} x="-70%" y="-340%" width="240%" height="560%" filterUnits="objectBoundingBox">
              <feGaussianBlur in="SourceGraphic" stdDeviation={flaring ? 3 : 2} result="softened" />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025 0.09"
                numOctaves="3"
                seed="3"
                stitchTiles="stitch"
                result="noise"
              >
                <animate
                  attributeName="seed"
                  dur="2.2s"
                  values="2;11;5;14;8;17;3;12;6;2"
                  calcMode="discrete"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="softened" in2="noise" scale={dispScale} xChannelSelector="R" yChannelSelector="G" result="flame" />
              <feGaussianBlur in="flame" stdDeviation="1" />
            </filter>
          </defs>

          {/* Flame body: thick stroke, heavily displaced — this is what produces the licking
              fingers of "fire" around the border. */}
          <rect
            x="3%"
            y="6%"
            width="94%"
            height="88%"
            rx="999"
            fill="none"
            stroke="#1CA494"
            strokeWidth={strokeW}
            opacity={active ? 0.85 : 0.5}
            filter={`url(#${filterId})`}
          />

          {/* Crisp core line, unfiltered — keeps a clean neon outline readable through the
              flame chaos, same as the reference. */}
          <rect
            x="2%"
            y="4%"
            width="96%"
            height="92%"
            rx="999"
            fill="none"
            stroke="#5EEAD4"
            strokeWidth={flaring ? 2.4 : 1.6}
            opacity={active ? 1 : 0.85}
          />

          {active &&
            SPARKS.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={flaring ? 2.2 : 1.4}
                fill="#AFF5EA"
                style={{
                  animation: `magic-spark ${s.dur} ease-in-out ${s.delay} infinite`,
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              />
            ))}
        </svg>
      )}

      <Core href={href} onClick={onClick} type={type} compact={compact} className={className}>
        {children}
      </Core>
    </span>
  );

  return content;
}

function Core({
  href,
  onClick,
  type,
  compact,
  className,
  children,
}: {
  href?: string;
  onClick?: () => void;
  type: "button" | "submit";
  compact?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = clsx(
    "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full brand-gradient font-semibold text-white",
    "shadow-[0_8px_24px_-6px_rgba(12,40,76,0.55)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2",
    compact ? "min-h-11 px-4 py-2 text-xs" : "px-6 py-3 text-sm",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
