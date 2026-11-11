import { clsx } from "clsx";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border border-border bg-brand-teal-tint px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-blue",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full brand-gradient" />
      {children}
    </span>
  );
}
