import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevForge — Learn Modern Software Engineering. Built for Web2 & Web3.",
  description:
    "Interactive, in-browser coding tracks for Frontend, Backend, and Fullstack engineers. Build production apps and smart contracts with guided AI feedback.",
  keywords: [
    "DevForge",
    "learn to code",
    "frontend",
    "backend",
    "fullstack",
    "web3",
    "solidity",
    "solana",
    "rust",
    "react",
    "coding bootcamp",
  ],
  openGraph: {
    title: "DevForge — Master Modern Software Engineering",
    description:
      "Build production apps and smart contracts with guided AI feedback. 100% in-browser.",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-obsidian">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}