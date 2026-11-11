"use client";

import { MagicButton } from "@/components/ui/MagicButton";
import { useDemoModal } from "@/components/providers/DemoModalProvider";
import type { Locale } from "@/content/dictionaries";

type DemoButtonProps = {
  children: React.ReactNode;
  locale: Locale;
  presetVolume?: string;
  className?: string;
  onClick?: () => void;
  /** Smaller pill footprint — used for inline row actions like the add-ons table's "Contact us". */
  compact?: boolean;
};

export function DemoButton({ children, locale, presetVolume, className, onClick, compact }: DemoButtonProps) {
  const { open } = useDemoModal();

  return (
    <MagicButton
      compact={compact}
      className={className}
      onClick={() => {
        onClick?.();
        open(locale, presetVolume);
      }}
    >
      {children}
    </MagicButton>
  );
}
