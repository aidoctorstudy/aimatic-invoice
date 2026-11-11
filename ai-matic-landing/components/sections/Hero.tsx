"use client";

import { Button } from "@/components/ui/Button";
import { DemoButton } from "@/components/ui/DemoButton";
import { SceneFallback } from "@/components/three/SceneFallback";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useWebglSupport } from "@/lib/useWebglSupport";
import { getDictionary, type Locale } from "@/content/dictionaries";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).hero;
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebglSupport();
  const showFallback = !reducedMotion && webglSupported === false;

  return (
    <section
      id="top"
      data-chapter="0"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:min-h-[120vh] lg:pt-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(28,164,148,0.08),transparent)]"
      />

      {/* Forced ltr: the particle scene's "logo" shape always assembles on the physical right
          of the viewport at lg+ (its world position isn't locale-aware, matching the "don't
          mirror the 3D scene" requirement), so the desktop column order stays fixed in both
          locales — only the text inside re-enables its own direction. Below lg the two blocks
          stack vertically instead, so left/right order doesn't apply there. */}
      <div dir="ltr" className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="relative z-10 order-2 flex flex-col items-start gap-6 rounded-3xl bg-white/92 p-4 text-start sm:p-6 lg:order-1 lg:bg-transparent lg:p-0"
        >
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.headline}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-foreground-muted">{t.subtext}</p>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <DemoButton locale={locale} className="w-full md:w-auto">
              {t.ctaPrimary}
            </DemoButton>
            <Button href="#uae-requirements" variant="secondary" className="w-full md:w-auto">
              {t.ctaSecondary}
            </Button>
          </div>

          <dl className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {t.trustPoints.map((point) => (
              <div key={point.label} className="rounded-xl border border-border bg-surface/60 p-4">
                <dt className="text-sm font-semibold text-brand-blue">{point.label}</dt>
                <dd className="mt-1 text-xs text-foreground-muted">{point.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Normally empty — the global particle scene assembles its "logo" shape here. Only
            shows content when WebGL is unavailable (incl. software-rendered), as a static
            substitute for that scene. Above the text and full width below lg; beside it at lg+. */}
        <div
          aria-hidden
          className="order-1 flex h-[220px] w-full items-center justify-center sm:h-[260px] md:h-[320px] lg:order-2 lg:h-[640px]"
        >
          {showFallback && <SceneFallback />}
        </div>
      </div>
    </section>
  );
}
