"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Flame,
  Gauge,
  LifeBuoy,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  ACTIVE_COURSES,
  QUICK_STATS,
  rankForTrack,
  getActiveUser,
} from "@/lib/dashboardData";
import RequestHelpModal from "./RequestHelpModal";
import ForgeAiPanel from "./ForgeAiPanel";

const STAT_ICONS = {
  book: <BookOpen size={17} />,
  gauge: <Gauge size={17} />,
  trophy: <Trophy size={17} />,
  rocket: <Rocket size={17} />,
};

function Toast({ toast }) {
  return (
    <AnimatePresence>
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 right-6 z-[80] max-w-sm border border-rose-500/40 bg-panel/95 p-4 shadow-[0_0_30px_rgba(255,255,255,0.3)] backdrop-blur"
        data-shift-toast="ticket"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
            <CheckCircle2 size={17} />
          </span>
          <div>
            <p className="text-sm font-bold text-white">
              Ticket #{toast.ticket} Created
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
              Senior Mentor assigned — expected response{" "}
              <span className="text-zinc-200">&lt; 15 mins</span> for{" "}
              <span className="text-zinc-200">{toast.module}</span>.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CourseRow({ course, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-2xl border border-line bg-panel/60 p-5 transition-colors hover:border-rose-500/40"
      data-shift-course={course.id}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/25">
            {course.tag}
          </span>
          <h3 className="mt-2 text-base font-bold text-white">{course.title}</h3>
          <p className="mt-1 font-mono text-xs text-zinc-500">{course.module}</p>
        </div>
        <span className="font-mono text-2xl font-extrabold text-rose-400">
          {course.progress}%
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-600 to-red-800 shadow-[0_0_12px_rgba(255,255,255,0.5)]"
          style={{ width: `${course.progress}%` }}
        />
      </div>
      <Link
        href={course.href}
        data-shift-resume={course.id}
        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400 transition-colors hover:text-rose-300"
      >
        Resume Learning
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setUser(getActiveUser());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!user) return null;

  const rank = user.rank || rankForTrack(user.track);
  const streakLabel = user.streak ? `🔥 ${user.streak}-Day Streak` : "🔥 14-Day Streak";
  const xpLabel = `2,450 XP`;
  const initials = (user.name || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-32 h-[460px] w-[460px] rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-24 h-[400px] w-[400px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 font-mono text-xl font-extrabold text-obsidian shadow-[0_0_28px_rgba(255,255,255,0.55)]">
              {user.avatarFallback || initials}
              <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-line bg-panel">
                <Sparkles size={11} className="text-rose-400" />
              </span>
            </span>
            <div data-shift-student="identity">
              <p className="text-xl font-bold text-white">{user.name}</p>
              <p className="mt-0.5 font-mono text-sm text-zinc-500">
                {user.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/30 shadow-[0_0_14px_rgba(255,255,255,0.2)]">
                  {rank}
                </span>
                {user.isPaid && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/30">
                    <BadgeCheck size={12} />
                    Guided Tier · Paid
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-400 ring-1 ring-amber-500/30">
                  <Flame size={12} />
                  {streakLabel}
                </span>
                <span
                  data-shift-stat-xp
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-300 ring-1 ring-line"
                >
                  <Rocket size={12} className="text-rose-400" />
                  {xpLabel}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-shift-help-open
            onClick={() => setHelpOpen(true)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3 text-sm font-bold text-obsidian shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_32px_rgba(255,255,255,0.65)] hover:brightness-110"
          >
            <LifeBuoy size={16} className="transition-transform group-hover:scale-110" />
            Request Instructor Assistance
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-rose-500/40"
              data-shift-stat={stat.label.toLowerCase().replace(/\s+/g, "-")}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/25">
                {STAT_ICONS[stat.icon]}
              </span>
              <p className="mt-3 font-mono text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Live Study Progress</h2>
              <span className="font-mono text-[11px] text-zinc-500">
                synced · last session today
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {ACTIVE_COURSES.map((course, index) => (
                <CourseRow key={course.id} course={course} index={index} />
              ))}
            </div>
          </div>

          <ForgeAiPanel />
        </div>
      </div>

      <RequestHelpModal
        open={helpOpen}
        user={user}
        onClose={() => setHelpOpen(false)}
        onSubmitted={(t) => setToast(t)}
      />
      {toast && <Toast toast={toast} />}
    </section>
  );
}