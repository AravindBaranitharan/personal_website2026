# aravind. — portfolio

Aravind Baranitharan's portfolio, built on the **aravind.** design system (`../design-system/project`).

- Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS v4, TypeScript
- Colours, type, spacing and motion come from the design system's tokens (`src/styles/tokens.css`, generated) and component styles (`src/styles/components.css`).
- Motion: the design system's runtime (`src/lib/motion/aravind-motion.js`) wires `data-appear`, `data-cycle`, `data-reveal`, `data-scrub`, `data-ticker`… on every route; Lenis provides smooth scrolling.
- All copy lives in `src/content/site.ts`.

## Run

```bash
npm install
cp .env.example .env.local   # fill in SMTP details for the contact form
npm run dev
```

## Contact form

`POST /api/contact` validates with zod and sends mail through nodemailer using the variables in `.env.example`. Without them it answers 503 with a clear message.
