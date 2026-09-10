"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogIn, Menu, X, Zap } from "lucide-react";

const TRACK_LINKS = [
  { label: "Frontend", filter: "frontend" },
  { label: "Backend", filter: "backend" },
  { label: "Fullstack", filter: "fullstack" },
];

const ECOSYSTEM_LINKS = [
  { label: "Web2", filter: "web2" },
  { label: "Web3", filter: "web3" },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 shrink-0">
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_24px_rgba(225,29,72,0.5)] transition-shadow group-hover:shadow-[0_0_36px_rgba(225,29,72,0.75)]">
        <span className="font-mono text-lg font-extrabold text-white">D</span>
        <span className="absolute -inset-0.5 -z-10 rounded-lg bg-red-500/40 blur-md" />
      </span>
      <span className="font-mono text-xl font-bold tracking-tight text-white">
        Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700">Forge</span>
      </span>
    </Link>
  );
}

function Dropdown({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-panel/95 p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.6),0_0_18px_rgba(225,29,72,0.15)] backdrop-blur-md">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-red-500/10 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const goToCatalog = (filter) => {
    setMobileOpen(false);
    if (pathname === "/catalog") {
      window.dispatchEvent(new CustomEvent("catalog-filter", { detail: filter }));
    } else {
      router.push("/catalog");
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("catalog-filter", { detail: filter }));
      }, 350);
    }
  };

  const plainLinks = [
    <Link
      key="onboarding-link"
      href="/onboarding"
      className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
    >
      Get Guidance
    </Link>,
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-obsidian/85 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {plainLinks}
          <Dropdown
            label="Tracks"
            items={TRACK_LINKS}
            onSelect={(item) => goToCatalog(item.filter)}
          />
          <Dropdown
            label="Ecosystems"
            items={ECOSYSTEM_LINKS}
            onSelect={(item) => goToCatalog(item.filter)}
          />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogIn size={15} className="text-rose-400" />
            Login
          </Link>
          <Link
            href="/start-learning"
            className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:shadow-[0_0_34px_rgba(225,29,72,0.7)] hover:brightness-110"
          >
            <Zap size={15} className="transition-transform group-hover:scale-125" />
            Start Learning
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-zinc-300 lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-line bg-panel/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <Link
              href="/onboarding"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              Get Guidance
            </Link>
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Tracks
            </p>
            {TRACK_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => goToCatalog(item.filter)}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </button>
            ))}
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Ecosystems
            </p>
            {ECOSYSTEM_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => goToCatalog(item.filter)}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                href="/join"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-line px-4 py-2.5 text-center text-sm font-semibold text-zinc-200 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/start-learning"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-gradient-to-r from-red-500 to-rose-700 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}