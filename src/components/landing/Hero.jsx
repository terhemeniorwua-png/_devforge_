import Link from "next/link";
import {
  ArrowRight,
  Play,
  Sparkles,
  TerminalSquare,
  Globe2,
  Braces,
  ShieldCheck,
} from "lucide-react";
import Reveal from "./Reveal";

const HERO_STATS = [
  { value: "50+", label: "Engineering modules" },
  { value: "100%", label: "In-browser execution" },
  { value: "1:1", label: "AI-guided feedback" },
];

function MacEditorWindow() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] radial-crimson blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_0_60px_rgba(255,255,255,0.25)]">
        <div className="flex items-center gap-3 border-b border-line bg-[#0f172b] px-4 py-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400">
            <Braces size={12} className="text-rose-400" />
            devforge-hero.tsx
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-glow" />
            Live
          </span>
        </div>

        <div className="relative">
          <video
            src="/videos/hero.mp4"
            poster="/videos/hero.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060b1c]/70 via-transparent to-transparent" />
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 rounded-lg border border-rose-500/30 bg-[#0a1122]/80 px-3 py-2 font-mono text-xs text-zinc-300 shadow-[0_0_18px_rgba(255,255,255,0.25)] backdrop-blur-sm">
            <span className="text-rose-400">$</span> forge run track --web3
            <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-rose-400 animate-caret" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-[#0f172b] px-4 py-3 font-mono text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            42 passing · 0 failing
          </span>
          <span>Solana program deployed on devnet</span>
          <span className="text-rose-400">✓ SHA-256 verified</span>
        </div>
      </div>

      <Reveal
        delay={400}
        direction="left"
        className="absolute -left-6 top-24 hidden md:block"
      >
        <div className="animate-float rounded-xl border border-line bg-panel/95 px-4 py-3 shadow-[0_0_24px_rgba(0,0,0,0.5)] backdrop-blur">
          <p className="flex items-center gap-2 font-mono text-xs text-zinc-300">
            <Sparkles size={13} className="text-rose-400" />
            AI hint injected
          </p>
          <p className="mt-1 font-mono text-[10px] text-zinc-500">
            fix borrow checker on line 14 →
          </p>
        </div>
      </Reveal>

      <Reveal
        delay={600}
        direction="right"
        className="absolute -right-5 bottom-16 hidden md:block"
      >
        <div
          className="animate-float rounded-xl border border-line bg-panel/95 px-4 py-3 shadow-[0_0_24px_rgba(0,0,0,0.5)] backdrop-blur"
          style={{ animationDelay: "1.2s" }}
        >
          <p className="flex items-center gap-2 font-mono text-xs text-zinc-300">
            <ShieldCheck size={13} className="text-emerald-400" />
            Test runner
          </p>
          <p className="mt-1 font-mono text-[10px] text-zinc-500">
            100% coverage · graded
          </p>
        </div>
      </Reveal>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 grid-lines" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[420px] w-[420px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        <div className="flex flex-col items-start">
        

          <Reveal delay={160}>
            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Master Modern{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700 text-glow-red">
                Software Engineering
              </span>{" "}
              for Web2 &amp; Web3.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              Interactive, in-browser coding tracks for{" "}
              <span className="font-semibold text-white">Frontend</span>,{" "}
              <span className="font-semibold text-white">Backend</span>, and{" "}
              <span className="font-semibold text-white">Fullstack</span>{" "}
              engineers. Build production apps and smart contracts with guided
              AI feedback.
            </p>
          </Reveal>

          <Reveal delay={320} className="mt-9 flex w-full flex-wrap items-center justify-between gap-3">
            <Link
              href="/catalog"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-6 py-3.5 text-base font-semibold text-obsidian shadow-[0_0_30px_rgba(255,255,255,0.45)] transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.75)] hover:brightness-110"
            >
              Explore Courses
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/vault"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/5 px-6 py-3.5 text-base font-semibold text-rose-300 transition-all hover:border-rose-400/70 hover:bg-rose-500/10 hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]"
            >
              <Play size={17} className="transition-transform group-hover:scale-110" />
              Try Live Sandbox
            </Link>
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 px-6 py-3.5 text-base font-semibold text-amber-300 transition-all hover:border-amber-400/70 hover:bg-amber-500/10 hover:shadow-[0_0_28px_rgba(245,158,11,0.35)]"
            >
              Get 1-on-1 Guidance
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={420} className="mt-10 flex w-full max-w-xl flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold text-white">
                  {stat.value}
                </span>
                <span className="max-w-[9rem] text-xs leading-tight text-zinc-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={500} className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-panel/80 px-3.5 py-2 font-mono text-xs text-zinc-400">
            <TerminalSquare size={14} className="text-rose-400" />
            No downloads. No setup. Just <span className="mx-1 text-white">&lt;/&gt;</span>{" "}
            and run.
          </Reveal>
        </div>

        <Reveal delay={300} direction="left" className="w-full">
          <MacEditorWindow />
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <Globe2 size={18} className="animate-pulse text-rose-500/50" />
      </div>
    </section>
  );
}