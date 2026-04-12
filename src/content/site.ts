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
  title: string;
  description: string;
  tags: string[];
  href: string;
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

export const serviceItems: ServiceItem[] = [
  {
    id: "01",
    title: "CUSTOM WEB APPS",
    description:
      "Build fast, scalable applications with modern stacks and strong UX foundations.",
    tags: [
      "NEXT.JS",
      "REACT",
      "TYPESCRIPT",
      "NODE",
      "TAILWIND",
      "MONGODB",
    ],
    href: "https://github.com/AravindBaranitharan?tab=repositories",
  },
  {
    id: "02",
    title: "AI + LLM INTEGRATIONS",
    description:
      "Integrate retrieval, agent workflows, and model APIs into production-ready products.",
    tags: ["PYTHON", "RAG", "AUTOMATION", "GEN AI", "AI AGENTS"],
    href: "https://github.com/AravindBaranitharan?tab=repositories",
  },
  {
    id: "03",
    title: "SAAS PRODUCT BUILD",
    description:
      "Go from concept to launch with robust architecture, analytics, and iteration loops.",
    tags: ["AUTH", "BILLING", "DASHBOARDS", "APIS", "DEPLOYMENT"],
    href: "https://github.com/AravindBaranitharan?tab=repositories",
  },
  {
    id: "04",
    title: "GEN AI DEVELOPMENT",
    description:
      "Design tailored AI experiences for business workflows, support, and internal tooling.",
    tags: ["FINE TUNING", "CUSTOM GPT", "CHATBOTS", "AGENT FLOWS"],
    href: "https://github.com/AravindBaranitharan?tab=repositories",
  },
];

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
  {
    id: 5,
    title: "Event Snap Finder",
    subTitle: "Event photo discovery workflow",
    summary:
      "A discovery experience for quickly locating event images through searchable event metadata and media indexing.",
    image: "/projects/event-snap-finder.svg",
    href: "https://github.com/AravindBaranitharan/event-snap-finder",
    stack: ["Search", "Media", "Event Tech"],
  },
  {
    id: 6,
    title: "Sharika Cozy Cafe",
    subTitle: "Cafe brand and ordering website",
    summary:
      "A warm, brand-led cafe web experience with menu storytelling, atmosphere, and customer-friendly navigation.",
    image: "/projects/sharika-cozy-cafe.svg",
    href: "https://github.com/AravindBaranitharan/sharika-cozy-cafe-main",
    stack: ["Restaurant UI", "Menu", "Responsive Web"],
  },
];
