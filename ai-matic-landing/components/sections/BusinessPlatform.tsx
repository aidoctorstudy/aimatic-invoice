import { ShoppingCart, Boxes, Truck, Calculator, Users, Receipt, GitBranch, BarChart3 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { getDictionary, type Locale } from "@/content/dictionaries";

const MODULE_ICONS = [ShoppingCart, Boxes, Truck, Calculator, Users, Receipt, GitBranch, BarChart3];

export function BusinessPlatform({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).businessPlatform;

  return (
    <section id="business-platform" data-chapter="4" className="relative py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} subheading={t.subheading} align="center" />

        <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {t.modules.map((module, i) => {
            const Icon = MODULE_ICONS[i] ?? ShoppingCart;
            return (
              <Reveal key={module.title} delay={i * 70}>
                <Card className="flex h-full flex-col gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white">
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <h3 className="text-base font-semibold leading-snug text-foreground">{module.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">{module.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
