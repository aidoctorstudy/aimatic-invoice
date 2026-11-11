// Shape shared by every locale's content file (content/en.ts, content/ar.ts). Keeping this as
// a single type means TypeScript catches a missing translation at compile time.

export type TimelineItem = {
  segment: string;
  mandatory: string;
  aspDeadline: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };

  languageSwitcher: {
    /** Label shown while on THIS locale, naming the OTHER locale to switch to. */
    label: string;
  };

  nav: {
    links: Array<{ label: string; href: string }>;
    cta: string;
  };

  hero: {
    badge: string;
    headline: string;
    subtext: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustPoints: Array<{ label: string; detail: string }>;
  };

  invoicePreview: {
    eyebrow: string;
    heading: string;
    subheading: string;
    demoDisclaimer: string;
    invoiceLabel: string;
    structuredBadge: string;
    subtotalLabel: string;
    totalDueLabel: string;
    invoice: {
      id: string;
      description: string;
      quantity: string;
      subtotal: string;
      vatLabel: string;
      vat: string;
      total: string;
    };
    steps: Array<{ step: string; title: string; description: string }>;
  };

  uaeRequirements: {
    eyebrow: string;
    heading: string;
    subheading: string;
    sourceLabel: string;
    officialLinkLabel: string;
    officialLink: string;
    timeline: TimelineItem[];
  };

  readiness: {
    eyebrow: string;
    heading: string;
    cards: Array<{ title: string; description: string }>;
  };

  solution: {
    eyebrow: string;
    heading: string;
    steps: Array<{ title: string; description: string }>;
    disclaimer: string;
  };

  businessPlatform: {
    eyebrow: string;
    heading: string;
    subheading: string;
    modules: Array<{ title: string; description: string }>;
  };

  pricing: {
    eyebrow: string;
    heading: string;
    subheading: string;
    platformName: string;
    monthlyLabel: string;
    yearlyLabel: string;
    bestValueBadge: string;
    requestDemoCta: string;
    platformIncludesLabel: string;
    monthly: { price: string; period: string };
    yearly: { price: string; period: string; billedAs: string; savingsBadge: string };
    addonsHeading: string;
    addonsSubheading: string;
    addonsTableHeaders: { transactions: string; price: string };
    addons: Array<{ tier: string; price: string; contact?: boolean }>;
    contactCta: string;
    footnote: string;
  };

  pathToLaunch: {
    eyebrow: string;
    heading: string;
    steps: Array<{ title: string; description: string }>;
  };

  faq: {
    eyebrow: string;
    heading: string;
    items: Array<{ question: string; answer: string }>;
  };

  finalCta: {
    heading: string;
    subheading: string;
    cta: string;
  };

  footer: {
    links: Array<{ label: string; href: string }>;
    copyright: string;
  };

  demoForm: {
    title: string;
    subtitle: string;
    fields: {
      fullName: string;
      companyName: string;
      phone: string;
      email: string;
      volume: string;
      volumePlaceholder: string;
      message: string;
      messageOptional: string;
    };
    volumeOptions: string[];
    submitCta: string;
    submittingCta: string;
    retryCta: string;
    closeCta: string;
    successMessage: string;
    errorMessage: string;
    validation: {
      nameRequired: string;
      companyRequired: string;
      emailRequired: string;
      emailInvalid: string;
    };
  };
};
