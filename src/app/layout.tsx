import type { Metadata } from "next";
import { Archivo_Black, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Aravind Baranitharan | AI Engineer & Software Developer",
  description:
    "Portfolio of Aravind Baranitharan, an AI engineer and software developer focused on high-performance web apps, SaaS systems, and LLM-powered product development.",
  keywords: [
    "Aravind Baranitharan",
    "AI engineer portfolio",
    "software developer portfolio",
    "Next.js developer",
    "LLM integrations",
    "full stack developer",
  ],
  openGraph: {
    title: "Aravind Baranitharan | AI Engineer & Software Developer",
    description:
      "Building product-grade web applications, AI integrations, and scalable user experiences.",
    url: "https://aravindbaranitharan.com",
    siteName: "Aravind Baranitharan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aravind Baranitharan",
    description:
      "AI engineer and software developer building modern web and AI experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoBlack.variable} ${spaceMono.variable} h-full scroll-smooth`}
    >
      <body className="font-body min-h-screen antialiased">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
