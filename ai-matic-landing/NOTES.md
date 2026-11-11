# Arabic translation — notes for review

Phrases and decisions worth a native/legal review before shipping. Everything else was
translated with standard business MSA; this list is only the genuinely uncertain bits.

## Terminology choices

- **ASP**: kept as "مزود الخدمة المعتمد (ASP)" on first mention per section, then shortened to
  "مزود الخدمة المعتمد" or just "(ASP)" in the same breath elsewhere — matches your glossary
  but double-check the shortened in-context uses in `invoicePreview.steps`, `solution.steps`,
  and the FAQ read naturally rather than repetitively.
- **Currency**: used "AED" (not "درهم") everywhere in `content/ar.ts`, including inside
  otherwise-Arabic sentences like "الإيرادات AED 50 مليون فأكثر". This was a judgment call —
  your brief said either was fine as long as it's consistent. "درهم" would read more natively
  in flowing prose (e.g. "99 درهم شهريًا"); "AED" was chosen to exactly match the English
  pricing strings with zero risk of a transcription slip on the numbers. Easy to swap if you'd
  rather have "درهم".
- **Brand names**: "AI Matic" and "SIEZAL Group" (as "مجموعة SIEZAL") are kept in Latin script
  throughout, which is standard UAE business-Arabic convention for software brand names — flag
  if you'd actually prefer a transliteration instead.
- **"UAE Launch" badge**: translated as "إطلاق في الإمارات" (hero badge). "إطلاق" reads as
  "launch" in the product sense; if this badge is meant to echo a specific phrase used in your
  own Arabic marketing elsewhere, it may need to match that instead.

## Specific lines to double-check

- `uaeRequirements.timeline[].segment`: "الإيرادات AED 50 مليون فأكثر" / "الإيرادات أقل من
  AED 50 مليون" — these read fine but are slightly less fluent than they'd be if restructured
  around the number (Arabic business copy more often leads with the currency+number as a single
  unit). Current phrasing was chosen to stay unambiguous next to raw AED figures.
- `pricing.addons[0].tier`: "أول 100 معاملة" (First 100 transactions) — "معاملة" (transaction)
  vs "عملية" are both used in UAE fintech copy; went with "معاملة" for consistency with
  "المعاملات" in the table header, confirm that's the term your team already uses elsewhere.
- `demoForm.fields.volume`: "حجم الفواتير الشهري" (Monthly invoice volume) — reads naturally,
  but if there's an existing Arabic term used in your CRM/sales material for this field, prefer
  that for consistency with what your sales team already calls it.

## Implementation notes (not translation, but worth knowing)

- The hero section's two-column layout is intentionally **not** mirrored in Arabic — the text
  column stays physically on the left and the particle "logo" scene stays physically on the
  right in both locales. This was a direct consequence of your "don't mirror the 3D scene"
  instruction: the particle shapes assemble at fixed world positions, so mirroring the DOM
  grid around them would have put the reserved empty space on the wrong side. Every other
  section mirrors normally.
- Language preference is remembered via `localStorage` and auto-redirects a returning visitor
  from the bare domain to their last-chosen language. If you'd rather it never auto-redirect
  (and always honor whichever of /en or /ar was explicitly linked/shared), say so and I'll
  drop that behavior — it's a small, isolated piece in `components/providers/LocaleSync.tsx`.
