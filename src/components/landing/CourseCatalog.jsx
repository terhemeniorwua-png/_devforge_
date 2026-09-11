"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clock, Play, Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const TRACK_TABS = [
  { key: "all", label: "All Tracks" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "fullstack", label: "Fullstack" },
];

const ECOSYSTEMS = [
  { key: "all", label: "Both" },
  { key: "web2", label: "Web2" },
  { key: "web3", label: "Web3" },
];

const COURSES = [
  {
    id: "react-mastery",
    title: "Frontend Mastery with React",
    description:
      "Build reactive, component-driven UIs with hooks, state machines, and the React 19 mental model.",
    video: "/videos/react.mp4",
    poster: "/videos/react.jpg",
    track: "frontend",
    ecosystem: "web2",
    level: "Beginner",
    duration: "6h 30m",
    tags: ["React", "TypeScript", "Vite"],
  },
  {
    id: "nextjs-product",
    title: "Next.js Product Engineering",
    description:
      "Ship production Next.js applications — routing, rendering, APIs, and edge caching done right.",
    video: "/videos/nextjs.mp4",
    poster: "/videos/nextjs.jpg",
    track: "frontend",
    ecosystem: "web2",
    level: "Intermediate",
    duration: "9h",
    tags: ["Next.js", "Tailwind", "API Routes"],
  },
  {
    id: "node-apis",
    title: "Node.js API Architecture",
    description:
      "Design hardened REST and real-time APIs with Node.js, PostgreSQL, and containerized deploys.",
    video: "/videos/node.mp4",
    poster: "/videos/node.jpg",
    track: "backend",
    ecosystem: "web2",
    level: "Intermediate",
    duration: "10h",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "rust-services",
    title: "Rust Systems & Services",
    description:
      "Crash-proof microservices and CLI tooling in Rust with async runtimes and zero-cost abstractions.",
    video: "/videos/rust.mp4",
    poster: "/videos/rust.jpg",
    track: "backend",
    ecosystem: "web2",
    level: "Advanced",
    duration: "12h",
    tags: ["Rust", "Tokio", "Systems"],
  },
  {
    id: "solidity-contracts",
    title: "Solidity Smart Contracts",
    description:
      "Write, audit, and deploy EVM smart contracts with Hardhat and Foundry test suites.",
    video: "/videos/solidity.mp4",
    poster: "/videos/solidity.jpg",
    track: "backend",
    ecosystem: "web3",
    level: "Intermediate",
    duration: "11h",
    tags: ["Solidity", "Hardhat", "Foundry"],
  },
  {
    id: "solana-programs",
    title: "Solana Programs with Anchor",
    description:
      "Build high-performance on-chain programs in Rust with Anchor, PDAs, and CPI patterns.",
    video: "/videos/solana.mp4",
    poster: "/videos/solana.jpg",
    track: "backend",
    ecosystem: "web3",
    level: "Advanced",
    duration: "14h",
    tags: ["Rust", "Anchor", "Solana"],
  },
  {
    id: "web3-dapps",
    title: "Fullstack Web3 dApps",
    description:
      "Connect wallets, run charts, and wire Solana/EVM contracts into real React frontends.",
    video: "/videos/dapp.mp4",
    poster: "/videos/dapp.jpg",
    track: "fullstack",
    ecosystem: "web3",
    level: "Intermediate",
    duration: "16h",
    tags: ["React", "Solana", "WalletKit"],
  },
  {
    id: "fullstack-saas",
    title: "Fullstack SaaS in Production",
    description:
      "A complete Web2 SaaS: Next.js storefront, Stripe billing, Postgres, and CI/CD to the edge.",
    video: "/videos/fullstack.mp4",
    poster: "/videos/fullstack.jpg",
    track: "fullstack",
    ecosystem: "web2",
    level: "Advanced",
    duration: "18h",
    tags: ["Next.js", "Stripe", "Postgres"],
  },
];

function CourseCard({ course, index }) {
  return (
    <Reveal delay={index * 90}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_38px_rgba(255,255,255,0.25)] hover:-translate-y-1.5">
        <div className="relative overflow-hidden">
          <video
            src={course.video}
            poster={course.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-[#0a1122]/85 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400 backdrop-blur-sm">
            <Play size={10} className="fill-rose-400" />
            Free Preview Available
          </div>
          <span className="absolute bottom-3 right-3 rounded-full bg-[#0a1122]/85 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur-sm">
            {course.ecosystem === "web3" ? "Web3" : "Web2"}
          </span>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-[#0a1122]/70 px-2 py-0.5 font-mono text-[10px] text-zinc-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
            <Play size={10} />
            Previewing live
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 ring-1 ring-line">
              {course.level}
            </span>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/25">
              {course.track}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold tracking-tight text-white">
            {course.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
            {course.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500">
              <Clock size={13} /> {course.duration}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-400 transition-colors group-hover:text-rose-300">
              Start Track
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function CourseCatalog() {
  const [track, setTrack] = useState("all");
  const [ecosystem, setEcosystem] = useState("all");

  useEffect(() => {
    const handler = (event) => {
      const detail = event.detail;
      if (TRACK_TABS.some((t) => t.key === detail)) {
        setTrack(detail);
      } else if (ECOSYSTEMS.some((e) => e.key === detail)) {
        setEcosystem(detail);
      }
    };
    window.addEventListener("catalog-filter", handler);
    return () => window.removeEventListener("catalog-filter", handler);
  }, []);

  const filtered = useMemo(() => {
    return COURSES.filter(
      (c) =>
        (track === "all" || c.track === track) &&
        (ecosystem === "all" || c.ecosystem === ecosystem)
    );
  }, [track, ecosystem]);

  return (
    <section id="catalog" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute -left-40 top-32 h-[460px] w-[460px] rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Course Catalog"
          title="Pick a track. Forge a career."
          description="Six battle-tested paths across Frontend, Backend, and Fullstack — spanning classic Web2 APIs to on-chain Web3 smart contracts. Every module runs 100% in your browser."
        />

        <Reveal delay={150} className="mt-10 flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-1.5 rounded-2xl border border-line bg-panel/80 p-1.5 backdrop-blur">
            {TRACK_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTrack(tab.key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  track === tab.key
                    ? "bg-gradient-to-r from-red-500 via-rose-600 to-red-800 text-obsidian shadow-[0_0_20px_rgba(255,255,255,0.45)]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Ecosystem
            </span>
            <div className="flex gap-1.5 rounded-2xl border border-line bg-panel/80 p-1.5 backdrop-blur">
              {ECOSYSTEMS.map((eco) => (
                <button
                  key={eco.key}
                  type="button"
                  onClick={() => setEcosystem(eco.key)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    ecosystem === eco.key
                      ? "bg-white/10 text-white ring-1 ring-rose-500/50 shadow-[0_0_16px_rgba(255,255,255,0.3)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {eco.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {filtered.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-panel/50 px-8 py-14 text-center">
            <p className="text-lg font-semibold text-zinc-300">
              No tracks match that combination.
            </p>
            <p className="text-sm text-zinc-500">
              Try a different domain or ecosystem filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setTrack("all");
                setEcosystem("all");
              }}
              className="mt-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-700 px-5 py-2.5 text-sm font-semibold text-obsidian shadow-[0_0_18px_rgba(255,255,255,0.4)]"
            >
              Reset filters
            </button>
          </Reveal>
        )}

        <Reveal
          delay={200}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-panel/60 px-6 py-4 backdrop-blur"
        >
          {[
            "Guided AI feedback",
            "Certified project portfolio",
            "No local setup required",
            "7-day free previews",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-sm text-zinc-400"
            >
              <Trophy size={14} className="text-rose-500" />
              {item}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}