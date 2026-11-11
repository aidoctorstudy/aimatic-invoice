import { Building2, Store } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { getDictionary, type Locale } from "@/content/dictionaries";

const TIMELINE_ICONS = [Building2, Store];

export function UaeRequirements({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).uaeRequirements;

  return (
    <section id="uae-requirements" data-chapter="2" className="relative py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} subheading={t.subheading} />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            aria-hidden
            className="absolute left-1/2 top-6 hidden h-px w-full -translate-x-1/2 bg-border md:block"
          />
          <ol className="grid gap-6 md:grid-cols-2">
            {t.timeline.map((item, i) => {
              const Icon = TIMELINE_ICONS[i] ?? Building2;
              return (
                <Reveal key={item.segment} delay={i * 120}>
                  <li>
                    <Card className="flex h-full flex-col gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full brand-gradient text-white">
                        <Icon className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">{item.segment}</h3>
                      <div className="mt-auto flex flex-col gap-2">
                        <span className="inline-flex w-fit items-center rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold text-brand-blue">
                          {item.mandatory}
                        </span>
                        <span className="text-sm text-foreground-muted">{item.aspDeadline}</span>
                      </div>
                    </Card>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <Reveal delay={360}>
          <p className="mt-10 text-sm text-foreground-muted">
            {t.sourceLabel}{" "}
            <a
              href={t.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-teal underline underline-offset-4 hover:text-brand-blue"
            >
              {t.officialLinkLabel}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
