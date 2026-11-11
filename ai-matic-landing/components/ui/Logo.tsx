import Image from "next/image";
import { clsx } from "clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/ai-matic-logo-navbar.png"
      alt="AI Matic"
      width={407}
      height={96}
      priority
      className={clsx("h-8 w-auto", className)}
    />
  );
}
