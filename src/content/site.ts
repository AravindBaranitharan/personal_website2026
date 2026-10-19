// All site copy lives here. Sections read from this file; nothing is hard-coded in components.
// Sources: the 2026 resume and the previous portfolio (see /content-export). Numbers are only ones the resume states.

export type Link = { label: string; href: string };

export const profile = {
  name: "Aravind Baranitharan",
  shortName: "aravind.",
  role: "AI Engineer",
  company: "Tata Consultancy Services",
  unit: "ID&A Unit",
  location: "Puducherry, India",
  workLocation: "Chennai, India",
  email: "aravindbaranitharan@gmail.com",
  phone: "+91 63793 19612",
  availability: "Available — Nov 2026",
  resumePath: "/resume.pdf",
  siteUrl: "https://aravindbaranitharan.com",
  summary:
    "AI engineer building production GenAI: retrieval pipelines, agent systems and the evals that keep them honest. Full-stack enough to ship the product around the model.",
};

export const socials: Link[] = [
  { label: "GitHub", href: "https://github.com/AravindBaranitharan" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aravind-baranitharan-b4b273227/" },
  { label: "Instagram", href: "https://www.instagram.com/7s_mortal_ig/" },
];

export const nav: Link[] = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

export const hero = {
  word: "Aravind",
  greeting: { before: "Hello, I'm", name: "Aravind", after: "— an AI engineer building intelligent systems and impactful products." },
  tagline: "Turning ideas into practical AI experiences.",
  copyright: "© Aravind 2026",
  scrollLabel: "(Scroll down)",
  portraitAlt: "Aravind Baranitharan, looking over his shoulder",
  eyebrow: "AI Engineer — TCS",
  headline: ["ai", "engineer."],
  cyclePrefix: "i build",
  cycle: ["rag pipelines", "ai agents", "mcp servers", "eval loops"],
  lead: "I build production LLM systems, agent workflows and the evals that keep them honest — then the product around them.",
  ctas: {
    primary: { label: "Start a project", href: "/#contact" },
    secondary: { label: "View the work", href: "/#work" },
    resume: { label: "Download resume", href: "/resume.pdf" },
  },
  stats: [
    {
      kicker: "TCS · RAG test-case generator",
      trend: "down",
      prefix: "",
      value: 60,
      suffix: "%",
      label: "less manual test-writing",
      context: "Test scenarios generated from enterprise documents by a local Mistral RAG service.",
    },
    {
      kicker: "TCS · Figma-to-code agent",
      trend: "up",
      prefix: "up to",
      value: 70,
      suffix: "%",
      label: "faster screen development",
      context: "50–70% shorter build cycles with a multi-agent LangGraph code generator.",
    },
    {
      kicker: "Smart India Hackathon 2026",
      trend: "plus",
      prefix: "",
      value: 40,
      suffix: "+",
      label: "AI prototypes evaluated",
      context: "Internal evaluator for the AI domain, judging ideas and working prototypes.",
    },
  ] as { kicker: string; trend: "up" | "down" | "plus"; prefix: string; value: number; suffix: string; label: string; context: string }[],
};

export const marquee = {
  primary: ["rag", "agents", "evals", "mcp", "fine-tuning", "graphrag"],
  stack: ["LangGraph", "LangChain", "FastAPI", "FastMCP", "Pinecone", "Neo4j", "Ragas", "Mistral", "Gemini", "Hugging Face", "Next.js", "Docker", "AWS"],
};

export const about = {
  kicker: "02 — About",
  title: "who builds this.",
  reveal:
    "I build production LLM systems, retrieval pipelines and the evals that keep them honest.",
  paragraphs: [
    "I'm an AI engineer at Tata Consultancy Services (ID&A unit) in Chennai. By day I ship RAG microservices, multi-agent code generators and knowledge-graph experiments for enterprise teams.",
    "Before TCS I was founder-in-residence at Zemuria, leading Kix News — an AI platform that collates sources and checks news for bias. I also mentor teams at TCS AI Fridays, helping them get from idea to working prototype fast.",
  ],
  facts: [
    { label: "Based in", value: "Puducherry · Chennai" },
    { label: "Now", value: "AI Engineer, TCS (ID&A)" },
    { label: "Focus", value: "RAG · Agents · Evals" },
    { label: "Education", value: "B.Tech IT, SMVEC (2021–2025)" },
  ],
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  outcomes: string[];
};

export const services: Service[] = [
  {
    id: "01",
    slug: "ai-llm-integrations",
    title: "AI + LLM integrations",
    summary: "Retrieval, re-ranking and evals wired into your product, with latency and cost you can see.",
    tags: ["RAG", "Re-ranking", "Pinecone", "Ragas"],
    outcomes: ["Grounded answers from your own data", "Quality tracked with evaluation sets", "Clear cost and latency numbers"],
  },
  {
    id: "02",
    slug: "agent-systems",
    title: "Agent systems",
    summary: "Multi-agent workflows with LangGraph, A2A and MCP servers that plug into Cursor and Copilot.",
    tags: ["LangGraph", "A2A", "FastMCP", "Guardrails"],
    outcomes: ["Agents that coordinate on real tasks", "Tools exposed to the assistants your team already uses", "Guardrails for security and code standards"],
  },
  {
    id: "03",
    slug: "custom-web-apps",
    title: "Custom web apps",
    summary: "Next.js products with the AI layer threaded through, from first sketch to deployed and instrumented.",
    tags: ["Next.js", "FastAPI", "TypeScript", "Tailwind"],
    outcomes: ["Fast, accessible interfaces", "Typed APIs and validated data", "Launch with analytics in place"],
  },
  {
    id: "04",
    slug: "saas-product-build",
    title: "SaaS product build",
    summary: "From MVP scope to role-based dashboards and billing — the way Mark Bot runs content agencies today.",
    tags: ["Auth", "Dashboards", "Billing", "Deployment"],
    outcomes: ["A scoped MVP that proves value", "Role-based access and billing flows", "A roadmap driven by real usage"],
  },
];

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  org: string;
  summary: string;
  problem: string;
  build: string;
  result: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  links: Link[];
  featured?: boolean;
  /** Visual for the tile until real screenshots exist: which palette the placeholder uses. */
  tone: "pink" | "night" | "wash" | "band";
};

export const projects: Project[] = [
  {
    slug: "figma-to-code-agent",
    title: "Figma-to-code agent",
    role: "Agent engineering",
    year: "2026",
    org: "TCS",
    featured: true,
    tone: "night",
    summary: "A multi-agent system that turns Figma designs into production-ready UI code.",
    problem: "Front-end screens took weeks to hand-build from Figma, and generic code assistants lost the layout once designs got large.",
    build:
      "A LangGraph multi-agent architecture on a GPT-5.2-codex model. A custom parser translates Figma layouts into compact, LLM-ready structure to stay inside the context window; context engineering and guardrails enforce security and coding standards. An A2A layer lets the agents coordinate, and a remote MCP server (FastMCP) exposes the generator as tools inside Cursor and GitHub Copilot.",
    result: "Cut screen development lifecycles by 50–70%.",
    stack: ["LangGraph", "GPT-5.2-codex", "A2A", "FastMCP", "Context engineering"],
    metrics: [
      { value: "50–70%", label: "Faster screen development" },
      { value: "A2A + MCP", label: "Agents usable from Cursor and Copilot" },
    ],
    links: [],
  },
  {
    slug: "rag-test-case-generator",
    title: "RAG test-case generator",
    role: "LLM systems",
    year: "2025",
    org: "TCS",
    featured: true,
    tone: "pink",
    summary: "A RAG microservice that writes test scenarios from unstructured enterprise documents.",
    problem: "QA teams wrote test scenarios by hand from long, unstructured requirement documents, and the data could not leave the company.",
    build:
      "A FastAPI + LangChain microservice running a locally hosted, quantized Mistral model for data-security compliance and lower compute cost. Pinecone stores version-controlled embeddings, a re-ranking step sharpens retrieval, and Ragas monitors quality continuously.",
    result: "Reduced manual test-scenario creation effort by over 60%.",
    stack: ["FastAPI", "LangChain", "Mistral (quantized)", "Pinecone", "Ragas"],
    metrics: [
      { value: "60%+", label: "Less manual test-writing effort" },
      { value: "On-prem", label: "Model hosted locally for compliance" },
    ],
    links: [],
  },
  {
    slug: "mark-bot",
    title: "Mark Bot",
    role: "Founder · full stack",
    year: "2025",
    org: "markbot.in",
    featured: true,
    tone: "wash",
    summary: "An operating system for content agencies: production, operations and billing in one role-based dashboard.",
    problem: "Content agencies ran production, client approvals and invoicing across chats and spreadsheets, and weekly ops meetings ate the team's time.",
    build:
      "Role-based dashboards for directors, managers, editors and clients; an 8-stage Kanban pipeline from topic to publish; LLM script generation with Tanglish support for performer-ready reel scripts; and quota-aware invoicing that bills on actual delivery.",
    result: "Weekly operations meetings dropped from 90 to 15 minutes, and writers spend far less time scripting.",
    stack: ["LLMs", "Prompt engineering", "Next.js", "Full-stack SaaS"],
    metrics: [
      { value: "90→15", label: "Minutes of weekly ops meetings" },
      { value: "8 stages", label: "Topic-to-publish pipeline" },
    ],
    links: [{ label: "markbot.in", href: "https://markbot.in" }],
  },
  {
    slug: "kag-knowledge-graph",
    title: "KAG knowledge graph PoC",
    role: "Research",
    year: "2025",
    org: "TCS",
    tone: "band",
    summary: "Knowledge-augmented generation over a relational database, via an auto-built knowledge graph.",
    problem: "Answers over structured enterprise data needed to respect the relationships in the database, which plain vector search loses.",
    build: "Parses a relational SQL database into a knowledge graph, derives a semantic model over its entities and relationships, and layers graph-based RAG on top.",
    result: "Context-aware answers grounded in structured enterprise data (proof of concept).",
    stack: ["Knowledge graphs", "GraphRAG", "Neo4j", "Semantic modelling"],
    metrics: [],
    links: [],
  },
  {
    slug: "kix-news",
    title: "Kix News",
    role: "Founder-in-residence",
    year: "2024",
    org: "Zemuria",
    tone: "night",
    summary: "An AI news platform that collates sources and checks stories for bias.",
    problem: "Readers had no quick way to see one story across many outlets or to judge its slant.",
    build: "A news aggregation engine using Python, Gemini, Jina AI and Selenium across sources and RSS feeds, with preprocessing pipelines that filter, validate and categorise content.",
    result: "Took the product through its investment phase to fund the next features.",
    stack: ["Python", "Gemini", "Jina AI", "Selenium"],
    metrics: [],
    links: [],
  },
  {
    slug: "aura-ai",
    title: "Aura AI",
    role: "GenAI · NLP",
    year: "2024",
    org: "Personal",
    tone: "wash",
    summary: "A personal assistant for emotional support, growth and productivity.",
    problem: "Generic chatbots answer feelings with productivity tips.",
    build: "A fine-tuned GPT-4 model for accurate, personalised guidance with empathetic responses grounded in therapeutic research, plus smart journaling and notes that surface AI insights.",
    result: "A working assistant with journaling and insight features.",
    stack: ["GPT-4 fine-tuning", "NLP", "Generative AI"],
    metrics: [],
    links: [],
  },
  {
    slug: "kavalar-eye",
    title: "Kavalar Eye",
    role: "CV · deepfake detection",
    year: "2023",
    org: "Team project",
    tone: "band",
    summary: "A mobile app that detects deepfakes with a CNN.",
    problem: "Deepfake images and video were spreading faster than people could check them.",
    build: "Trained a convolutional neural network with the team, served it through Flask APIs, Dockerized the models and deployed them on Hugging Face.",
    result: "A deployed deepfake-detection model behind a mobile app.",
    stack: ["CNN", "Python", "Flask", "Docker", "Hugging Face"],
    metrics: [],
    links: [],
  },
  {
    slug: "lowkey-reach",
    title: "Lowkey Reach",
    role: "Product · web app",
    year: "2024",
    org: "Personal",
    tone: "pink",
    summary: "An outreach tool for discovering people, writing thoughtful reach-outs and tracking conversations.",
    problem: "A growing outreach team needed a cleaner way to track conversations without the overhead of a heavy CRM.",
    build: "A focused product flow with conversation stages, follow-up prompts and mobile-first clarity.",
    result: "A polished MVP and a repeatable launch blueprint for later feature drops.",
    stack: ["Web app", "Product UI", "Networking"],
    metrics: [],
    links: [{ label: "GitHub", href: "https://github.com/AravindBaranitharan/Lowkey-Reach" }],
  },
  {
    slug: "skin-cancer-model",
    title: "Skin cancer model",
    role: "ML · computer vision",
    year: "2023",
    org: "Personal",
    tone: "band",
    summary: "Image classification to assist skin-lesion analysis.",
    problem: "Early skin-lesion screening depends on access to a specialist.",
    build: "A healthcare ML workflow that predicts lesion risk from images.",
    result: "A trained classification model and pipeline (research project, not a medical device).",
    stack: ["Machine learning", "Computer vision", "Healthcare AI"],
    metrics: [],
    links: [{ label: "GitHub", href: "https://github.com/AravindBaranitharan/Skin-cancer-model" }],
  },
  {
    slug: "heart-rate-camera",
    title: "Heart rate via camera",
    role: "Signal processing",
    year: "2023",
    org: "Personal",
    tone: "wash",
    summary: "Pulse estimation from a webcam feed.",
    problem: "Measuring heart rate usually needs a wearable or a clip sensor.",
    build: "Estimates heart rate from subtle colour variation in the face using computer vision and signal processing.",
    result: "A working camera-based pulse estimator.",
    stack: ["Signal processing", "Computer vision", "Python"],
    metrics: [],
    links: [{ label: "GitHub", href: "https://github.com/AravindBaranitharan/Heart-rate-measurement-using-camera-master" }],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const experience = [
  {
    role: "AI Engineer",
    org: "Tata Consultancy Services (ID&A Unit)",
    place: "Chennai · On-site",
    period: "Aug 2025 – Present",
    points: [
      "RAG test-case generation microservice: FastAPI, LangChain, quantized local Mistral, Pinecone, re-ranking and Ragas monitoring. Over 60% less manual test-scenario effort.",
      "Figma-to-code multi-agent system on LangGraph with a custom layout parser, guardrails and context engineering. 50–70% faster screen development.",
      "A2A communication layer and a remote MCP server (FastMCP) exposing code generation to Cursor and GitHub Copilot.",
      "Knowledge-augmented generation PoC: SQL database → knowledge graph → semantic model → graph RAG.",
      "AI Fridays mentor, helping teams prototype AI solutions quickly.",
    ],
  },
  {
    role: "Founder-in-Residence",
    org: "Zemuria (Kix News)",
    place: "Remote · San Francisco",
    period: "Jan 2024 – Sep 2024",
    points: [
      "Led product development of Kix News, an AI platform for unbiased news through source collation and automated bias-checking.",
      "Built the aggregation engine with Python, Gemini, Jina AI and Selenium across sources and RSS feeds.",
      "Took the product through its investment phase.",
    ],
  },
  {
    role: "B.Tech, Information Technology",
    org: "Sri Manakula Vinayagar Engineering College",
    place: "Puducherry",
    period: "2021 – 2025",
    points: ["CGPA 7.29."],
  },
];

export const recognition = [
  { kicker: "1st place", title: "Hackverse Hackathon", meta: "PNB MetLife, India" },
  { kicker: "Mentor", title: "TCS AI Fridays", meta: "Certificate of Appreciation · Chennai, Nov 2025" },
  { kicker: "Jury", title: "SDG AI Hackathon", meta: "ETH Zürich × NTU Singapore" },
  { kicker: "Evaluator", title: "Smart India Hackathon 2026", meta: "AI domain · 40+ prototypes" },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "GenAI", items: ["LLMs", "RAG", "Multimodal RAG & GraphRAG", "KAG", "Knowledge graphs", "Fine-tuning", "Quantization", "Re-ranking", "Agentic AI", "Multi-agent systems", "A2A", "MCP", "Context engineering", "Guardrails"] },
  { group: "Frameworks", items: ["FastAPI", "LangChain", "LangGraph", "FastMCP", "Flask", "Next.js", "Tailwind CSS"] },
  { group: "Models", items: ["GPT-4 / Codex", "Gemini", "Mistral"] },
  { group: "Data", items: ["Pinecone", "Neo4j", "Firebase", "REST APIs"] },
  { group: "Tools", items: ["Hugging Face", "Ragas", "Cursor", "Claude Code", "GitHub Copilot", "Jina AI", "Selenium"] },
  { group: "Cloud", items: ["AWS", "Microsoft Entra ID (RBAC)", "Docker", "Git"] },
  { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "C"] },
];

export const notes = [
  { quote: "Ship the loop, not the prompt.", tag: "On building" },
  { quote: "Models hallucinate. Pipelines don't have to.", tag: "On engineering" },
  { quote: "Vibes scale to zero. Evals scale to production.", tag: "On rigor" },
];

export const process = [
  { step: "Week 1", title: "Scope", detail: "Define the wedge. Cut anything that does not move a metric or a feeling." },
  { step: "Week 2", title: "Build", detail: "Production code from day one. UI, API and the AI layer threaded together." },
  { step: "Week 3", title: "Ship", detail: "Deployed, instrumented, handed over with docs and a roadmap for what comes next." },
];

export const contact = {
  kicker: "Contact",
  title: "let's build.",
  lead: "Bring a problem worth solving — a model that needs a product around it, or a product that needs a model inside it. I'll reply with a clear plan and next steps.",
  footerLine: "Have a model that needs a product around it? Let's build.",
};
