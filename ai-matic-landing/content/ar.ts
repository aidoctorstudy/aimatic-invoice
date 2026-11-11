// Arabic content — professional Modern Standard Arabic, written for a UAE business audience.
// Mirrors content/en.ts field for field (see content/types.ts). Brand names (AI Matic, SIEZAL
// Group) and technical acronyms (ASP, PINT-AE, FTA) are kept in Latin script, matching standard
// UAE business-Arabic convention. Currency amounts keep "AED" and Western digits throughout —
// see NOTES.md for the reasoning and other judgment calls worth a second look.

import type { SiteContent } from "@/content/types";

export const ar: SiteContent = {
  meta: {
    title: "AI Matic — الفوترة الإلكترونية في الإمارات. ببساطة.",
    description:
      "AI Matic من مجموعة SIEZAL: المنصة الشاملة التي تُجهّز الشركات الإماراتية للفوترة الإلكترونية، وتنطلق في نوفمبر 2026.",
  },

  languageSwitcher: {
    label: "English",
  },

  nav: {
    links: [
      { label: "الفوترة الإلكترونية", href: "#invoice-preview" },
      { label: "منصة الأعمال", href: "#business-platform" },
      { label: "متطلبات الإمارات", href: "#uae-requirements" },
      { label: "الأسعار", href: "#pricing" },
      { label: "البدء", href: "#path-to-launch" },
    ],
    cta: "طلب عرض تجريبي",
  },

  hero: {
    badge: "إطلاق في الإمارات · نوفمبر 2026",
    headline: "الفوترة الإلكترونية في الإمارات. ببساطة.",
    subtext:
      "استعدّ للفوترة الإلكترونية في الإمارات عبر منصة أعمال ذكية واحدة، مصمّمة لتحويل مستنداتك إلى بيانات منظّمة وجاهزة للتبادل، دون إعادة بناء طريقة عمل مؤسستك.",
    ctaPrimary: "طلب عرض تجريبي",
    ctaSecondary: "تعرّف على متطلبات الإمارات",
    trustPoints: [
      { label: "تركيز إماراتي", detail: "مصمّم وفق معايير PINT-AE والجداول الزمنية للهيئة الاتحادية للضرائب" },
      { label: "متصل بمزود خدمة معتمد", detail: "جاهز للتبادل عبر مزود خدمة معتمد (ASP)" },
      { label: "تأهيل موجّه", detail: "استعداد تدريجي ومنظّم، لا ارتباك اللحظات الأخيرة" },
    ],
  },

  invoicePreview: {
    eyebrow: "شاهدها عمليًا",
    heading: "من مستند إلى بيانات منظّمة.",
    subheading:
      "فاتورة تجريبية، بالطريقة التي يُجهّزها بها AI Matic للتبادل — ملف PDF بسيط يدخل، وفاتورة إلكترونية منظّمة تخرج.",
    demoDisclaimer: "بيانات تجريبية وهمية لأغراض التوضيح فقط — وليست معاملة حقيقية.",
    invoiceLabel: "فاتورة",
    structuredBadge: "منظّمة",
    subtotalLabel: "المجموع الفرعي",
    totalDueLabel: "المبلغ الإجمالي المستحق",
    invoice: {
      id: "INV-2026-001",
      description: "سلع بالجملة",
      quantity: "500 وحدة",
      subtotal: "AED 33,000.00",
      vatLabel: "ضريبة القيمة المضافة (5%)",
      vat: "AED 1,650.00",
      total: "AED 34,650.00",
    },
    steps: [
      {
        step: "01",
        title: "التجهيز",
        description: "تُنظَّم بيانات فاتورتك ويتم التحقق منها وفق قواعد الفوترة الإلكترونية في الإمارات.",
      },
      {
        step: "02",
        title: "الربط",
        description: "يتم تبادل البيانات المنظّمة عبر مزود الخدمة المعتمد (ASP) الخاص بك.",
      },
      {
        step: "03",
        title: "المتابعة",
        description: "الحالة والإقرارات والأرشفة — كل ذلك في مكان واحد.",
      },
    ],
  },

  uaeRequirements: {
    eyebrow: "متطلبات الإمارات",
    heading: "ملف PDF هو مستند. أما الفاتورة الإلكترونية فهي بيانات منظّمة.",
    subheading:
      "يُطبَّق إلزام الفوترة الإلكترونية في الإمارات على مراحل. معرفة موعدك النهائي هي الخطوة الأولى نحو الاستعداد.",
    sourceLabel: "المصدر:",
    officialLinkLabel: "إرشادات وزارة المالية الرسمية",
    officialLink: "https://mof.gov.ae/en/about-us/initiatives/einvoicing/",
    timeline: [
      {
        segment: "الإيرادات AED 50 مليون فأكثر",
        mandatory: "إلزامي اعتبارًا من 1 يناير 2027",
        aspDeadline: "الموعد النهائي لتعيين مزود الخدمة المعتمد: 30 أكتوبر 2026",
      },
      {
        segment: "الإيرادات أقل من AED 50 مليون",
        mandatory: "إلزامي اعتبارًا من 1 يوليو 2027",
        aspDeadline: "الموعد النهائي لمزود الخدمة المعتمد: 31 مارس 2027",
      },
    ],
  },

  readiness: {
    eyebrow: "الاستعداد",
    heading: "ثلاثة أمور يجب ترتيبها قبل الانطلاق.",
    cards: [
      {
        title: "البيانات",
        description: "سجلات العملاء والموردين والمنتجات نظيفة ومتسقة بما يكفي لتنظيمها آليًا.",
      },
      {
        title: "سير العمل",
        description: "عمليات الفوترة والموافقات والاستثناءات مُحدَّدة بما يتناسب مع طريقة عمل فريقك الحالية.",
      },
      {
        title: "الفريق",
        description: "فِرَق المالية والعمليات على اطلاع بما سيتغيّر وما لن يتغيّر ومن المسؤول عن كل جزء.",
      },
    ],
  },

  solution: {
    eyebrow: "الحل",
    heading: "منصة واحدة، أربع خطوات.",
    steps: [
      { title: "التجهيز", description: "نظّم بيانات فواتيرك وهيكلها استعدادًا للإلزام." },
      {
        title: "الربط",
        description: "تبادل البيانات عبر مزود الخدمة المعتمد (ASP) الخاص بك، دون تغيير طريقة إصدار فواتيرك.",
      },
      { title: "رؤية واضحة", description: "تابع حالة كل فاتورة وأرشفتها من لوحة تحكم واحدة." },
      { title: "المضي قدمًا", description: "وسّع نطاق الاستعداد ليشمل بقية عمليات مؤسستك." },
    ],
    disclaimer:
      "AI Matic علامة تجارية لمنتج برمجي تابع لمجموعة SIEZAL. يتطلب التبادل المعتمد تعيين مزود خدمة معتمد (ASP). لا تدّعي AI Matic حصولها على اعتماد وزارة المالية.",
  },

  businessPlatform: {
    eyebrow: "منصة الأعمال",
    heading: "كل ما تحتاجه مؤسستك، في مكان واحد.",
    subheading: "استعداد الفوترة الإلكترونية هو وحدة واحدة ضمن منصة مصمّمة لإدارة بقية عمليات مؤسستك.",
    modules: [
      { title: "نقاط البيع", description: "عمليات دفع سريعة وموثوقة لقطاعي التجزئة والضيافة." },
      { title: "المخزون والمستودعات", description: "رؤية كاملة للمخزون في جميع الفروع." },
      { title: "المشتريات والموردون", description: "أوامر الشراء وسجلات الموردين متزامنة دائمًا." },
      { title: "المالية والحسابات", description: "دفاتر الحسابات والتسويات والتقارير في مكان واحد." },
      { title: "الموارد البشرية والرواتب", description: "سجلات الموظفين والحضور والرواتب في عملية واحدة." },
      { title: "الفوترة الإلكترونية في الإمارات", description: "فوترة منظّمة وجاهزة للتبادل، مصمّمة خصيصًا للإلزام." },
      { title: "الفروع والموافقات", description: "تحكم في الفروع المتعددة عبر سلاسل موافقات واضحة." },
      { title: "التقارير والتحليلات", description: "لوحات بيانات مباشرة عبر جميع الوحدات." },
    ],
  },

  pricing: {
    eyebrow: "الأسعار",
    heading: "أسعار بسيطة، مصمّمة للشركات الإماراتية.",
    subheading: "اشتراك واحد للمنصة، وتدفع فقط مقابل حجم الفواتير الإلكترونية الذي تستخدمه.",
    platformName: "منصة AI Matic",
    monthlyLabel: "شهري",
    yearlyLabel: "سنوي",
    bestValueBadge: "الأفضل قيمة",
    requestDemoCta: "طلب عرض تجريبي",
    platformIncludesLabel: "تشمل المنصة",
    monthly: { price: "AED 99", period: "/شهريًا" },
    yearly: {
      price: "AED 74",
      period: "/شهريًا",
      billedAs: "تُدفع سنويًا بقيمة AED 899",
      savingsBadge: "وفّر 24%",
    },
    addonsHeading: "إضافات المعاملات",
    addonsSubheading: "تخزين بيانات فواتيرك الإلكترونية، المتبادلة والمؤرشفة لدى مزود الخدمة المعتمد.",
    addonsTableHeaders: { transactions: "المعاملات", price: "سعر AI Matic" },
    addons: [
      { tier: "أول 100 معاملة", price: "مجانًا*" },
      { tier: "100 معاملة إضافية", price: "AED 29" },
      { tier: "500 معاملة", price: "AED 149" },
      { tier: "1,000 معاملة", price: "AED 299" },
      { tier: "5,000 معاملة", price: "AED 1,199" },
      { tier: "10,000 معاملة", price: "AED 2,399" },
      { tier: "50,000 معاملة", price: "AED 9,999" },
      { tier: "100,000 معاملة", price: "AED 16,999" },
      { tier: "أكثر من 100,000 معاملة", price: "", contact: true },
    ],
    contactCta: "تواصل معنا",
    footnote:
      "أول 100 معاملة فوترة إلكترونية مجانية مع اشتراك AI Matic النشط. تُحتسب المعاملات الإضافية وفق الفئات أعلاه.",
  },

  pathToLaunch: {
    eyebrow: "مسار الانطلاق",
    heading: "من النظرة الأولى إلى الانطلاق الفعلي.",
    steps: [
      { title: "الاكتشاف", description: "تعرّف على موعدك الإلزامي النهائي ومستوى استعدادك الحالي." },
      { title: "التجهيز", description: "نظّم بياناتك وحدد مسار سير عملك." },
      { title: "الربط والاختبار", description: "تبادل البيانات عبر مزود الخدمة المعتمد ضمن مرحلة اختبار مضبوطة." },
      { title: "الانطلاق", description: "تبادل كامل، مع متابعة وأرشفة منذ اليوم الأول." },
    ],
  },

  faq: {
    eyebrow: "الأسئلة الشائعة",
    heading: "أسئلة متكررة.",
    items: [
      {
        question: "هل تقتصر الخدمة على الفوترة الإلكترونية فقط؟",
        answer:
          "لا — الفوترة الإلكترونية هي وحدة واحدة ضمن منصة أعمال AI Matic، إلى جانب نقاط البيع والمخزون والمشتريات والمالية والموارد البشرية والتقارير.",
      },
      {
        question: "هل يمكنني الاحتفاظ ببرنامج المحاسبة الحالي؟",
        answer:
          "في معظم الحالات، نعم. صُمم AI Matic لتنظيم بيانات الفواتير وتبادلها دون الحاجة إلى استبدال أدوات المحاسبة الحالية، مع أن طريقة الإعداد تختلف حسب طبيعة كل مؤسسة.",
      },
      {
        question: "هل تحل المنصة محل مزود الخدمة المعتمد (ASP)؟",
        answer:
          "لا. يقوم AI Matic بتجهيز بياناتك وتنظيمها، بينما يتم التبادل الفعلي عبر مزود خدمة معتمد (ASP). لا تدّعي AI Matic حصولها على اعتماد وزارة المالية.",
      },
      {
        question: "ما الذي يشمله الاشتراك؟",
        answer:
          "يشمل الاشتراك الوصول إلى المنصة وحصة شهرية من المعاملات، مع إمكانية إضافة حجم معاملات أكبر كإضافات. راجع قسم الأسعار لمزيد من التفاصيل.",
      },
    ],
  },

  finalCta: {
    heading: "رحلتك نحو الفوترة الإلكترونية في الإمارات تبدأ هنا.",
    subheading: "تحدّث مع فريقنا حول موعدك النهائي وبياناتك ومستوى الاستعداد الذي تحتاجه.",
    cta: "طلب عرض تجريبي",
  },

  footer: {
    links: [
      { label: "الفوترة الإلكترونية", href: "#invoice-preview" },
      { label: "منصة الأعمال", href: "#business-platform" },
      { label: "متطلبات الإمارات", href: "#uae-requirements" },
      { label: "الأسعار", href: "#pricing" },
      { label: "البدء", href: "#path-to-launch" },
    ],
    copyright: "© 2026 AI Matic · مجموعة SIEZAL، الإمارات العربية المتحدة",
  },

  demoForm: {
    title: "طلب عرض تجريبي",
    subtitle: "أخبرنا عن مؤسستك وسنتواصل معك.",
    fields: {
      fullName: "الاسم الكامل",
      companyName: "اسم المؤسسة",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      volume: "حجم الفواتير الشهري",
      volumePlaceholder: "اختر نطاقًا",
      message: "رسالة",
      messageOptional: "(اختياري)",
    },
    volumeOptions: [
      "أقل من 100",
      "100-500",
      "500-1,000",
      "1,000-5,000",
      "5,000-10,000",
      "10,000-50,000",
      "50,000-100,000",
      "100,000+",
    ],
    submitCta: "إرسال الطلب",
    submittingCta: "جارٍ الإرسال…",
    retryCta: "إعادة المحاولة",
    closeCta: "إغلاق",
    successMessage: "شكرًا لتواصلكم! سنرد عليكم قريبًا.",
    errorMessage: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    validation: {
      nameRequired: "الاسم الكامل مطلوب.",
      companyRequired: "اسم المؤسسة مطلوب.",
      emailRequired: "البريد الإلكتروني مطلوب.",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
    },
  },
};
