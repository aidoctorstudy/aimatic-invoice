"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { DemoModal } from "@/components/ui/DemoModal";
import type { Locale } from "@/content/dictionaries";

type DemoModalContextValue = {
  open: (locale: Locale, presetVolume?: string) => void;
};

const DemoModalContext = createContext<DemoModalContextValue | null>(null);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ isOpen: boolean; locale: Locale; presetVolume?: string }>({
    isOpen: false,
    locale: "en",
  });

  const open = useCallback((locale: Locale, presetVolume?: string) => {
    setState({ isOpen: true, locale, presetVolume });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
  }, []);

  return (
    <DemoModalContext.Provider value={{ open }}>
      {children}
      {state.isOpen && <DemoModal locale={state.locale} presetVolume={state.presetVolume} onClose={close} />}
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const ctx = useContext(DemoModalContext);
  if (!ctx) throw new Error("useDemoModal must be used within DemoModalProvider");
  return ctx;
}
