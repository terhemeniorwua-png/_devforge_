"use client";

import Link from "next/link";
import { ArrowRight, Mail, Rss } from "lucide-react";
import { useContactSettings } from "@/hooks/useContactSettings";
import {
  buildMailtoLink,
  buildWhatsappLink,
} from "@/lib/contactSettings";
import SocialIcon from "./SocialIcon";

const TRACK_COLUMNS = [
  {
    title: "Tracks",
    links: [
      { label: "Frontend Engineering", href: "/catalog" },
      { label: "Backend Engineering", href: "/catalog" },
      { label: "Fullstack Development", href: "/catalog" },
      { label: "Systems & Rust", href: "/catalog" },
    ],
  },
  {
    title: "Ecosystems",
    links: [
      { label: "Web2 Applications", href: "/catalog" },
      { label: "Web3 Smart Contracts", href: "/catalog" },
      { label: "Solana Programs", href: "/catalog" },
      { label: "Ethereum / Solidity", href: "/catalog" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Start Learning", href: "/start-learning" },
      { label: "Resource Vault", href: "/start-learning" },
      { label: "Quiz Hub", href: "/start-learning" },
      { label: "Get Guidance / Enroll", href: "/onboarding" },
      { label: "Login", href: "/join" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs & Videos", href: "/start-learning" },
      { label: "Student Dashboard", href: "/dashboard" },
      { label: "Instructor Portal", href: "/instructor/dashboard" },
      { label: "Changelog", href: "/" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
];

export default function Footer() {
  const { settings } = useContactSettings();

  const emailLink = buildMailtoLink(settings.email);
  const whatsappLink = buildWhatsappLink(settings.whatsappNumber);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-[#07070a]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[560px] -translate-x-1/2 rounded-full radial-crimson blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_24px_rgba(225,29,72,0.5)]">
                <span className="font-mono text-lg font-extrabold text-white">D</span>
              </span>
              <span className="font-mono text-xl font-bold tracking-tight text-white">
                Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700">Forge</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400">
              The in-browser forge for modern software engineers. Code, run, and
              ship production-grade apps and smart contracts with guided AI
              feedback — from your first commit to certified mastery.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <SocialIcon type="email" href={emailLink} />
              <SocialIcon type="whatsapp" href={whatsappLink} />
              <SocialIcon type="facebook" href={settings.facebook} />
              <SocialIcon type="instagram" href={settings.instagram} />
              <SocialIcon type="x" href={settings.x} />
              <SocialIcon type="youtube" href={settings.youtube} />
              <SocialIcon type="tiktok" href={settings.tiktok} />
              <SocialIcon type="linkedin" href={settings.linkedin} />
            </div>
            <div className="mt-8 max-w-sm">
              <p className="text-sm font-semibold text-white">
                Get new tracks in your inbox
              </p>
              <form
                className="mt-3 flex items-center gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="you@devforge.dev"
                  className="w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.15)]"
                />
                <button
                  type="submit"
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(225,29,72,0.35)] transition-all hover:shadow-[0_0_28px_rgba(225,29,72,0.6)]"
                >
                  Join
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {TRACK_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-rose-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} DevForge Labs. All rights reserved.
          </p>
          <p className="font-mono text-xs text-zinc-600">
            Crafted in the browser — 100% in-browser execution.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs text-zinc-500 hover:text-rose-400">
              Privacy
            </Link>
            <Link href="/" className="text-xs text-zinc-500 hover:text-rose-400">
              Terms
            </Link>
            <Link href="/" className="text-xs text-zinc-500 hover:text-rose-400">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}