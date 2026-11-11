import { clsx } from "clsx";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, heading, subheading, align = "left", className }: Props) {
  return (
    <Reveal
      className={clsx(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal">{eyebrow}</span>
      <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
        {heading}
      </h2>
      {subheading && (
        <p className="max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">{subheading}</p>
      )}
    </Reveal>
  );
}
