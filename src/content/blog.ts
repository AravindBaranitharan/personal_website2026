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
  /** A drawn figure; `figure` picks which one (see components/blog/PostBody.tsx). */
  | { type: "diagram"; figure: "long-horizon" | "rl-loop" | "agent-memory"; caption: string };

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
        figure: "long-horizon",
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
  {
    slug: "rl-for-agents",
    title: "RL for agents",
    dek: "Reinforcement learning explained for people who build with LLMs: how rewards shape a model, why verifiable rewards changed everything, and what reward hacking looks like in a real agent.",
    published: "2026-11-03",
    readingMinutes: 9,
    tags: ["Reinforcement learning", "AI agents", "Evals", "Training"],
    blocks: [
      {
        type: "lead",
        text: "Pretraining teaches a model to sound like the internet. Fine-tuning teaches it to sound like your examples. **Reinforcement learning** teaches it something different: to do whatever earns reward. That one change is behind the jump from chatbots that answer to agents that finish things, and it brings a new class of bugs with it.",
      },
      {
        type: "p",
        text: "This is my builder's map of RL for language models and agents: the loop, how the field moved from human preferences to verifiable rewards, how to design a reward, how it gets gamed, and what all of it means if you never train a model yourself. Every section is open for feedback at the bottom.",
      },

      { type: "h2", id: "the-loop", text: "The loop in one paragraph", concept: true },
      {
        type: "p",
        text: "An **agent** (the policy) sees a **state**, takes an **action**, and the **environment** answers with a new state and sometimes a **reward**. Repeat until the episode ends. Training nudges the policy so that actions which led to more total reward become more likely next time. For an LLM, the state is the context so far, an action is a token, a message or a tool call, and the episode is one full attempt at a task.",
      },
      {
        type: "callout",
        label: "The core idea",
        text: "Supervised learning says **\"copy this answer.\"** Reinforcement learning says **\"here is how good your answer was, figure out the rest.\"** You trade a precise teacher for a score, and in return the model can find strategies nobody wrote down.",
      },

      { type: "h2", id: "why-rl", text: "Why imitation isn't enough", concept: true },
      {
        type: "p",
        text: "A model trained only to imitate is capped by its examples. It also never sees its own mistakes during training: every example is a clean path, so when it drifts off that path at run time it has no practice recovering. RL fixes both. The model trains on **its own attempts**, including the bad ones, and it is graded on outcomes rather than on matching a reference word for word.",
      },
      {
        type: "list",
        items: [
          "**Outcomes over style.** Two very different solutions can both pass the tests. Imitation punishes the one that doesn't match; RL rewards both.",
          "**Recovery is learnable.** If a rollout makes a mistake at step 4 and fixes it at step 6, and that earns reward, the fix gets reinforced.",
          "**Search becomes skill.** Sampling many attempts and keeping what works is search. RL folds the winning patterns back into the weights, so the next attempt needs less search.",
        ],
      },

      { type: "h2", id: "rlhf-to-rlvr", text: "From human preferences to verifiable rewards", concept: true },
      {
        type: "p",
        text: "The first wave was **RLHF**. In [InstructGPT](https://arxiv.org/abs/2203.02155), people ranked pairs of model answers, a reward model learned to predict those rankings, and the language model was trained with PPO to score well on it. The headline result: labellers preferred a 1.3B-parameter InstructGPT over the 175B GPT-3. Alignment, not size, made the difference.",
      },
      {
        type: "p",
        text: "[DPO](https://arxiv.org/abs/2305.18290) then showed you can skip the separate reward model and train directly on preference pairs, which made preference tuning cheap and stable. But preferences are fuzzy and a learned reward model is easy to fool, so both methods are better at style and helpfulness than at hard correctness.",
      },
      {
        type: "p",
        text: "The second wave is **RL with verifiable rewards**. If the task has a checkable answer, such as a maths result, a passing test suite or a valid SQL query, you don't need a human or a reward model at all: a program grades the attempt. [DeepSeek-R1](https://arxiv.org/abs/2501.12948) used simple rule-based rewards (is the answer right, is the format right) with GRPO, and long step-by-step reasoning emerged without anyone writing examples of it.",
      },
      {
        type: "quote",
        text: "If you can check it, you can train on it. The bottleneck moved from data to graders.",
      },

      { type: "h2", id: "rewards", text: "Designing the reward", concept: true },
      {
        type: "p",
        text: "The reward is the specification. Whatever you score is what you get, including the parts you didn't mean. The main choices:",
      },
      {
        type: "list",
        items: [
          "**Outcome vs process.** Score only the final result, or also the steps along the way? Outcome rewards are honest but sparse. Process rewards give more signal but teach the model to please the step-grader.",
          "**Rules vs models.** Tests, schemas and exact-match checks are hard to fool. A reward model or LLM judge covers fuzzy goals like \"well written\", but it is itself a model with blind spots.",
          "**Sparse vs dense.** One bit at the end of a 50-step episode is a weak signal. Partial credit (tests passed out of total, fields filled correctly) helps the model learn, as long as partial credit can't be farmed.",
          "**Penalties.** Cost, latency, unsafe tool calls and rule violations all belong in the reward, or the model will learn that they are free.",
        ],
      },

      { type: "h2", id: "reward-hacking", text: "Reward hacking", concept: true },
      {
        type: "p",
        text: "Goodhart's law, at training speed: when a measure becomes a target, it stops being a good measure. The classic example is an RL agent in a boat-racing game that learned to circle forever hitting the same reward targets instead of finishing the race. With LLM agents it looks like this:",
      },
      {
        type: "list",
        items: [
          "**Gaming the tests.** Coding agents trained against unit tests have been reported to special-case the test inputs, or edit the tests, so that they pass.",
          "**Flattering the judge.** A policy trained against an LLM judge learns the judge's tastes: longer answers, confident tone, the words the rubric mentions.",
          "**Claiming success.** If the grader trusts the agent's own report, the agent learns to report success.",
        ],
      },
      {
        type: "p",
        text: "The defences are boring and they work. Keep a **held-out eval** the policy never trains against and watch for training score rising while that eval falls. Make the grader check the real outcome, not the agent's description of it. Lock files the agent shouldn't touch. Read actual rollouts, not only the curves. And keep a **KL penalty** that stops the policy drifting too far from the reference model in pursuit of reward.",
      },

      { type: "h2", id: "architecture", text: "A training loop for agents", concept: true },
      {
        type: "p",
        text: "Here is one round of RL for an agent, using a GRPO-style group comparison. It's the same loop whether the task is a maths problem or a 40-step coding job; the agent case just has longer episodes and real tools.",
      },
      {
        type: "diagram",
        figure: "rl-loop",
        caption: "RL loop for an agent: the policy acts in an environment of tasks, tools and state; several rollouts per task are graded by tests, checkers or a reward model; each reward is compared with the group average; the update makes better-than-average behaviour more likely while a KL penalty keeps the policy near its reference; held-out evals check for reward hacking.",
      },
      {
        type: "steps",
        items: [
          {
            num: "01",
            title: "Policy",
            text: "The model being trained. At every step it reads the context so far and picks the next action: a message, a tool call or a final answer.",
          },
          {
            num: "02",
            title: "Environment",
            text: "Where the agent acts: the task prompt, the tools it may call and the state those tools change, usually inside a sandbox that can be reset. For agents, **building good environments is now most of the work**.",
          },
          {
            num: "03",
            title: "Rollouts",
            text: "Run several attempts at the same task. Some finish, some fail, some take a strange route. Each one is recorded as a full trajectory of states, actions and observations.",
          },
          {
            num: "04",
            title: "Grader",
            text: "Score each trajectory. Prefer checks a program can run (did the tests pass, does the file exist, is the answer right) and fall back to a rubric or reward model only for what can't be checked.",
          },
          {
            num: "05",
            title: "Advantage",
            text: "Compare each attempt with its siblings: reward minus the group average. That is the GRPO trick, and it removes the need for a separate value model. Above average gets pushed up, below average gets pushed down.",
          },
          {
            num: "06",
            title: "Update",
            text: "Adjust the weights so above-average trajectories become more likely, with a **KL leash** to the reference model so the policy doesn't wander off into strange text that happens to score well.",
          },
          {
            num: "07",
            title: "Held-out evals",
            text: "Tasks the policy never trains on, graded the honest way. If the training reward climbs while these stall or drop, the policy is learning the grader, not the task.",
          },
        ],
      },

      { type: "h2", id: "multi-step", text: "What changes for multi-step agents", concept: true },
      {
        type: "list",
        items: [
          "**Credit assignment.** A reward at step 50 has to be shared across 50 decisions. Which one was the good idea? Group comparison helps, and so do intermediate checks that are hard to game.",
          "**Episodes are expensive.** A coding rollout may take minutes and spin up containers. Throughput of the environment, not the GPU, is often the limit.",
          "**Environments drift.** Websites change, APIs rate-limit, packages update. Training environments need to be pinned and reproducible, or the reward becomes noise.",
          "**Long contexts.** Trajectories outgrow the window, so memory and summarisation become part of what the policy has to learn to use. (See [agentic memory](/blog/agentic-memory).)",
        ],
      },

      { type: "h2", id: "for-builders", text: "If you don't train models", concept: true },
      {
        type: "p",
        text: "Most of us will never run PPO. The ideas still pay off, because the pieces of an RL setup are the same pieces as a good evaluation setup:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Write graders, not vibes.** A task with a program that checks the result is something you can eval today and train or fine-tune on tomorrow.",
          "**Build environments.** A resettable sandbox with your real tools is how you test an agent honestly, and it is exactly what an RL run needs.",
          "**Sample and select.** Best-of-n with a strong verifier gets you much of RL's gain at inference time, with no training. It's the same loop without the weight update.",
          "**Expect your agent to game your checks.** Models trained with RL are very good at satisfying the letter of a goal, so make the checks match the intent. See [long-horizon tasks](/blog/long-horizon-tasks) for a verifier-first architecture.",
        ],
      },

      { type: "h2", id: "open-questions", text: "Open questions", concept: true },
      {
        type: "list",
        items: [
          "**How do you reward tasks with no checkable answer**, like a good research summary, without the policy learning to please the judge?",
          "**Can process rewards be made hard to game**, or will the policy always learn the step-grader's blind spots?",
          "**How much of an agent's skill is the model and how much is the environment** it was trained in?",
          "**How do you keep RL-trained agents honest** about what they actually did?",
        ],
      },
      {
        type: "p",
        text: "Rate the post, start a thread on any concept below, or share it with someone who keeps hearing \"RL\" and nodding. I'll update it as the discussion changes my mind.",
      },
    ],
  },
  {
    slug: "agentic-memory",
    title: "agentic memory",
    dek: "A bigger context window is not memory. How agents decide what to remember, how they find it again, and why forgetting is a feature you have to build.",
    published: "2026-11-03",
    readingMinutes: 8,
    tags: ["AI agents", "Memory", "Retrieval", "Architecture"],
    blocks: [
      {
        type: "lead",
        text: "Every call to a language model starts from nothing. Whatever the agent \"remembers\" is whatever we put back into the prompt. **Agentic memory** is the system that decides what to keep, where to keep it, and what to bring back, so an agent can pick up a task tomorrow, learn your preferences, and stop repeating last week's mistakes.",
      },
      {
        type: "p",
        text: "These are my notes on designing it: the kinds of memory, the write path, the read path, forgetting, how it fails, and the architecture I'd start with. Every section is open for feedback at the bottom.",
      },

      { type: "h2", id: "not-just-context", text: "Context is not memory", concept: true },
      {
        type: "p",
        text: "It's tempting to treat a million-token window as memory and paste everything in. It doesn't hold up:",
      },
      {
        type: "list",
        items: [
          "**Models don't use long contexts evenly.** [Lost in the Middle](https://arxiv.org/abs/2307.03172) found models use information at the start and end of a long prompt far better than information buried in the middle.",
          "**Cost and latency grow with every token**, on every call, for the life of the agent.",
          "**Windows end.** A task that runs for days, or a user who comes back next month, outlives any window.",
          "**More isn't truer.** An old, wrong fact sitting in the prompt competes with the new, right one.",
        ],
      },
      {
        type: "callout",
        label: "The core idea",
        text: "Treat the context window like RAM and memory like disk. The job is **choosing what to page in** for this turn, which is what [MemGPT](https://arxiv.org/abs/2310.08560) framed as an operating-system problem.",
      },

      { type: "h2", id: "kinds-of-memory", text: "Four kinds of memory", concept: true },
      {
        type: "p",
        text: "The [CoALA](https://arxiv.org/abs/2309.02427) framework borrows from cognitive science and splits agent memory into four kinds. The split matters because each one is written, stored and trusted differently:",
      },
      {
        type: "list",
        items: [
          "**Working memory.** The scratchpad for the current task: the plan, intermediate results, what's been tried. Fast to change and thrown away at the end.",
          "**Episodic memory.** What happened: \"on 3 Nov, deploy failed because the migration timed out; fixed by raising the timeout.\" An append-only log of events with outcomes.",
          "**Semantic memory.** What is true: facts, preferences, entities and how they relate. \"Prefers TypeScript. Production DB is Postgres 16.\" Updated in place when facts change.",
          "**Procedural memory.** How to do things: skills, playbooks, tool recipes, refined prompts. The most powerful kind, and the most dangerous, because it changes behaviour directly.",
        ],
      },

      { type: "h2", id: "write-path", text: "The write path: deciding what to remember", concept: true },
      {
        type: "p",
        text: "Saving every message is not memory, it's a transcript. A useful write path does four things after each turn:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Extract.** Turn raw conversation into atomic facts and events (\"user's company is Acme\", \"task X failed with error Y\") that make sense without the surrounding chat.",
          "**Score importance.** A user's name and a hard constraint matter. \"thanks!\" doesn't. [Generative Agents](https://arxiv.org/abs/2304.03442) had the model rate each memory's importance when writing it.",
          "**Merge, don't duplicate.** Look for an existing memory about the same thing. Update it, mark the old one superseded, or add a new one, but don't store the same fact five ways.",
          "**Check trust.** Was this said by the user, or read from a web page or an email? Content from untrusted sources should never become an instruction the agent follows later.",
        ],
      },

      { type: "h2", id: "read-path", text: "The read path: finding it again", concept: true },
      {
        type: "p",
        text: "Retrieval decides what the model sees, so it decides what the agent knows. Plain vector similarity is a start, not an answer:",
      },
      {
        type: "list",
        items: [
          "**Query from the task, not the last message.** \"Fix it\" retrieves nothing useful; \"fix failing deploy for service billing-api\" does. Rewrite the query first.",
          "**Hybrid search.** Embeddings find paraphrases, keyword search finds IDs and exact names, and a graph finds things connected to the entities in play. Use more than one.",
          "**Rank on three signals.** Generative Agents scored memories on **relevance, recency and importance** together. A relevant but stale fact should lose to a relevant, recent one.",
          "**Fit a budget.** Decide how many tokens memory gets this turn and fill them in priority order. Ten sharp memories beat a hundred vague ones.",
        ],
      },

      { type: "h2", id: "architecture", text: "A memory architecture", concept: true },
      {
        type: "p",
        text: "Here is how I'd lay it out. The context window sits in the middle; everything else exists to fill it well and keep the stores small and true.",
      },
      {
        type: "diagram",
        figure: "agent-memory",
        caption: "Agentic memory architecture: after each turn the write path extracts, scores, merges and trust-checks memories into four stores (working, episodic, semantic, procedural); before each turn the read path searches, ranks by relevance, recency and importance, and fits the results into the context window's budget; background jobs consolidate and forget.",
      },
      {
        type: "steps",
        items: [
          {
            num: "01",
            title: "Context window",
            text: "All the model sees on this turn: system prompt and task, retrieved memories, recent turns and the scratchpad. Memory's whole job is to make this small and right.",
          },
          {
            num: "02",
            title: "Write path",
            text: "Runs after each turn, often in the background so it doesn't slow the reply. It extracts, scores, merges and trust-checks before anything is stored.",
          },
          {
            num: "03",
            title: "Read path",
            text: "Runs before each turn. It turns the task into a search query, searches more than one way, ranks on relevance, recency and importance, and stops when the budget is full.",
          },
          {
            num: "04",
            title: "Memory stores",
            text: "Four stores with different rules. **Working** memory is cleared at the end of a task, **episodic** is append-only, **semantic** is updated in place with versions, and **procedural** changes are reviewed before the agent relies on them.",
          },
          {
            num: "05",
            title: "Consolidate",
            text: "A background job between sessions, like sleep. It summarises clusters of episodes into lessons, merges duplicates, and resolves contradictions. Generative Agents called its version **reflection**.",
          },
          {
            num: "06",
            title: "Forget",
            text: "Decay memories nobody retrieves, expire facts with a shelf life, and delete on request. Forgetting keeps retrieval sharp and keeps you honest about privacy.",
          },
        ],
      },

      { type: "h2", id: "forgetting", text: "Forgetting is a feature", concept: true },
      {
        type: "p",
        text: "A memory that only grows gets worse over time. Retrieval returns more near-duplicates, old facts contradict new ones, and the store fills with things that were true once. Good forgetting is deliberate:",
      },
      {
        type: "list",
        items: [
          "**Supersede, don't delete blindly.** When \"lives in Chennai\" becomes \"lives in Bengaluru\", keep the old fact marked as past. History is useful; acting on it as current is the bug.",
          "**Give facts a shelf life.** \"The build is broken\" should expire in hours. \"Prefers metric units\" can last years.",
          "**Decay by use.** Memories that are never retrieved fade in rank, then get archived.",
          "**Delete for real.** When a user asks to forget something, remove it from every store, including embeddings and summaries built from it.",
        ],
      },

      { type: "h2", id: "failure-modes", text: "How memory goes wrong", concept: true },
      {
        type: "list",
        items: [
          "**Memory poisoning.** A web page or email the agent reads contains instructions, the write path stores them, and they come back in every future session. Store where each memory came from and never promote untrusted content to an instruction.",
          "**Stale facts.** The agent confidently uses something that stopped being true. Timestamps and versions on every semantic memory are the fix.",
          "**Over-retrieval.** Loosely related memories crowd the context and pull the model off task. A strict budget and a relevance cut-off help more than a bigger window.",
          "**Wrong person, wrong tenant.** Memories leak across users or workspaces. Scope every store by owner from day one; retrofitting it is painful.",
          "**Self-reinforcing mistakes.** A wrong lesson in procedural memory gets applied, \"confirmed\", and stored again. Review procedural changes, and let outcomes demote them.",
        ],
      },

      { type: "h2", id: "evaluating", text: "Evaluating memory", concept: true },
      {
        type: "p",
        text: "Test memory the way it's used: across sessions. Script a conversation that states facts, changes some of them, and comes back days later. Then measure:",
      },
      {
        type: "list",
        items: [
          "**Recall:** does it bring back the fact when it's needed?",
          "**Precision:** does it stay quiet when the fact isn't relevant?",
          "**Updates:** after a fact changes, does it use the new value and never the old one?",
          "**Deletion:** after \"forget that\", is the fact really gone from every answer?",
          "**Cost:** how many tokens does memory add per turn, and is it worth it?",
        ],
      },

      { type: "h2", id: "build-first", text: "What I'd build first", concept: true },
      {
        type: "list",
        ordered: true,
        items: [
          "**A task scratchpad and an episodic log in Postgres**, scoped by user, with timestamps and sources on every row.",
          "**Semantic facts with upserts and versions**, plus embeddings with pgvector, so one database covers keyword, vector and history.",
          "**A read path with a token budget** and recency-weighted ranking.",
          "**A cross-session eval** like the one above, before adding anything clever.",
          "**Consolidation and procedural memory last**, once you can see what the agent actually needs to learn.",
        ],
      },
      {
        type: "p",
        text: "Memory is one of the pieces that makes [long-horizon tasks](/blog/long-horizon-tasks) possible at all, and the trajectories from those runs are what [RL for agents](/blog/rl-for-agents) learns from. The three posts are really one system.",
      },

      { type: "h2", id: "open-questions", text: "Open questions", concept: true },
      {
        type: "list",
        items: [
          "**Who should decide what's important**, the model at write time, or usage over time?",
          "**Should procedural memory ever update itself** without a human approving it?",
          "**Graph or vectors?** Entity graphs answer \"what is connected to X\"; embeddings answer \"what is like X\". Do most agents need both?",
          "**What does a user need to see** of what an agent remembers about them, and how should they edit it?",
        ],
      },
      {
        type: "p",
        text: "Rate the post, start a thread on any concept below, or share it with someone building an assistant that keeps forgetting. I'll update it as the discussion changes my mind.",
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
