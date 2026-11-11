import type { SiteContent } from "@/content/types";
import { en } from "@/content/en";
import { ar } from "@/content/ar";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, SiteContent> = { en, ar };

export function getDictionary(locale: Locale): SiteContent {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
