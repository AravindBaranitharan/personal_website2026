# Aravind Baranitharan Portfolio

Production-ready personal portfolio built with Next.js App Router and Tailwind CSS.

## Features

- Bold single-page portfolio design with responsive sections
- Services and project showcase powered by centralized content data
- Functional contact form with client + server validation
- Email delivery via Nodemailer (`/api/contact`)
- SEO-ready metadata and social graph tags

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zod
- Nodemailer

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env.local
```

3. Fill `.env.local` with valid mail credentials.

4. Start development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Contact API

`POST /api/contact`

Body:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "phone": "+1 555 123 4567",
  "message": "Project details"
}
```

The request is validated with Zod on both client and server before email delivery.

