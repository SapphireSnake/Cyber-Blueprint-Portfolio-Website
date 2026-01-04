import type { Metadata } from "next";
import { Roboto_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { ThemeManager } from "@/components/ThemeManager";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Alex Mitelman | Systems Architect",
  description: "Portfolio of Alex Mitelman - IoT, Full Stack, and Embedded Systems Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans bg-schematic-bg text-schematic-primary overflow-x-hidden selection:bg-schematic-accent selection:text-schematic-bg`}>
        <ThemeManager />
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
