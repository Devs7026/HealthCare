import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Healthify — Your Intelligent Health Companion",
  description: "Log meals, track symptoms, get AI-powered dietary recommendations and medical guidance — all in one beautiful, intuitive interface.",
  keywords: ["health", "diet", "food log", "symptoms", "AI medical assistant", "nutrition"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
