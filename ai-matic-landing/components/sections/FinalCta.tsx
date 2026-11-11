import { Reveal } from "@/components/ui/Reveal";
import { DemoButton } from "@/components/ui/DemoButton";
import { getDictionary, type Locale } from "@/content/dictionaries";

export function FinalCta({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).finalCta;

  return (
    <section id="final-cta" className="relative overflow-hidden py-24 sm:py-28">
      <div aria-hidden className="absolute inset-0 brand-gradient" />
      <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">{t.subheading}</p>
          <div className="mt-8 flex justify-center">
            <DemoButton locale={locale} className="px-7">
              {t.cta}
            </DemoButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
