import { Logo } from "@/components/ui/Logo";
import { getDictionary, type Locale } from "@/content/dictionaries";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).footer;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-start">
        <Logo />

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {t.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-sm text-foreground-muted hover:text-brand-teal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-sm text-foreground-muted">{t.copyright}</p>
      </div>
    </footer>
  );
}
