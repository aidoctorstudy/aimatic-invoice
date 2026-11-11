"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, FileCheck2, PlugZap, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getDictionary, type Locale } from "@/content/dictionaries";

const STEP_ICONS = [Search, FileCheck2, PlugZap, Rocket];

export function PathToLaunch({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).pathToLaunch;
  const outerRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !lineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="path-to-launch"
      ref={outerRef}
      data-chapter="6"
      className="relative py-24 sm:py-28"
    >
      <div ref={sectionRef} className="relative mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} align="center" />

        <div className="relative mt-20">
          <div aria-hidden className="absolute start-0 end-0 top-6 hidden h-1 rounded-full bg-border md:block" />
          <div
            ref={lineRef}
            aria-hidden
            className="absolute start-0 top-6 hidden h-1 w-full origin-left rtl:origin-right rounded-full brand-gradient md:block"
            style={{ transform: "scaleX(0)" }}
          />

          <ol className="grid gap-10 md:grid-cols-4">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Search;
              return (
                <Reveal key={step.title} delay={i * 100}>
                  <li className="relative flex flex-col items-center gap-3 text-center">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full brand-gradient text-white">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-foreground-muted">{step.description}</p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
