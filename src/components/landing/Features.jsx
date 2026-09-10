import {
  Code2,
  FlaskConical,
  Layers,
  Bot,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const FEATURES = [
  {
    icon: Code2,
    number: "01",
    title: "In-Browser Monaco IDE",
    description:
      "Zero environment setup. A production-grade Monaco editor boots instantly in your tab — with autocomplete, linting, and terminal output baked in.",
    hint: "~/workspace/forge-track",
    accent: "from-red-500 to-rose-600",
  },
  {
    icon: FlaskConical,
    number: "02",
    title: "Automated Test Runner",
    description:
      "Every challenge is graded by an automated runner. Get instant feedback with pass/fail runtimes, coverage reports, and exactly what broke.",
    hint: "✓ 42 tests · 100% cov",
    accent: "from-rose-600 to-red-900",
  },
  {
    icon: Layers,
    number: "03",
    title: "Dual-Ecosystem Paths",
    description:
      "Flow naturally from REST APIs and Postgres to Solidity, Solana, and Anchor — one unified curriculum across Web2 and Web3.",
    hint: "web2 → web3 bridge",
    accent: "from-red-500 to-red-900",
  },
  {
    icon: Bot,
    number: "04",
    title: "Guided AI Coding Tutor",
    description:
      "A context-aware AI tutor watches your editor, injects real-time hints, explains errors in plain language, and never just hands you the answer.",
    hint: "v1.0 tutor · online",
    accent: "from-rose-500 to-red-800",
  },
];

export default function Features() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How DevForge Operates"
          title="Everything a modern atom needs"
          description="A tight-loop feedback platform engineered like the tools you already love — idea, code, test, ship — all in one page."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.number} delay={index * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-panel p-6 transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_40px_rgba(225,29,72,0.28)] hover:-translate-y-1.5">
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${feature.accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30`}
                />
                <div className="flex items-start justify-between">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-[0_0_22px_rgba(225,29,72,0.4)] transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon size={22} />
                  </span>
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-600 transition-colors group-hover:text-rose-500/70">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>

                <div className="mt-5 rounded-lg border border-line bg-[#0a0a0e] px-3 py-2 font-mono text-[11px] text-zinc-500">
                  <span className="text-rose-400">{feature.hint}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}