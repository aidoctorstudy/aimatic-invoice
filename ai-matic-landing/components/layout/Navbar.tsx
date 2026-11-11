"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { DemoButton } from "@/components/ui/DemoButton";
import { rememberLocale } from "@/components/providers/LocaleSync";
import { getDictionary, type Locale } from "@/content/dictionaries";

export function Navbar({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = getDictionary(locale);
  const otherLocale: Locale = locale === "en" ? "ar" : "en";

  return (
    <header className="navbar-glass fixed top-0 z-50 w-full border-b border-border/60 bg-white lg:bg-white/75 lg:backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" aria-label="AI Matic home" className="inline-flex items-center p-2 -m-2">
          <Logo />
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {t.nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 min-w-11 items-center justify-center px-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-brand-teal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={`/${otherLocale}`}
            onClick={() => rememberLocale(otherLocale)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-brand-teal"
          >
            {t.languageSwitcher.label}
          </Link>
          <DemoButton locale={locale}>{t.nav.cta}</DemoButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute start-0 top-0 h-[1.5px] w-5 bg-foreground transition-transform duration-200 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute start-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-foreground transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 start-0 h-[1.5px] w-5 bg-foreground transition-transform duration-200 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-white px-6 pb-8 pt-4 shadow-lg lg:hidden">
          <ul className="flex flex-col gap-1">
            {t.nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href={`/${otherLocale}`}
                onClick={() => {
                  rememberLocale(otherLocale);
                  setOpen(false);
                }}
                className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface"
              >
                {t.languageSwitcher.label}
              </Link>
            </li>
          </ul>
          <DemoButton locale={locale} onClick={() => setOpen(false)} className="mt-4 w-full">
            {t.nav.cta}
          </DemoButton>
        </div>
      )}
    </header>
  );
}
