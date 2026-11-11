"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/content/dictionaries";

export function Faq({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} align="center" />

        <div className="mt-12 flex flex-col gap-3">
          {t.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.question} delay={i * 60}>
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
                  >
                    <span className="font-semibold text-foreground">{item.question}</span>
                    <span
                      className={clsx(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white transition-transform duration-300",
                        isOpen && "rotate-45"
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-foreground-muted">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
