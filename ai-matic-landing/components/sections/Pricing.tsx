import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DemoButton } from "@/components/ui/DemoButton";
import { CoinFallback } from "@/components/three/CoinFallback";
import { getDictionary, type Locale } from "@/content/dictionaries";

function PlatformIncludes({ label, modules }: { label: string; modules: Array<{ title: string }> }) {
  return (
    <div className="mt-8 border-t border-border pt-6 text-start">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{label}</p>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {modules.map((module) => (
          <li key={module.title} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full brand-gradient" />
            {module.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Pricing({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pricing;
  const modules = dict.businessPlatform.modules;
  const contactVolume = dict.demoForm.volumeOptions[dict.demoForm.volumeOptions.length - 1];

  return (
    <section id="pricing" data-chapter="5" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} subheading={t.subheading} align="center" />

        {/* Reserved open space — the global particle scene assembles the coin here, above
            the cards, so it never sits over either one on any screen size. */}
        <div aria-hidden className="h-28 sm:h-36 lg:h-48">
          <CoinFallback />
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <Reveal delay={100}>
            <div className="relative lg:scale-[1.04]">
              {/* Static, non-rotating clip boundary — the glow inside spins continuously, and a
                  rotating element's own axis-aligned bounding box balloons well past its resting
                  size at non-90° angles (up to ~2x), which would otherwise inflate the page's
                  scrollable width on every render. Clipping here keeps that contained. */}
              <div aria-hidden className="absolute -inset-4 overflow-hidden rounded-[2.25rem]">
                <div className="pricing-glow motion-reduce:animate-none absolute inset-[-50%] opacity-60 blur-2xl" />
              </div>
              <span className="absolute -top-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center whitespace-nowrap rounded-full brand-gradient px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                {t.bestValueBadge}
              </span>
              <div className="relative overflow-hidden rounded-3xl p-[2px] shadow-[0_28px_60px_-25px_rgba(12,40,76,0.45)]">
                <div aria-hidden className="pricing-glow motion-reduce:animate-none absolute inset-0" />
                <div className="relative flex h-full flex-col rounded-[calc(1.5rem-2px)] bg-white px-8 py-10 text-center sm:px-10">
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">{t.platformName}</p>
                  <p className="mt-2 text-xs font-medium text-foreground-muted">{t.yearlyLabel}</p>

                  <div className="mt-4 flex items-end justify-center gap-2">
                    <span className="text-5xl font-bold tracking-tight text-foreground">{t.yearly.price}</span>
                    <span className="pb-1.5 text-base font-medium text-foreground-muted">{t.yearly.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground-muted">{t.yearly.billedAs}</p>
                  <span className="mx-auto mt-3 inline-flex w-fit items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-brand-blue">
                    {t.yearly.savingsBadge}
                  </span>

                  <DemoButton locale={locale} className="mt-8 w-full">
                    {t.requestDemoCta}
                  </DemoButton>

                  <PlatformIncludes label={t.platformIncludesLabel} modules={modules} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-white px-8 py-10 text-center shadow-[0_20px_50px_-30px_rgba(12,40,76,0.25)] sm:px-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">{t.platformName}</p>
              <p className="mt-2 text-xs font-medium text-foreground-muted">{t.monthlyLabel}</p>

              <div className="mt-4 flex items-end justify-center gap-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">{t.monthly.price}</span>
                <span className="pb-1.5 text-base font-medium text-foreground-muted">{t.monthly.period}</span>
              </div>

              <DemoButton locale={locale} className="mt-8 w-full">
                {t.requestDemoCta}
              </DemoButton>

              <PlatformIncludes label={t.platformIncludesLabel} modules={modules} />
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground">{t.addonsHeading}</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-foreground-muted">{t.addonsSubheading}</p>
            </div>
          </Reveal>

          {/* Desktop / tablet table */}
          <Reveal delay={120}>
            <div className="mx-auto mt-10 hidden max-w-2xl overflow-hidden rounded-2xl border border-border md:block">
              <table className="w-full border-collapse text-start">
                <thead>
                  <tr className="brand-gradient text-white">
                    <th className="px-6 py-4 text-sm font-semibold">{t.addonsTableHeaders.transactions}</th>
                    <th className="px-6 py-4 text-sm font-semibold">{t.addonsTableHeaders.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.addons.map((row, i) => (
                    <tr key={row.tier} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{row.tier}</td>
                      <td className="px-6 py-4">
                        {row.contact ? (
                          <DemoButton locale={locale} compact presetVolume={contactVolume}>
                            {t.contactCta}
                          </DemoButton>
                        ) : (
                          <span className="text-sm font-bold text-brand-teal">{row.price}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Mobile stacked cards */}
          <div className="mt-10 flex flex-col gap-3 md:hidden">
            {t.addons.map((row, i) => (
              <Reveal key={row.tier} delay={i * 40}>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4">
                  <p className="min-w-0 flex-1 text-sm font-semibold text-foreground">{row.tier}</p>
                  {row.contact ? (
                    <DemoButton locale={locale} compact presetVolume={contactVolume} className="shrink-0">
                      {t.contactCta}
                    </DemoButton>
                  ) : (
                    <span className="shrink-0 text-base font-bold text-brand-teal">{row.price}</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-6 text-center text-xs text-foreground-muted">* {t.footnote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
