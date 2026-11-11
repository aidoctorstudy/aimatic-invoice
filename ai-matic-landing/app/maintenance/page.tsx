import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AI Matic — Under Maintenance",
  description: "We're making some improvements. Back shortly.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "Geist, Arial, Helvetica, sans-serif",
        background:
          "linear-gradient(135deg, #e8f6f4 0%, #ffffff 55%, #eef2f5 100%)",
        color: "#0b1220",
      }}
    >
      <Image
        src="/ai-matic-logo.png"
        alt="AI Matic"
        width={160}
        height={48}
        priority
        style={{ height: "auto", width: "160px" }}
      />

      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
          fontWeight: 600,
          margin: 0,
          backgroundImage: "linear-gradient(135deg, #1ca494 0%, #0c284c 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        We&apos;ll be right back
      </h1>

      <p
        style={{
          maxWidth: "32rem",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          color: "#5b6572",
          margin: 0,
        }}
      >
        AI Matic is currently undergoing scheduled maintenance. We&apos;re working
        hard to improve your experience and will be back online shortly.
      </p>

      <p style={{ fontSize: "0.9rem", color: "#5b6572", margin: 0 }}>
        Thanks for your patience.
      </p>
    </div>
  );
}
