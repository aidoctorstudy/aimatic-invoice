import { Hero } from "@/components/sections/Hero";
import { InvoicePreview } from "@/components/sections/InvoicePreview";
import { UaeRequirements } from "@/components/sections/UaeRequirements";
import { Readiness } from "@/components/sections/Readiness";
import { Solution } from "@/components/sections/Solution";
import { BusinessPlatform } from "@/components/sections/BusinessPlatform";
import { Pricing } from "@/components/sections/Pricing";
import { PathToLaunch } from "@/components/sections/PathToLaunch";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { locales, isLocale, defaultLocale, type Locale } from "@/content/dictionaries";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <main>
      <Hero locale={locale} />
      <InvoicePreview locale={locale} />
      <UaeRequirements locale={locale} />
      <Readiness locale={locale} />
      <Solution locale={locale} />
      <BusinessPlatform locale={locale} />
      <Pricing locale={locale} />
      <PathToLaunch locale={locale} />
      <Faq locale={locale} />
      <FinalCta locale={locale} />
    </main>
  );
}
