// Blog posts. Like site.ts, all copy lives here; components only render it.
// Inline markup inside text: **bold**, *italic*, `code` and [label](https://link).

export type Block =
  | { type: "p"; text: string }
  | { type: "lead"; text: string }
  /** A section heading. `concept: true` makes it something readers can tag their feedback with. */
  | { type: "h2"; id: string; text: string; concept?: boolean }
  | { type: "h3"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; label: string; text: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  /** A numbered walkthrough, one item per box in the diagram. */
  | { type: "steps"; items: { num: string; title: string; text: string }[] }
  | { type: "diagram"; caption: string };

export type Post = {
  slug: string;
  title: string;
  /** One or two sentences under the title, also used as the meta description and WhatsApp preview. */
  dek: string;
  published: string; // ISO date
  readingMinutes: number;
  tags: string[];
  blocks: Block[];
};

export const posts: Post[] = [
  {
    slug: "long-horizon-tasks",
    title: "long-horizon tasks",
    dek: "Why AI agents that look brilliant for five minutes fall apart over five hours, and the architecture I would use to keep a long run on track.",
    published: "2026-11-02",
    readingMinutes: 11,
    tags: ["AI agents", "Architecture", "Evals", "Context engineering"],
    blocks: [
      {
        type: "lead",
        text: "Most agent demos are short. Ask a question, call two tools, return an answer. The work people actually want to hand off is long: migrate a codebase, research a market and write the report, reconcile a month of invoices, keep a data pipeline healthy for a week. Those are **long-horizon tasks**, and they break agents in ways a five-minute demo never shows.",
      },
      {
        type: "p",
        text: "This post is my working notes on the problem: what makes a task long-horizon, why errors pile up, a brainstorm of the ways long runs fail, and the architecture I would propose to keep one on track. Every section is open for feedback at the bottom of the page, so tell me where you think I'm wrong.",
      },

      { type: "h2", id: "what-makes-a-task-long", text: "What makes a task long-horizon", concept: true },
      {
        type: "p",
        text: "Length on its own isn't the point. A task is long-horizon when it has most of these properties:",
      },
      {
        type: "list",
        items: [
          "**Many dependent steps.** Step 40 depends on what happened at step 7, so an early mistake doesn't stay small.",
          "**More state than fits in one context window.** Files, findings, decisions and half-finished work have to live somewhere other than the prompt.",
          "**Delayed feedback.** You often can't tell whether a step was right until much later, when the tests run or the report reads wrong.",
          "**Wall-clock time.** The run lasts minutes to days, so it will meet crashes, deploys, rate limits and expired tokens along the way.",
          "**Real side effects.** It sends emails, merges code or moves money, so a mistake can't always be undone.",
        ],
      },
      {
        type: "p",
        text: "The length of task that frontier agents can finish is growing fast. [METR's measurements](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) found it roughly doubling every seven months. A better model raises the ceiling, but whether a given system reaches it depends on the scaffolding around the model, and that part is our job.",
      },

      { type: "h2", id: "compounding-error", text: "The maths of compounding error", concept: true },
      {
        type: "p",
        text: "Here is the uncomfortable arithmetic. If each step succeeds independently with probability *p*, a run of *n* steps succeeds with probability *pⁿ*.",
      },
      {
        type: "stats",
        items: [
          { value: "36%", label: "chance a 20-step run finishes cleanly at 95% per-step accuracy" },
          { value: "37%", label: "chance a 100-step run finishes cleanly at 99% per-step accuracy" },
          { value: "0.6%", label: "chance a 100-step run finishes cleanly at 95% per-step accuracy" },
        ],
      },
      {
        type: "p",
        text: "Real steps aren't independent, so treat these numbers as a picture rather than a forecast. The lesson still holds: you will not prompt your way to 99.99% per step. Long runs succeed because errors get **noticed and repaired**, not because they never happen. The design question shifts from \"how do I make every step right?\" to \"how quickly do I catch a wrong step, and how cheaply can I recover from it?\"",
      },
      {
        type: "callout",
        label: "The core idea",
        text: "Reliability over a long horizon comes from detection and recovery, not just accuracy. Make each step **checkable**, make each step **resumable**, and the compounding works for you instead of against you.",
      },

      { type: "h2", id: "failure-modes", text: "Brainstorm: how long runs fail", concept: true },
      {
        type: "p",
        text: "Before designing anything, I listed every way I've seen, or can imagine, a long agent run going wrong. Each one points at a part of the architecture.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Context rot.** The transcript grows until the instructions that matter are buried under tool output. The agent starts forgetting constraints it followed an hour ago.",
          "**Goal drift.** Each step is locally sensible, but the run slides away from what was asked. It ends up optimising for \"tests pass\" when the goal was \"the feature works\".",
          "**Lost state.** The process crashes, a deploy restarts the worker, a token expires. Without durable state, three hours of work start over from zero.",
          "**Loops.** The agent retries the same failing approach, or two sub-agents keep handing a task back and forth.",
          "**Silent failure.** A step returns something plausible but wrong, nothing checks it, and every later step builds on it.",
          "**Budget blowout.** Tokens, API calls or wall-clock time run far past what the task was worth, and nobody noticed until the bill came.",
          "**Irreversible mistakes.** A wrong action with real side effects, such as a deleted table or a sent email, can't be retried away.",
          "**Planning too early, or never.** A plan made at minute zero goes stale by hour two, but replanning every step throws away progress and burns budget.",
        ],
      },

      { type: "h2", id: "architecture", text: "The architecture I'd propose", concept: true },
      {
        type: "p",
        text: "The design separates **thinking about the work** from **doing the work** from **checking the work**, and keeps the run's state outside the model. The model is a component inside a loop, not the loop itself.",
      },
      {
        type: "diagram",
        caption: "Long-horizon agent architecture: a goal contract feeds a planner and a task ledger; an orchestrator dispatches small, scoped workers; a verifier gates every result; memory and a checkpointer keep state outside the model; a governor enforces budgets and human approval.",
      },
      {
        type: "steps",
        items: [
          {
            num: "01",
            title: "Goal contract",
            text: "A short, structured statement of the objective, the constraints, the definition of done and the budget. It's written once, sent with every model call and never summarised away. This is the fix for goal drift.",
          },
          {
            num: "02",
            title: "Planner and task ledger",
            text: "The planner breaks the goal into a small graph of tasks, each with its own **acceptance check**. The ledger is that graph stored in a database: status, inputs, outputs, attempts. Replanning edits the ledger instead of starting over.",
          },
          {
            num: "03",
            title: "Orchestrator",
            text: "A plain loop, mostly ordinary code: pick the next ready task, build a fresh, minimal context for it, dispatch it, record the result. Keeping this deterministic makes the system debuggable.",
          },
          {
            num: "04",
            title: "Workers",
            text: "Short-lived agents with a narrow job, a scoped tool set and a small context. A worker never sees the whole history, only the goal contract, its task and the memory relevant to it. This is the main defence against context rot.",
          },
          {
            num: "05",
            title: "Verifier",
            text: "Every result is checked against its acceptance criteria before it counts. Cheap, deterministic checks come first (schemas, tests, linters, row counts), then an LLM judge for what code can't check. A failure goes back to the orchestrator with the reason attached, for a retry or a replan.",
          },
          {
            num: "06",
            title: "Memory, in three tiers",
            text: "**Working memory** is what the current step needs. The **episodic log** is an append-only record of what happened and why. The **semantic store** holds durable facts and decisions (\"we chose Postgres\", \"the API paginates by cursor\") that are retrieved when relevant.",
          },
          {
            num: "07",
            title: "Checkpointer",
            text: "State is persisted after every step, so a crash means resume, not restart. It also gives you time travel: rewind to step 31, change one thing and replay.",
          },
          {
            num: "08",
            title: "Governor",
            text: "The adult in the room. It enforces token, cost and time budgets, detects loops (the same task failing the same way three times), and stops for **human approval** before anything irreversible.",
          },
        ],
      },

      { type: "h2", id: "context-budget", text: "Context is a budget, not a bucket", concept: true },
      {
        type: "p",
        text: "The easiest mistake is to treat the context window as a bucket and keep pouring the transcript in. Long runs need the opposite: **assemble a fresh context for every step** from durable sources, and keep it small.",
      },
      {
        type: "list",
        items: [
          "Always include the goal contract and the current task with its acceptance check.",
          "Pull only the memory this task needs, by retrieval or by explicit links in the ledger.",
          "Replace raw tool output with a summary plus a pointer (\"full log stored at …\"), so the worker can fetch details on demand.",
          "Write decisions down as they're made. If it only lives in the transcript, it will be forgotten.",
        ],
      },
      {
        type: "quote",
        text: "If the agent needs to remember something for more than one step, it belongs in the ledger or the memory store, not in the prompt.",
      },

      { type: "h2", id: "verification", text: "Verification is the real engine", concept: true },
      {
        type: "p",
        text: "If I could add only one component to an existing agent, it would be the verifier. Most long-run failures are really *silent* failures that compound. Turning \"done\" into something checkable changes the whole system:",
      },
      {
        type: "list",
        items: [
          "**Acceptance checks are written when the task is planned**, before the work starts, so the worker can't redefine success after the fact.",
          "**Cheap checks first.** A JSON schema, a unit test or a SQL count catches most errors for almost nothing. Save the LLM judge for questions that need judgment.",
          "**Failures carry information.** \"Test `test_refund_rounding` failed: expected 10.00, got 9.99\" is a far better retry prompt than \"try again\".",
          "**Whole-run evals still matter.** Per-step checks catch local errors; an end-of-run eval against the goal contract catches drift.",
        ],
      },

      { type: "h2", id: "humans", text: "Humans at the checkpoints, not in the loop", concept: true },
      {
        type: "p",
        text: "Asking a person to approve every step defeats the point of a long run. Never asking them is how a deleted production table happens. The middle ground: the governor classifies actions by how reversible they are and only **pauses at the gates that matter**. Think merging to main, sending external messages, spending above a threshold, or deleting data.",
      },
      {
        type: "p",
        text: "Because state is checkpointed, a pause costs nothing. The run waits for an hour or a weekend, the person approves from their phone, and it resumes exactly where it stopped.",
      },

      { type: "h2", id: "build-first", text: "What I'd build first", concept: true },
      {
        type: "p",
        text: "You don't need all eight boxes on day one. If I were starting tomorrow, in this order:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**A task ledger in Postgres** with status, attempts and acceptance checks. Even a single table changes how you debug.",
          "**Durable checkpoints.** LangGraph's checkpointer, Temporal, or any durable workflow engine, so a crash means resume.",
          "**A verifier with deterministic checks** before adding any LLM judging.",
          "**Budgets and loop detection**, because they're cheap and they prevent the expensive surprises.",
          "**Memory tiers and human gates**, once the basic loop is reliable.",
        ],
      },

      { type: "h2", id: "open-questions", text: "Open questions", concept: true },
      {
        type: "p",
        text: "These are the parts I'm least sure about, and where I'd most like your view:",
      },
      {
        type: "list",
        items: [
          "**When should the planner replan?** On every failure, on a schedule, or only when the verifier says the plan itself is wrong?",
          "**How do you evaluate a whole run** when the ground truth only exists at the end, days later?",
          "**What should memory forget?** An episodic log that only grows becomes its own kind of context rot.",
          "**How small should workers be?** Smaller contexts are more reliable but cost more hand-offs, and each hand-off is a chance to lose information.",
        ],
      },
      {
        type: "p",
        text: "Leave a rating, start a thread on any concept below, or share this with someone building agents. I'll update the post as the discussion changes my mind.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** The headings readers can tag feedback with, in reading order. */
export function getConcepts(post: Post): { id: string; title: string }[] {
  return post.blocks.flatMap((b) => (b.type === "h2" && b.concept ? [{ id: b.id, title: b.text }] : []));
}

export const blog = {
  title: "blog.",
  kicker: "Writing",
  lead: "Long-form notes on building AI systems that hold up in production: agents, retrieval, evals and the architecture around them.",
};
