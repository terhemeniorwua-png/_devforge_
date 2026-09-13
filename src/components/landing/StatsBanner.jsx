import Reveal from "./Reveal";

const STATS = [
  {
    value: "50+",
    label: "Engineering Modules",
    sub: "Frontend · Backend · Fullstack",
  },
  {
    value: "100%",
    label: "In-Browser Execution",
    sub: "Monaco IDE · test runner · devnet",
  },
  {
    value: "Web2 & Web3",
    label: "Certified",
    sub: "Verifiable on-chain & portable",
  },
  {
    value: "20k+",
    label: "Developers",
    sub: "Forging in the sandbox daily",
  },
];

export default function StatsBanner() {
  return (
    <section className="relative py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-line bg-panel/70 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`group relative px-8 py-9 ${
                  index !== 0 ? "border-t border-line sm:border-t-0" : ""
                } ${
                  index % 2 === 1 && index !== 0
                    ? "sm:border-l sm:border-line"
                    : ""
                } ${
                  index >= 2 ? "border-t border-line lg:border-t-0" : ""
                } ${
                  index > 0 ? "lg:border-l lg:border-line" : ""
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="font-mono text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-zinc-300">
                  {stat.label}
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}