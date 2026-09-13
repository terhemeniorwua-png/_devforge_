"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  ExternalLink,
  Layers,
  ShieldCheck,
  Globe2,
  TerminalSquare,
} from "lucide-react";
import { ECOSYSTEM_FILTERS, DOC_RESOURCES } from "@/lib/docsData";

function EcosystemBadge({ ecosystem }) {
  const isWeb3 = ecosystem === "web3";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${
        isWeb3
          ? "bg-[#0a1122]/85 text-rose-400 ring-1 ring-rose-500/40"
          : "bg-[#0a1122]/85 text-emerald-400 ring-1 ring-emerald-500/40"
      }`}
    >
      <Globe2 size={10} />
      {isWeb3 ? "Web3" : "Web2"}
    </span>
  );
}

function ResourceCard({ resource, onOpen }) {
  const handleKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };
  return (
    <motion.article
      onClick={onOpen}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-label={`Open ${resource.title} documentation sandbox`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/50 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_38px_rgba(255,255,255,0.25)]"
    >
      <div className="relative overflow-hidden border-b border-line bg-[#0a1122]">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-3 truncate font-mono text-[11px] text-zinc-500">
            {resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md —
            live preview
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-widest text-rose-500">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-rose-500" />
            Live Reel
          </span>
        </div>
        <video
          src={resource.video}
          poster={resource.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
        <div className="absolute top-10 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-[#0a1122]/75 text-rose-400 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <Play size={16} className="ml-0.5 fill-rose-400" />
        </div>
        <div className="absolute bottom-3 right-3">
          <EcosystemBadge ecosystem={resource.ecosystem} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/25">
            {resource.domain}
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 ring-1 ring-line">
            Docs + Video
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold tracking-tight text-white">
          {resource.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
          {resource.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-white"
          >
            <TerminalSquare size={15} className="text-rose-400" />
            Open Documentation Sandbox
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function DocsModal({ resource, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[90] flex items-stretch justify-center bg-black/80 p-2 backdrop-blur-sm sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${resource.title} documentation sandbox`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-rose-500/30 bg-[#0a1122] shadow-[0_0_80px_rgba(255,255,255,0.3)]"
      >
        <div className="flex items-center gap-2 border-b border-line bg-panel/80 px-3 py-2.5 sm:px-4">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <div className="ml-3 hidden flex-1 items-center gap-2 rounded-lg border border-line bg-[#0a1122] px-3 py-1.5 sm:flex">
            <ShieldCheck size={13} className="shrink-0 text-emerald-400" />
            <span className="truncate font-mono text-xs text-zinc-400">
              docs.devforge.io/sandbox/{resource.id}
            </span>
            <span className="ml-auto shrink-0 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">
              sandboxed
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-rose-500/50 hover:text-white sm:inline-flex"
            >
              <ExternalLink size={12} className="text-rose-400" />
              Open native
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-700 px-3 py-1.5 font-mono text-xs font-bold text-obsidian shadow-[0_0_16px_rgba(255,255,255,0.4)] transition-transform hover:scale-[1.03]"
            >
              <X size={13} />
              Close (ESC)
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-line bg-panel/60 px-4 py-2.5 sm:px-6">
            <p className="truncate font-mono text-xs font-semibold text-white">
              {resource.title}
            </p>
            <p className="truncate font-mono text-[11px] text-zinc-500">
              {resource.url}
            </p>
          </div>
          <div className="relative flex-1 bg-white">
            <iframe
              key={resource.id}
              src={resource.url}
              title={`${resource.title} live documentation`}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 border-t border-line bg-[#0a1122]/90 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500 backdrop-blur">
              <ShieldCheck size={11} className="text-emerald-400" />
              secure sandbox · scripts + forms allowed · cross-origin isolated
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DocsStore() {
  const [ecosystem, setEcosystem] = useState("all");
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active]);

  const filtered = useMemo(
    () =>
      DOC_RESOURCES.filter(
        (r) => ecosystem === "all" || r.ecosystem === ecosystem
      ),
    [ecosystem]
  );

  const openResource = (resource) => {
    setActive(resource);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-40 h-[460px] w-[460px] rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-24 h-[400px] w-[400px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-rose-400 shadow-[0_0_18px_rgba(255,255,255,0.15)]">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
            Resource Vault
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Docs & Coding{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700">
              Video Library
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Live looping code reels paired with official, sandboxed developer
            documentation. Browse the vault, jump into a secure docs sandbox,
            and keep the footage rolling while you study.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <Layers size={14} className="text-rose-500" />
            Filter Ecosystem
          </span>
          <div className="flex gap-1.5 rounded-2xl border border-line bg-panel/80 p-1.5 backdrop-blur">
            {ECOSYSTEM_FILTERS.map((tab) => {
              const isActive = ecosystem === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setEcosystem(tab.key)}
                  aria-pressed={isActive}
                  className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-red-500 via-rose-600 to-red-800 text-obsidian shadow-[0_0_20px_rgba(255,255,255,0.45)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"} loaded
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onOpen={() => openResource(resource)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-panel/50 px-8 py-14 text-center">
            <p className="text-lg font-semibold text-zinc-300">
              No resources in that bucket yet.
            </p>
            <button
              type="button"
              onClick={() => setEcosystem("all")}
              className="mt-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-700 px-5 py-2.5 text-sm font-semibold text-obsidian shadow-[0_0_18px_rgba(255,255,255,0.4)]"
            >
              Show All Ecosystems
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <DocsModal
            key={active.id}
            resource={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}