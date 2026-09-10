import { Check, X, Crown, Minus } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const MATRIX_GROUPS = [
  {
    label: "Learning",
    rows: [
      {
        label: "Browse catalog with live video previews",
        guest: true,
        learner: true,
      },
      {
        label: "Unlimited free preview modules",
        guest: true,
        learner: true,
      },
      {
        label: "Automated test runner & instant grading",
        guest: false,
        learner: true,
      },
      {
        label: "Certified project portfolio",
        guest: false,
        learner: true,
      },
    ],
  },
  {
    label: "AI & Tooling",
    rows: [
      {
        label: "Guided AI tutor hints & debugging",
        guest: "limited",
        learner: true,
      },
      {
        label: "Full Monaco tooling: debugger, terminals, extensions",
        guest: false,
        learner: true,
      },
      {
        label: "On-chain devnet deployments (Solana / EVM)",
        guest: false,
        learner: true,
      },
    ],
  },
  {
    label: "Progress & Community",
    rows: [
      {
        label: "Progress tracking, streaks & analytics",
        guest: false,
        learner: true,
      },
      {
        label: "Verifiable Web2 & Web3 certificates",
        guest: false,
        learner: true,
      },
      {
        label: "Community, mentorship & code reviews",
        guest: false,
        learner: true,
      },
    ],
  },
];

function CapabilityCell({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-rose-400">
        <Check size={15} className="text-rose-400" />
        Yes
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-zinc-600">
        <X size={14} />
        No
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-zinc-400">
      <Minus size={14} className="text-amber-400" />
      Limited · 5/day
    </span>
  );
}

export default function FeatureMatrix() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Member Versus Guest"
          title="Guided vs. Self-Study"
          description="Try the full experience as a guest — then unlock automated grading, the AI tutor, and verifiable certifications when you're ready to forge."
        />

        <Reveal delay={150} className="mt-12 overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_0_50px_rgba(225,29,72,0.12)]">
          <div className="grid grid-cols-[1.5fr_0.9fr_1.1fr] items-center border-b border-line bg-[#0c0c10] px-5 py-4 sm:px-7">
            <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Capabilities
            </span>
            <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Guest
            </span>
            <span className="inline-flex items-center justify-start gap-2 text-sm font-bold uppercase tracking-widest">
              <Crown size={16} className="text-amber-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700">
                Registered Learner
              </span>
            </span>
          </div>

          {MATRIX_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 bg-rose-500/[0.06] px-5 py-2.5 sm:px-7">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-rose-400/90">
                  {group.label}
                </span>
              </div>
              {group.rows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.5fr_0.9fr_1.1fr] items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:px-7 ${
                    index !== group.rows.length - 1 ? "border-b border-line/60" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-zinc-200">
                    {row.label}
                  </span>
                  <span>
                    <CapabilityCell value={row.guest} />
                  </span>
                  <span>
                    <CapabilityCell value={row.learner} />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </Reveal>

        <Reveal delay={250} className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Ready to go all-in?{" "}
            <Link
              href="/onboarding"
              className="cursor-pointer font-semibold text-rose-400 underline decoration-rose-500/40 underline-offset-4 hover:text-rose-300"
            >
              Enroll for guided 1-on-1 mentorship
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}