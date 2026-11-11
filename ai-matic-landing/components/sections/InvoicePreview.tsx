import { FileCheck2, Link2, Eye } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/content/dictionaries";

const STEP_ICONS = [FileCheck2, Link2, Eye];

export function InvoicePreview({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).invoicePreview;
  const { invoice } = t;

  return (
    <section id="invoice-preview" data-chapter="1" className="relative py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} subheading={t.subheading} />

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-10">
          <Reveal delay={100}>
            <div className="glass-panel relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-[0_30px_80px_-35px_rgba(12,40,76,0.4)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full rtl:translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent [animation:shimmer_3.5s_ease-in-out_infinite]"
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    {t.invoiceLabel}
                  </p>
                  <p className="text-lg font-bold text-foreground">{invoice.id}</p>
                </div>
                <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-semibold text-brand-teal">
                  {t.structuredBadge}
                </span>
              </div>

              <div className="relative mt-6 space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">{invoice.description}</span>
                  <span className="font-medium text-foreground">{invoice.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">{t.subtotalLabel}</span>
                  <span className="font-medium text-foreground">{invoice.subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">{invoice.vatLabel}</span>
                  <span className="font-medium text-foreground">{invoice.vat}</span>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between rounded-xl brand-gradient px-4 py-4 text-white">
                <span className="text-sm font-semibold">{t.totalDueLabel}</span>
                <span className="text-xl font-bold">{invoice.total}</span>
              </div>

              <p className="relative mt-4 text-center text-xs italic text-foreground-muted">{t.demoDisclaimer}</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? FileCheck2;
              return (
                <Reveal key={step.step} delay={150 + i * 120}>
                  <div className="flex gap-4 rounded-2xl border border-border bg-white/60 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full brand-gradient text-white">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm text-foreground-muted">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
