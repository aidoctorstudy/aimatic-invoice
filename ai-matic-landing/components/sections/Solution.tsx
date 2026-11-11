import { FileCheck2, Link2, Eye, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/content/dictionaries";

const STEP_ICONS = [FileCheck2, Link2, Eye, Rocket];

export function Solution({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).solution;

  return (
    <section data-chapter="3" className="relative py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} align="center" />

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px brand-gradient opacity-30 md:block"
          />
          <ol className="grid gap-8 md:grid-cols-4">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? FileCheck2;
              return (
                <Reveal key={step.title} delay={i * 120}>
                  <li className="flex flex-col items-center gap-3 text-center">
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

        <Reveal delay={420}>
          <p className="glass-panel mx-auto mt-16 max-w-3xl rounded-2xl px-6 py-5 text-center text-sm leading-relaxed text-foreground-muted">
            {t.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
