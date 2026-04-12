export type NavLink = {
  label: string;
  href: `#${string}`;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "instagram" | "email";
};

export type ServiceItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export type ServicePhase = {
  title: string;
  detail: string;
};

export type ServiceDetail = ServiceItem & {
  articleKicker: string;
  articleLead: string;
  challenge: string;
  deliveryModel: string;
  outcomes: string[];
  deliverables: string[];
  phases: ServicePhase[];
};

export type ProjectItem = {
  id: number;
  title: string;
  subTitle: string;
  summary: string;
  image: string;
  href: string;
  stack: string[];
};

export type FeaturedMetric = {
  label: string;
  value: string;
};

export type FeaturedProject = {
  projectId: number;
  label: string;
  title: string;
  year: string;
  problem: string;
  build: string;
  result: string;
  image: string;
  href: string;
  stack: string[];
  metrics: FeaturedMetric[];
};

export const profile = {
  initials: "AB",
  firstName: "Aravind",
  lastName: "Baranitharan",
  title: "AI Engineer",
  subtitle: "Software Developer",
  company: "AI Engineer at Tata Consultancy Services",
  email: "aravindbaranitharan@gmail.com",
  phone: "+91 6379319612",
  resumePath: "/Resume.pdf",
};

export const navLinks: NavLink[] = [
  { label: "HOME", href: "#home" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/AravindBaranitharan",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aravind-baranitharan-b4b273227/",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/7s_mortal_ig/",
    icon: "instagram",
  },
  {
    label: "Email",
    href: "#contact",
    icon: "email",
  },
];

export const marqueeText = {
  primary:
    "WEB APPS * AI ENGINEERING * MACHINE LEARNING * AGENTIC AI * WEB APPS * AI ENGINEERING * MACHINE LEARNING * AGENTIC AI * ",
  secondary:
    "SYSTEM THINKING * UX PRECISION * PRODUCT BUILDING * SAAS * AUTOMATION * PERFORMANCE * ",
};

export const serviceDetails: ServiceDetail[] = [
  {
    id: "01",
    slug: "custom-web-apps",
    title: "CUSTOM WEB APPS",
    description:
      "Build fast, scalable applications with modern stacks and strong UX foundations.",
    tags: ["NEXT.JS", "REACT", "TYPESCRIPT", "NODE", "TAILWIND", "MONGODB"],
    articleKicker: "Architecture + UX, built for real-world scale",
    articleLead:
      "I build product-grade web applications that stay fast under pressure, feel intuitive for users, and remain easy to evolve for teams.",
    challenge:
      "Many businesses outgrow no-code stacks or templates quickly. They need custom workflows, predictable performance, and a design system that supports future growth.",
    deliveryModel:
      "Each build starts with product mapping, then moves into modular architecture, component systems, API integration, and performance hardening before launch.",
    outcomes: [
      "Faster load times and smoother user journeys",
      "Clean architecture that supports future features",
      "Design consistency across screens and devices",
      "Reliable foundation for analytics and conversion",
    ],
    deliverables: [
      "Responsive web app with reusable component system",
      "Structured API/data layer with validation",
      "Performance optimization (images, rendering, caching)",
      "QA checklist and production launch support",
    ],
    phases: [
      {
        title: "Discovery & Product Mapping",
        detail:
          "Define user goals, core journeys, and edge cases before writing production code.",
      },
      {
        title: "System Design",
        detail:
          "Plan UI architecture, state strategy, API contracts, and database structure.",
      },
      {
        title: "Build & QA",
        detail:
          "Develop feature modules with accessible UI, testing, and performance checks.",
      },
      {
        title: "Launch & Iteration",
        detail:
          "Ship with analytics, monitor behavior, and iterate based on real usage signals.",
      },
    ],
  },
  {
    id: "02",
    slug: "ai-llm-integrations",
    title: "AI + LLM INTEGRATIONS",
    description:
      "Integrate retrieval, agent workflows, and model APIs into production-ready products.",
    tags: ["PYTHON", "RAG", "AUTOMATION", "GEN AI", "AI AGENTS"],
    articleKicker: "LLM features that are useful, reliable, and measurable",
    articleLead:
      "I integrate AI capabilities into existing products with guardrails, observability, and workflows that actually improve execution quality.",
    challenge:
      "Teams often add AI quickly but struggle with hallucinations, inconsistent outputs, and unclear ROI. They need a practical integration strategy, not just a chat box.",
    deliveryModel:
      "I design retrieval pipelines, prompt orchestration, and fallback logic that align with business tasks like support, content ops, and internal automation.",
    outcomes: [
      "Reduced manual effort for repeat workflows",
      "Higher response quality through retrieval grounding",
      "Auditability and safer model behavior",
      "Clear metrics for cost, latency, and usefulness",
    ],
    deliverables: [
      "LLM integration plan aligned to product goals",
      "RAG pipeline with chunking and vector retrieval",
      "Prompt strategy with evaluation test cases",
      "Monitoring for latency, failure, and quality drift",
    ],
    phases: [
      {
        title: "Use-Case Selection",
        detail:
          "Prioritize high-impact workflows where AI can save time or improve decision quality.",
      },
      {
        title: "Knowledge & Prompt Layer",
        detail:
          "Set up retrieval sources, prompt templates, and role-specific output structure.",
      },
      {
        title: "Integration & Guardrails",
        detail:
          "Connect models to your product with validation, fallback flows, and logging.",
      },
      {
        title: "Evaluation Loop",
        detail:
          "Track quality and iterate prompts/model settings using real user feedback.",
      },
    ],
  },
  {
    id: "03",
    slug: "saas-product-build",
    title: "SAAS PRODUCT BUILD",
    description:
      "Go from concept to launch with robust architecture, analytics, and iteration loops.",
    tags: ["AUTH", "BILLING", "DASHBOARDS", "APIS", "DEPLOYMENT"],
    articleKicker: "From idea to SaaS launch with product discipline",
    articleLead:
      "I help founders and teams shape, build, and launch SaaS products with clear scope, stable architecture, and conversion-focused UX.",
    challenge:
      "SaaS products fail when teams build features before validating core workflows. The right build needs sequencing: onboarding, value moment, retention loop.",
    deliveryModel:
      "I combine product strategy with engineering execution: MVP scoping, dashboard architecture, auth and billing flows, and analytics-first launch setup.",
    outcomes: [
      "Faster MVP launch with reduced technical debt",
      "Clear onboarding and activation pathways",
      "Scalable multi-tenant friendly architecture",
      "Data-backed roadmap decisions post launch",
    ],
    deliverables: [
      "MVP blueprint with feature prioritization",
      "Authentication, role permissions, and billing flow",
      "Core dashboard modules and API integration",
      "Analytics instrumentation for activation metrics",
    ],
    phases: [
      {
        title: "MVP Strategy",
        detail:
          "Define the minimum feature set that proves product value and supports growth.",
      },
      {
        title: "Platform Foundation",
        detail:
          "Implement secure auth, data modeling, and scalable backend contracts.",
      },
      {
        title: "User Experience Build",
        detail:
          "Craft onboarding, dashboard UX, and key task flows for everyday usage.",
      },
      {
        title: "Launch & Metrics",
        detail:
          "Deploy with tracking for activation, retention, and monetization signals.",
      },
    ],
  },
  {
    id: "04",
    slug: "gen-ai-development",
    title: "GEN AI DEVELOPMENT",
    description:
      "Design tailored AI experiences for business workflows, support, and internal tooling.",
    tags: ["FINE TUNING", "CUSTOM GPT", "CHATBOTS", "AGENT FLOWS"],
    articleKicker: "Custom AI products for practical business workflows",
    articleLead:
      "I design and build GenAI systems tailored to your operations, from assistant interfaces to workflow automations and internal copilots.",
    challenge:
      "Generic AI tools often miss domain context and workflow nuance. Businesses need tailored systems that match team behavior and data boundaries.",
    deliveryModel:
      "I build domain-aware AI experiences with conversation design, system prompts, memory patterns, and integration into your existing process stack.",
    outcomes: [
      "AI features tuned to business-specific language and tasks",
      "Higher team adoption through role-based workflow design",
      "Better consistency through prompt and policy templates",
      "Faster execution for support and operations teams",
    ],
    deliverables: [
      "Custom AI assistant UX and conversation architecture",
      "Prompt templates and instruction hierarchy",
      "Workflow automations connected to your tools",
      "Knowledge ingestion and update process",
    ],
    phases: [
      {
        title: "Workflow Deep-Dive",
        detail:
          "Map how teams currently work and identify the highest-friction repetitive tasks.",
      },
      {
        title: "AI Experience Design",
        detail:
          "Design interaction patterns, answer styles, and handoff logic for accuracy.",
      },
      {
        title: "System Integration",
        detail:
          "Connect models, data sources, and automation triggers to business systems.",
      },
      {
        title: "Adoption & Tuning",
        detail:
          "Roll out with training, collect feedback, and continuously tune behavior.",
      },
    ],
  },
];

export const serviceItems: ServiceItem[] = serviceDetails.map((service) => ({
  id: service.id,
  slug: service.slug,
  title: service.title,
  description: service.description,
  tags: service.tags,
}));

export function getServiceBySlug(slug: string) {
  return serviceDetails.find((service) => service.slug === slug);
}

export const featuredProject: FeaturedProject = {
  projectId: 1,
  label: "Featured Case Study",
  title: "Lowkey Reach",
  year: "2026",
  problem:
    "A growing outreach team needed a cleaner way to track conversations without the overhead of a heavy CRM.",
  build:
    "Designed a focused product flow with conversation stages, follow-up prompts, and mobile-first clarity.",
  result:
    "Shipped a polished MVP quickly and established a repeatable launch blueprint for future feature drops.",
  image: "/projects/lowkey-reach.svg",
  href: "https://github.com/AravindBaranitharan/Lowkey-Reach",
  stack: ["Product Strategy", "Web App", "UX Systems", "Frontend"],
  metrics: [
    { label: "Prototype Cycle", value: "14 Days" },
    { label: "Core Journeys", value: "3 Flows" },
    { label: "Interaction Pace", value: "<2s" },
  ],
};

export const projectItems: ProjectItem[] = [
  {
    id: 1,
    title: "Lowkey Reach",
    subTitle: "Outreach and connection platform",
    summary:
      "A focused platform concept for discovering people, creating meaningful reach-outs, and tracking conversations.",
    image: "/projects/lowkey-reach.svg",
    href: "https://github.com/AravindBaranitharan/Lowkey-Reach",
    stack: ["Web App", "Networking", "Product UI"],
  },
  {
    id: 2,
    title: "Warrior",
    subTitle: "Performance and discipline tracker",
    summary:
      "A goal-driven experience designed to build consistency through challenge-based progress and activity tracking.",
    image: "/projects/warrior.svg",
    href: "https://github.com/AravindBaranitharan/warrior",
    stack: ["Tracking", "Motivation", "App Design"],
  },
  {
    id: 3,
    title: "Skin Cancer Model",
    subTitle: "Medical image classification model",
    summary:
      "A healthcare ML workflow for assisting skin lesion analysis using image-driven risk prediction.",
    image: "/projects/skin-cancer-model.svg",
    href: "https://github.com/AravindBaranitharan/Skin-cancer-model",
    stack: ["Machine Learning", "Computer Vision", "Healthcare AI"],
  },
  {
    id: 4,
    title: "Heart Rate Using Camera",
    subTitle: "Pulse estimation from camera feed",
    summary:
      "A computer-vision experiment to estimate heart rate through camera-based color variation and signal processing.",
    image: "/projects/heart-rate-camera.svg",
    href: "https://github.com/AravindBaranitharan/Heart-rate-measurement-using-camera-master",
    stack: ["Signal Processing", "Computer Vision", "Health Tech"],
  },
];
