import { clsx } from "clsx";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-2xl border-border p-6 shadow-[0_20px_50px_-30px_rgba(12,40,76,0.25)] transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
