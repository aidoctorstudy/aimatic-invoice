// English content — single source of truth for all English copy. Mirrors content/ar.ts field
// for field (see content/types.ts).

import type { SiteContent } from "@/content/types";
import { YEARLY_BILLED_TOTAL } from "@/content/shared";

export const en: SiteContent = {
  meta: {
    title: "AI Matic — UAE e-Invoicing. Simplified.",
    description:
      "AI Matic by SIEZAL Group: the all-in-one business platform preparing UAE businesses for e-Invoicing, launching November 2026.",
  },

  languageSwitcher: {
    label: "العربية",
  },

  nav: {
    links: [
      { label: "e-Invoicing", href: "#invoice-preview" },
      { label: "Business Platform", href: "#business-platform" },
      { label: "UAE Requirements", href: "#uae-requirements" },
      { label: "Pricing", href: "#pricing" },
      { label: "Getting Started", href: "#path-to-launch" },
    ],
    cta: "Request a demo",
  },

  hero: {
    badge: "UAE LAUNCH · NOVEMBER 2026",
    headline: "UAE e-Invoicing. Simplified.",
    subtext:
      "Prepare for UAE e-Invoicing with one intelligent business platform — built to turn your documents into structured, exchange-ready data without re-building how your business already works.",
    ctaPrimary: "Request a demo",
    ctaSecondary: "Explore UAE requirements",
    trustPoints: [
      { label: "UAE focused", detail: "Built around PINT-AE & FTA timelines" },
      { label: "ASP connected", detail: "Exchange-ready via an appointed ASP" },
      { label: "Guided onboarding", detail: "Step-by-step readiness, not a scramble" },
    ],
  },

  invoicePreview: {
    eyebrow: "See it in action",
    heading: "From document to structured data.",
    subheading:
      "A demo invoice, the way AI Matic prepares it for exchange — plain PDF in, structured e-invoice out.",
    demoDisclaimer: "Fictional demo data for illustration only — not a real transaction.",
    invoiceLabel: "Invoice",
    structuredBadge: "Structured",
    subtotalLabel: "Subtotal",
    totalDueLabel: "Total due",
    invoice: {
      id: "INV-2026-001",
      description: "Wholesale goods",
      quantity: "500 units",
      subtotal: "AED 33,000.00",
      vatLabel: "VAT (5%)",
      vat: "AED 1,650.00",
      total: "AED 34,650.00",
    },
    steps: [
      {
        step: "01",
        title: "Prepare",
        description: "Your invoice data is structured and validated against UAE e-invoicing rules.",
      },
      {
        step: "02",
        title: "Connect",
        description: "Structured data is exchanged through your appointed ASP.",
      },
      {
        step: "03",
        title: "Track",
        description: "Status, acknowledgements, and archive — all visible in one place.",
      },
    ],
  },

  uaeRequirements: {
    eyebrow: "UAE Requirements",
    heading: "A PDF is a document. An e-Invoice is structured data.",
    subheading:
      "The UAE's e-invoicing mandate rolls out in phases. Knowing your deadline is the first step to readiness.",
    sourceLabel: "Source:",
    officialLinkLabel: "Official Ministry of Finance guidance",
    officialLink: "https://mof.gov.ae/en/about-us/initiatives/einvoicing/",
    timeline: [
      {
        segment: "Revenue AED 50M+",
        mandatory: "Mandatory 1 Jan 2027",
        aspDeadline: "ASP appointment deadline 30 Oct 2026",
      },
      {
        segment: "Revenue below AED 50M",
        mandatory: "Mandatory 1 Jul 2027",
        aspDeadline: "ASP deadline 31 Mar 2027",
      },
    ],
  },

  readiness: {
    eyebrow: "Readiness",
    heading: "Three things to get in order before go-live.",
    cards: [
      {
        title: "Data",
        description:
          "Customer, supplier, and product records clean and consistent enough to structure automatically.",
      },
      {
        title: "Workflows",
        description:
          "Invoicing, approvals, and exceptions mapped so exchange fits how your team already works.",
      },
      {
        title: "People",
        description: "Finance and ops teams briefed on what changes, what doesn't, and who owns what.",
      },
    ],
  },

  solution: {
    eyebrow: "The Solution",
    heading: "One platform, four steps.",
    steps: [
      { title: "Prepare", description: "Clean and structure your invoice data ahead of the mandate." },
      { title: "Connect", description: "Exchange through your appointed ASP, without changing how you invoice." },
      { title: "See clearly", description: "Track every invoice's status and archive in one dashboard." },
      { title: "Move forward", description: "Scale readiness into the rest of your business operations." },
    ],
    disclaimer:
      "AI Matic is a software brand of SIEZAL Group. Accredited exchange requires an appointed Accredited Service Provider (ASP). AI Matic does not claim Ministry of Finance accreditation.",
  },

  businessPlatform: {
    eyebrow: "Business Platform",
    heading: "Everything your business runs on, in one place.",
    subheading: "e-Invoicing readiness is one module in a platform built to run the rest of your operations.",
    modules: [
      { title: "Point of Sale", description: "Fast, reliable checkout for retail and hospitality." },
      { title: "Inventory & Warehouses", description: "Stock visibility across every location." },
      { title: "Purchasing & Suppliers", description: "Purchase orders and supplier records in sync." },
      { title: "Finance & Accounts", description: "Ledgers, reconciliation, and reporting together." },
      { title: "HR & Payroll", description: "Staff records, attendance, and payroll in one flow." },
      { title: "UAE e-Invoicing", description: "Structured, exchange-ready invoicing built for the mandate." },
      { title: "Branches & Approvals", description: "Multi-branch control with clear approval chains." },
      { title: "Reporting & Intelligence", description: "Live dashboards across every module." },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: "Simple pricing, built for UAE businesses.",
    subheading: "One subscription for the platform, pay only for the e-invoice volume you use.",
    platformName: "AI Matic Platform",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    bestValueBadge: "Best value",
    requestDemoCta: "Request a demo",
    platformIncludesLabel: "Platform includes",
    monthly: { price: "AED 99", period: "/month" },
    yearly: {
      price: "AED 74",
      period: "/month",
      billedAs: `billed yearly at ${YEARLY_BILLED_TOTAL}`,
      savingsBadge: "Save 24%",
    },
    addonsHeading: "Transaction add-ons",
    addonsSubheading: "Storage for your e-invoice data, exchanged and archived with your ASP.",
    addonsTableHeaders: { transactions: "Transactions", price: "AI Matic price" },
    addons: [
      { tier: "First 100 transactions", price: "Free*" },
      { tier: "100 more transactions", price: "AED 29" },
      { tier: "500 transactions", price: "AED 149" },
      { tier: "1,000 transactions", price: "AED 299" },
      { tier: "5,000 transactions", price: "AED 1,199" },
      { tier: "10,000 transactions", price: "AED 2,399" },
      { tier: "50,000 transactions", price: "AED 9,999" },
      { tier: "100,000 transactions", price: "AED 16,999" },
      { tier: "More than 100,000 transactions", price: "", contact: true },
    ],
    contactCta: "Contact us",
    footnote:
      "First 100 e-invoice transactions included free with an active AI Matic subscription. Additional transactions are billed per the tiers above.",
  },

  pathToLaunch: {
    eyebrow: "Path to Launch",
    heading: "From first look to go-live.",
    steps: [
      { title: "Discover", description: "Understand your mandate deadline and current readiness." },
      { title: "Prepare", description: "Structure your data and map your workflows." },
      { title: "Connect & Test", description: "Exchange through your ASP in a controlled test phase." },
      { title: "Go Live", description: "Full exchange, tracked and archived from day one." },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Common questions.",
    items: [
      {
        question: "Is it only e-invoicing?",
        answer:
          "No — e-invoicing is one module inside the AI Matic business platform, alongside POS, inventory, purchasing, finance, HR, and reporting.",
      },
      {
        question: "Can I keep my accounting software?",
        answer:
          "In most cases, yes. AI Matic is designed to structure and exchange invoice data without requiring you to replace existing accounting tools, though setup varies by business.",
      },
      {
        question: "Does it replace an ASP?",
        answer:
          "No. AI Matic prepares and structures your data; exchange still happens through an appointed Accredited Service Provider (ASP). AI Matic does not claim Ministry of Finance accreditation.",
      },
      {
        question: "What does the subscription include?",
        answer:
          "The subscription includes platform access and a monthly transaction allowance, with additional transaction volume available as add-ons. See the Pricing section for details.",
      },
    ],
  },

  finalCta: {
    heading: "Your UAE e-Invoicing journey starts here.",
    subheading: "Talk to the team about your deadline, your data, and what readiness looks like for you.",
    cta: "Request a demo",
  },

  footer: {
    links: [
      { label: "e-Invoicing", href: "#invoice-preview" },
      { label: "Business Platform", href: "#business-platform" },
      { label: "UAE Requirements", href: "#uae-requirements" },
      { label: "Pricing", href: "#pricing" },
      { label: "Getting Started", href: "#path-to-launch" },
    ],
    copyright: "© 2026 AI Matic · SIEZAL Group, UAE",
  },

  demoForm: {
    title: "Request a demo",
    subtitle: "Tell us about your business and we'll be in touch.",
    fields: {
      fullName: "Full name",
      companyName: "Company name",
      phone: "Phone",
      email: "Email",
      volume: "Monthly invoice volume",
      volumePlaceholder: "Select a range",
      message: "Message",
      messageOptional: "(optional)",
    },
    volumeOptions: [
      "Under 100",
      "100-500",
      "500-1,000",
      "1,000-5,000",
      "5,000-10,000",
      "10,000-50,000",
      "50,000-100,000",
      "100,000+",
    ],
    submitCta: "Send request",
    submittingCta: "Sending…",
    retryCta: "Retry",
    closeCta: "Close",
    successMessage: "Thanks! We'll get back to you shortly.",
    errorMessage: "Something went wrong. Please try again.",
    validation: {
      nameRequired: "Full name is required.",
      companyRequired: "Company name is required.",
      emailRequired: "Email is required.",
      emailInvalid: "Enter a valid email address.",
    },
  },
};
