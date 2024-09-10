import React from "react";
import { DM_Sans } from "next/font/google";
import { Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Note Nexus",
  description: "コーネルメソッド記法を用いたノートテイキングができるアプリ",
};

const fontHeading = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "400",
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <body
        className={cn(
          "antialiased min-h-screen flex flex-col",
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <header className="p-4 border-b">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold font-heading">NoteNexus</h1>
          </nav>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="p-4 border-t text-center text-muted-foreground">
          <div className="max-w-7xl mx-auto">
            © 2024 NoteNexus. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
