import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { Intro } from "@/components/chrome/Intro";
import { MotionRuntime } from "@/components/chrome/MotionRuntime";
import { profile } from "@/content/site";
import "./globals.css";

const hostGrotesk = localFont({
  src: [
    { path: "./fonts/HostGrotesk-Variable.woff2", weight: "300 800", style: "normal" },
    { path: "./fonts/HostGrotesk-Italic-Variable.woff2", weight: "300 800", style: "italic" },
  ],
  variable: "--font-host",
  display: "swap",
});

const fragmentMono = localFont({
  src: [
    { path: "./fonts/FragmentMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/FragmentMono-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-fragment",
  display: "swap",
});

const title = `${profile.name} — AI Engineer`;
const description =
  "AI engineer at Tata Consultancy Services building RAG pipelines, multi-agent systems and the evals that keep them honest — and the web products around them.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description,
  keywords: ["Aravind Baranitharan", "AI engineer", "RAG", "AI agents", "LangGraph", "MCP", "LLM", "portfolio"],
  openGraph: { title, description, url: profile.siteUrl, siteName: profile.name, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

// Runs before paint: marks JS as available, restores the "intro seen" state, and reveals content if the runtime never loads.
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');try{if(sessionStorage.getItem('ar-intro-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('ar-intro-seen')}else{r.classList.add('ar-intro-pending')}}catch(e){r.classList.add('ar-intro-seen')}setTimeout(function(){r.classList.add('ar-ready');r.classList.remove('ar-intro-pending')},4500)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${fragmentMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="ar-page min-h-full" data-cursor-area="">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Intro />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MotionRuntime />
      </body>
    </html>
  );
}
