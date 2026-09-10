import Link from "next/link";
import { ArrowRight, Sparkles, TerminalSquare } from "lucide-react";
import Reveal from "./Reveal";

export default function CtaBanner() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="shimmer-border relative overflow-hidden rounded-3xl border border-line bg-panel px-6 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full radial-red blur-3xl" />
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-rose-400">
                <Sparkles size={13} />
                Free previews · No credit card
              </span>
              <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Forge your first{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700 text-glow-red">
                  production project
                </span>{" "}
                this week
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
                Join 20,000+ engineers building in the browser. Start guided or
                explore self-study — the first track is always free.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/catalog"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_34px_rgba(225,29,72,0.55)] transition-all hover:shadow-[0_0_54px_rgba(225,29,72,0.85)] hover:brightness-110"
                >
                  Start Learning Free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/onboarding"
                  className="group inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 px-7 py-3.5 text-base font-semibold text-amber-300 transition-all hover:border-amber-400/70 hover:bg-amber-500/10 hover:shadow-[0_0_28px_rgba(245,158,11,0.35)]"
                >
                  Get 1-on-1 Guidance
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-7 py-3.5 text-base font-semibold text-zinc-200 transition-all hover:border-rose-500/40 hover:text-white"
                >
                  <TerminalSquare size={17} className="text-rose-400" />
                  Take the Quiz Challenge
                </Link>
              </div>
              <p className="mt-7 font-mono text-xs text-zinc-500">
                $ forge --track fullstack/blockchain --guided &quot;start now&quot;
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}