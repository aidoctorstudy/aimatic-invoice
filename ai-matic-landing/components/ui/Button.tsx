import Link from "next/link";
import { clsx } from "clsx";

export const buttonBaseClass =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap";

export const buttonVariantClass = {
  primary: "brand-gradient text-white shadow-[0_8px_24px_-8px_rgba(28,164,148,0.55)]",
  secondary:
    "border border-border bg-white/80 text-foreground hover:border-brand-teal/40 hover:text-brand-teal",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  return (
    <Link href={href} className={clsx(buttonBaseClass, buttonVariantClass[variant], className)}>
      {children}
    </Link>
  );
}
