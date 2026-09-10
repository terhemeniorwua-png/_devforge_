import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}) {
  const alignClasses =
    align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <Reveal className={`flex flex-col ${alignClasses}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-rose-400 shadow-[0_0_18px_rgba(225,29,72,0.15)]">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 animate-pulse-glow" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}