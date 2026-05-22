import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillBridge AI — From Learning to Hiring",
  description:
    "AI-powered career development platform. Analyze your resume, identify skill gaps, get personalized roadmaps, and land your dream job.",
  keywords: ["career", "AI", "resume", "skill gap", "job", "internship", "roadmap"],
  authors: [{ name: "SkillBridge AI" }],
  openGraph: {
    title: "SkillBridge AI",
    description: "Your AI career copilot — from learning to hiring.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
