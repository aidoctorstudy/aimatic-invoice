"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/content/dictionaries";

const STORAGE_KEY = "aimatic-locale";

export function rememberLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage unavailable (private mode, disabled storage) — language switch still works,
    // it just won't be remembered on the next visit.
  }
}

/** On first mount, if a previously-remembered locale differs from the one just loaded, swap to
 * it client-side. Keeps a returning visitor's language choice sticky across fresh visits to the
 * bare domain, without needing a cookie or server-side lookup. */
export function LocaleSync({ locale }: { locale: Locale }) {
  const router = useRouter();

  useEffect(() => {
    let remembered: string | null = null;
    try {
      remembered = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (remembered && remembered !== locale && (remembered === "en" || remembered === "ar")) {
      router.replace(`/${remembered}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
