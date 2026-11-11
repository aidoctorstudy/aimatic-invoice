"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { CONTACT_EMAIL } from "@/content/shared";
import { getDictionary, type Locale } from "@/content/dictionaries";

type Props = {
  locale: Locale;
  presetVolume?: string;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20";

export function DemoModal({ locale, presetVolume, onClose }: Props) {
  const t = getDictionary(locale).demoForm;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => nameRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("_honey")) return;

    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = t.validation.nameRequired;
    if (!company) nextErrors.company = t.validation.companyRequired;
    if (!email) nextErrors.email = t.validation.emailRequired;
    else if (!EMAIL_RE.test(email)) nextErrors.email = t.validation.emailInvalid;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          company,
          phone: String(data.get("phone") || ""),
          email,
          volume: String(data.get("volume") || ""),
          message: String(data.get("message") || ""),
          language: locale === "ar" ? "Arabic" : "English",
          _subject: "New AI Matic demo request",
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      // FormSubmit returns HTTP 200 even when it didn't deliver the message — e.g. on an
      // unactivated endpoint it replies { success: "false" } and emails an activation link
      // instead. Only treat an explicit success as success.
      const json: { success?: string } = await res.json();
      if (json.success !== "true") throw new Error("Not delivered");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-heading"
    >
      <div aria-hidden className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-3xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-lg sm:rounded-3xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeCta}
          className="absolute end-4 top-4 rounded-full p-2 text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-brand-accent" />
            <p className="mt-4 text-lg font-semibold text-foreground">{t.successMessage}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full border border-border px-6 py-2 text-sm font-semibold text-foreground hover:border-brand-teal/40 hover:text-brand-teal"
            >
              {t.closeCta}
            </button>
          </div>
        ) : (
          <>
            <h2 id="demo-modal-heading" className="pe-8 text-xl font-bold text-foreground">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">{t.subtitle}</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.fields.fullName}</span>
                <input ref={nameRef} type="text" name="name" className={inputClass} />
                {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.fields.companyName}</span>
                <input type="text" name="company" className={inputClass} />
                {errors.company && <span className="text-xs text-red-600">{errors.company}</span>}
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.fields.phone}</span>
                <input type="tel" name="phone" className={inputClass} />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.fields.email}</span>
                <input type="email" name="email" className={inputClass} />
                {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.fields.volume}</span>
                <select name="volume" defaultValue={presetVolume ?? ""} className={inputClass}>
                  <option value="">{t.fields.volumePlaceholder}</option>
                  {t.volumeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">
                  {t.fields.message} <span className="font-normal text-foreground-muted">{t.fields.messageOptional}</span>
                </span>
                <textarea name="message" rows={3} className={inputClass} />
              </label>

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t.errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(28,164,148,0.55)] transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              >
                {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "submitting" ? t.submittingCta : status === "error" ? t.retryCta : t.submitCta}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
