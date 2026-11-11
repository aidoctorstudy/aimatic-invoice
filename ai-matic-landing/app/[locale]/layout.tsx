import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ParticlePerfProvider } from "@/components/providers/ParticlePerfProvider";
import { DemoModalProvider } from "@/components/providers/DemoModalProvider";
import { LocaleSync } from "@/components/providers/LocaleSync";
import { ParticleUniverse } from "@/components/three/ParticleUniverse";
import { locales, isLocale, defaultLocale, getDictionary, type Locale } from "@/content/dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arabicSans = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);

  return {
    title: t.meta.title,
    description: t.meta.description,
    // Without this, Next falls back to resolving relative canonical/hreflang URLs (and any
    // future OG/twitter image) against localhost:3000 in the generated HTML — harmless in dev,
    // wrong once this is live at the real domain. NEXT_PUBLIC_SITE_URL lets a staging deploy
    // override it; aimatic.ae is the production default.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aimatic.ae"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": `/${defaultLocale}`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${arabicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleSync locale={locale} />
        <SmoothScrollProvider>
          <ParticlePerfProvider />
          <ParticleUniverse />
          <DemoModalProvider>
            <div className="relative z-10 flex min-h-full flex-col">
              <Navbar locale={locale} />
              {children}
              <Footer locale={locale} />
            </div>
          </DemoModalProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
