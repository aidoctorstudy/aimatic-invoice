import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { getDictionary, type Locale } from "@/content/dictionaries";

export function Readiness({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).readiness;

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} />

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {t.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 120}>
              <Card className="h-full">
                <h3 className="text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{card.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
