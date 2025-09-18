// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import React from "react";
import { Chivo } from "next/font/google";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Providers } from "../providers";
import { DarkModeProvider } from "../components/DarkModeProvider";

const chivo = Chivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chivo",
});
const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // Add dark mode state and toggle
  return (
    <html lang="en">
      <body className={chivo.variable + " " + rubik.variable}>
        <Providers>
          <DarkModeProvider>
            <Appbar />
            {children}
            <Footer />
          </DarkModeProvider>
        </Providers>
      </body>
    </html>
  );
}
