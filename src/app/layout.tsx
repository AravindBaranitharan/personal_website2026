import { Toaster } from "@/components/ui/toaster";
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
  title: "Aravind Baranitharan",
  description:
    "Explore Aravind's full-stack portfolio showcasing innovative UI/UX designs, front-end and back-end projects, and expertise in web development technologies. Ideal for clients and recruiters seeking impactful, design-focused solutions.",
  keywords:
    "Aravind portfolio, full-stack developer, Software developer, UI/UX design, front-end development, back-end development, React.js, Next.js, Tailwind CSS, JavaScript, professional portfolio",
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
        <Toaster />
      </body>
    </html>
  );
}
