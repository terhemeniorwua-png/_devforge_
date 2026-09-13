"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  FileCode2,
  Gauge,
  LifeBuoy,
  Plus,
  Search,
  Send,
  Sparkles,
  TerminalSquare,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  COHORT_STUDENTS,
  MENTOR,
  MENTOR_METRICS,
  QUIZ_ANALYTICS,
  SEED_TICKETS,
  SUBMISSION_SNIPPETS,
  sortTickets,
} from "@/lib/instructorData";

const TICKETS_KEY = "devforge_tickets";
const CUSTOM_QUESTIONS_KEY = "devforge_custom_questions";

const PRIORITY_STYLES = {
  blocker: {
    label: "System Blocker",
    badge: "border-red-500/60 bg-red-600/15 text-red-300 shadow-[0_0_16px_rgba(255,255,255,0.4)]",
    row: "border-red-500/50 shadow-[0_0_20px_rgba(255,255,255,0.25)]",
    dot: "bg-red-500 animate-pulse-glow",
  },
  urgent: {
    label: "Urgent",
    badge: "border-amber-500/50 bg-amber-500/10 text-amber-300",
    row: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  low: {
    label: "Low",
    badge: "border-zinc-500/40 bg-white/5 text-zinc-300",
    row: "border-line",
    dot: "bg-zinc-500",
  },
};

const METRIC_ICONS = {
  users: <Users size={17} />,
  lifebuoy: <LifeBuoy size={17} />,
  clock: <Clock size={17} />,
  check: <CheckCircle2 size={17} />,
};

function readTickets() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TICKETS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // seed below
  }
  try {
    window.localStorage.setItem(TICKETS_KEY, JSON.stringify(SEED_TICKETS));
  } catch {
    // storage unavailable
  }
  return SEED_TICKETS;
}

function writeTickets(tickets) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function CodeView({ code, filename, lang }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#0a1122]">
      <div className="flex items-center gap-1.5 border-b border-line bg-white/[0.03] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-[11px] text-zinc-400">
          {filename || lang || "submission"}
        </span>
      </div>
      <div className="grid grid-cols-[2.5rem_1fr]">
        <div className="select-none border-r border-line bg-[#0a1121] py-4 text-right font-mono text-[12px] leading-6 text-zinc-700">
          {String(code || "").split("\n").map((_, i) => (
            <div key={i} className="pr-3">{i + 1}</div>
          ))}
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6 text-emerald-300/90">
          {code}
        </pre>
      </div>
    </div>
  );
}

function AddQuestionModal({ open, onClose, onSaved }) {
  const [track, setTrack] = useState("Backend");
  const [ecosystem, setEcosystem] = useState("Web3");
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const canSave =
    prompt.trim().length > 8 &&
    options.every((o) => o.trim().length > 1) &&
    explanation.trim().length > 8;

  const save = (e) => {
    e.preventDefault();
    if (!canSave) return;
    const question = {
      id: `custom-${Date.now().toString(36)}`,
      track,
      ecosystem,
      prompt: prompt.trim(),
      code: code.trim() || "pseudo code",
      options: options.map((o) => o.trim()),
      answer,
      explanation: explanation.trim(),
      custom: true,
    };
    try {
      const raw = window.localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      window.localStorage.setItem(
        CUSTOM_QUESTIONS_KEY,
        JSON.stringify([...(Array.isArray(existing) ? existing : []), question])
      );
    } catch {
      // storage unavailable
    }
    onSaved(question);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-panel shadow-[0_0_60px_rgba(255,255,255,0.2)]"
        >
          <div className="flex items-center justify-between border-b border-line bg-[#0e1629] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                <Plus size={18} />
              </span>
              <div>
                <p className="text-base font-bold text-white">Add New Assessment Question</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Ships straight to the Quiz Hub bank
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={save} className="space-y-4 px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Track
                </span>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-rose-500/60"
                >
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Fullstack</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Ecosystem
                </span>
                <select
                  value={ecosystem}
                  onChange={(e) => setEcosystem(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-rose-500/60"
                >
                  <option>Web2</option>
                  <option>Web3</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Question prompt
              </span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                placeholder="Which Anchor account constraint creates a new account on-chain?"
                className="mt-1.5 w-full resize-none rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Code snippet (optional)
              </span>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={2}
                placeholder="#[account(init, ____, space = ...)]"
                className="mt-1.5 w-full resize-none rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-emerald-300/90 placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
              />
            </label>

            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Answer options
              </span>
              <div className="mt-1.5 space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAnswer(i)}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-xs font-bold transition-all ${
                        answer === i
                          ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                          : "border-line text-zinc-500 hover:border-rose-500/40"
                      }`}
                    >
                      {answer === i ? <Check size={15} strokeWidth={3} /> : ["A", "B", "C", "D"][i]}
                    </button>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const next = [...options];
                        next[i] = e.target.value;
                        setOptions(next);
                      }}
                      placeholder={`Option ${["A", "B", "C", "D"][i]}`}
                      className="w-full rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
                    />
                  </div>
                ))}
                <p className="font-mono text-[10px] text-zinc-600">
                  The highlighted chip is marked as the correct answer.
                </p>
              </div>
            </div>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Explanation
              </span>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={2}
                placeholder="Explain why the correct option is right…"
                className="mt-1.5 w-full resize-none rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="font-mono text-[10px] text-zinc-600">
                Saved locally to devforge_custom_questions
              </span>
              <button
                type="submit"
                disabled={!canSave}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3 text-sm font-bold text-obsidian shadow-[0_0_18px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.65)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap size={15} />
                Publish to Quiz Hub
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function InstructorDashboard() {
  const [online, setOnline] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState("");
  const [inspect, setInspect] = useState(null);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const initial = readTickets();
      setTickets(initial);
      setSelectedId(initial[0]?.id || null);
    }, 0);
    const onStorage = () => {
      const next = readTickets();
      setTickets(next);
      setSelectedId((current) => current || next[0]?.id || null);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!savedFlash) return undefined;
    const timer = setTimeout(() => setSavedFlash(null), 4000);
    return () => clearTimeout(timer);
  }, [savedFlash]);

  const sorted = useMemo(() => sortTickets(tickets), [tickets]);
  const openTickets = sorted.filter((t) => t.status === "Open");
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const selected = sorted.find((t) => t.id === selectedId) || null;

  const resolveTicket = () => {
    if (!selected || !reply.trim()) return;
    const next = tickets.map((t) =>
      t.id === selected.id
        ? {
            ...t,
            status: "Resolved",
            mentorReply: reply.trim(),
            resolvedAt: new Date().toISOString(),
          }
        : t
    );
    writeTickets(next);
    setTickets(next);
    setReply("");
    setSavedFlash({
      id: `flash-${Date.now()}`,
      ticket: selected.id,
    });
  };

  const inspectSubmission = (student) => {
    setInspect(student);
  };

  const actionToast = (msg) => {
    setSavedFlash({ id: `flash-${Date.now()}`, custom: msg });
  };

  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-32 h-[460px] w-[460px] rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-24 h-[400px] w-[400px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 font-mono text-xl font-extrabold text-obsidian shadow-[0_0_28px_rgba(255,255,255,0.55)]">
              {MENTOR.avatarFallback}
              <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-line bg-panel">
                <BadgeCheck size={11} className="text-emerald-400" />
              </span>
            </span>
            <div data-shift-mentor="identity">
              <p className="text-xl font-bold text-white">{MENTOR.name}</p>
              <p className="mt-0.5 font-mono text-sm text-zinc-500">{MENTOR.role}</p>
              <p className="mt-0.5 font-mono text-[11px] text-zinc-600">
                {MENTOR.email} · {MENTOR.cohort}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              data-shift-online-toggle
              onClick={() => setOnline((v) => !v)}
              className={`inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                online
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.25)]"
                  : "border-zinc-600/50 bg-white/[0.03] text-zinc-400"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  online ? "bg-emerald-400 animate-pulse-glow" : "bg-zinc-500"
                }`}
              />
              {online ? "Accepting Live Tickets" : "Offline"}
            </button>
            <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel/60 px-4 py-2.5 font-mono text-xs text-zinc-400">
              <Activity size={14} className="text-rose-400" />
              {openTickets.length} open ticket{openTickets.length === 1 ? "" : "s"} ·{" "}
              {resolvedCount} resolved
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MENTOR_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-rose-500/40"
              data-shift-mentor-stat={metric.label.toLowerCase().replace(/\s+/g, "-")}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/25">
                {METRIC_ICONS[metric.icon]}
              </span>
              <p className="mt-3 font-mono text-2xl font-extrabold text-white">{metric.value}</p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-line bg-panel/70 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-line bg-[#0e1629] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                    <LifeBuoy size={17} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">Student Ticket Queue</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      1-on-1 Assistance Desk
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-glow" />
                  {openTickets.length} pending
                </span>
              </div>

              {tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <Search size={26} className="text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-500">
                    No help requests yet. Student tickets submitted from the
                    dashboard will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="max-h-[480px] space-y-2 overflow-y-auto p-4">
                  {sorted.map((ticket) => {
                    const style = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.low;
                    const isSelected = selectedId === ticket.id;
                    return (
                      <button
                        key={ticket.id}
                        type="button"
                        data-shift-ticket={ticket.id}
                        onClick={() => setSelectedId(ticket.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? `${style.row} bg-panel/90`
                            : "border-line bg-white/[0.02] hover:border-rose-500/30"
                        } ${ticket.status === "Resolved" ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white">
                                #{ticket.id}
                              </span>
                              <span
                                className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${style.badge}`}
                              >
                                {style.label}
                              </span>
                              <span
                                className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
                                  ticket.status === "Resolved"
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                    : "border-zinc-600/40 bg-white/5 text-zinc-400"
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </div>
                            <p className="mt-2 truncate text-sm font-semibold text-white">
                              {ticket.studentName}
                            </p>
                            <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                              {ticket.module}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] text-zinc-600">
                            {timeAgo(ticket.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {ticket.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-line bg-panel/70 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-line bg-[#0e1629] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                    <FileCode2 size={17} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">Student Progress &amp; Submissions</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Assigned cohort inspector
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-line bg-white/[0.02] font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      <th className="px-5 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Current Course</th>
                      <th className="px-4 py-3 font-semibold">Progress</th>
                      <th className="px-4 py-3 font-semibold">Latest Submission</th>
                      <th className="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COHORT_STUDENTS.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-line/60 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-white">{student.name}</p>
                          <p className="font-mono text-[10px] text-zinc-600">{student.track}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-[220px] truncate text-xs text-zinc-300">
                            {student.course}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-28">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-rose-400">
                                {student.progress}%
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-600 to-red-800"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Code2 size={13} className="shrink-0 text-zinc-500" />
                            <span className="truncate font-mono text-[11px] text-zinc-300">
                              {student.submission.file}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
                                student.submission.status === "approved"
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                  : student.submission.status === "revision"
                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                    : "border-zinc-600/40 bg-white/5 text-zinc-400"
                              }`}
                            >
                              {student.submission.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => inspectSubmission(student)}
                              className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-rose-500/50 hover:text-white"
                            >
                              Inspect Submission
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                actionToast(`Additional exercises assigned to ${student.name}.`)
                              }
                              className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-rose-500/50 hover:text-white"
                            >
                              Assign Exercises
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                actionToast(`+500 XP boost granted to ${student.name}.`)
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-500/15"
                            >
                              <Zap size={11} />
                              XP Boost
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-line bg-panel/70 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur">
              <div className="border-b border-line bg-[#0e1629] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                    <Gauge size={17} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">Ticket Inspection Panel</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Read the full request · reply &amp; resolve
                    </p>
                  </div>
                </div>
              </div>

              {!selected ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <TerminalSquare size={26} className="text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-500">
                    Select a ticket to inspect the student profile, code, and problem.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">#{selected.id}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        {timeAgo(selected.createdAt)} · submitted via dashboard
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${
                        PRIORITY_STYLES[selected.priority]?.badge || PRIORITY_STYLES.low.badge
                      }`}
                    >
                      {PRIORITY_STYLES[selected.priority]?.label || "Low"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-line bg-[#0a1121] p-4">
                    <p className="text-sm font-bold text-white">{selected.studentName}</p>
                    <p className="font-mono text-[11px] text-zinc-500">{selected.studentEmail}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/25">
                        {selected.course}
                      </span>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 ring-1 ring-line">
                        {selected.module}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                      Problem description
                    </p>
                    <p className="mt-1.5 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">
                      {selected.description}
                    </p>
                  </div>

                  {selected.snippet && (
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                        Submitted code snippet
                      </p>
                      <div className="mt-1.5">
                        <CodeView
                          code={selected.snippet}
                          filename={`${selected.id.toLowerCase()}.rs`}
                          lang="rust"
                        />
                      </div>
                    </div>
                  )}

                  {selected.status === "Resolved" ? (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                        <CheckCircle2 size={15} />
                        Resolved
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                        {selected.mentorReply}
                      </p>
                      {selected.resolvedAt && (
                        <p className="mt-2 font-mono text-[10px] text-zinc-500">
                          Resolved {timeAgo(selected.resolvedAt)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <label className="block">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                          Mentor response
                        </span>
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          rows={4}
                          placeholder="Walk the student through the fix, share a corrected sample, and point to the relevant module…"
                          className="mt-1.5 w-full resize-none rounded-lg border border-line bg-[#0a1122] px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
                        />
                      </label>
                      <button
                        type="button"
                        data-shift-ticket-resolve
                        disabled={!reply.trim()}
                        onClick={resolveTicket}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3 text-sm font-bold text-obsidian shadow-[0_0_18px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.65)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send size={15} />
                        Resolve &amp; Reply to Student
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-line bg-panel/70 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-line bg-[#0e1629] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                    <BookOpen size={17} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">Course &amp; Quiz Analytics</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Assessment pass rates across cohorts
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {QUIZ_ANALYTICS.map((item) => (
                  <div key={item.course}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-white">{item.course}</p>
                      <span className="shrink-0 font-mono text-xs font-bold text-emerald-400">
                        {item.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          style={{ width: `${item.passRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-600">
                        {item.attempts} attempts
                      </span>
                    </div>
                  </div>
                ))}

                <div className="mt-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300">
                    <Sparkles size={15} className="mt-0.5 shrink-0 text-rose-400" />
                    Add original assessment questions to the global Quiz Hub
                    bank — they appear in student quizzes immediately.
                  </p>
                  <button
                    type="button"
                    data-shift-add-question
                    onClick={() => setQuestionOpen(true)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3 text-sm font-bold text-obsidian shadow-[0_0_18px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.65)]"
                  >
                    <Plus size={15} />
                    Add New Assessment Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {inspect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setInspect(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-panel shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              <div className="flex items-center justify-between border-b border-line bg-[#0e1629] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                    <FileCode2 size={17} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">Submission Inspector</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      {inspect.name} · {inspect.submission.file}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspect(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[220px_1fr]">
                <div className="space-y-3">
                  <div className="rounded-xl border border-line bg-[#0a1121] p-4">
                    <p className="text-sm font-bold text-white">{inspect.name}</p>
                    <p className="font-mono text-[11px] text-zinc-500">{inspect.course}</p>
                    <div className="mt-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Course progress
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold text-rose-400">
                        {inspect.progress}%
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-600 to-red-800"
                          style={{ width: `${inspect.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        actionToast(`Submission approved for ${inspect.name}.`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/15"
                    >
                      <Check size={13} strokeWidth={3} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        actionToast(`Revision requested for ${inspect.name}.`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition-colors hover:bg-amber-500/15"
                    >
                      <AlertTriangle size={13} />
                      Request Revision
                    </button>
                  </div>
                </div>
                <CodeView
                  code={SUBMISSION_SNIPPETS[inspect.submission.file] || "// no snippet recorded"}
                  filename={inspect.submission.file}
                  lang={inspect.submission.lang}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {savedFlash && (
          <motion.div
            key={savedFlash.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[90] max-w-sm border border-emerald-500/40 bg-panel/95 p-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur"
            data-shift-mentor-toast="resolved"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  {savedFlash.custom
                    ? "Action completed"
                    : `Ticket #${savedFlash.ticket} resolved`}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                  {savedFlash.custom || (
                    <>
                      Reply sent to the student and status updated in{" "}
                      <span className="text-zinc-200">devforge_tickets</span>.
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddQuestionModal
        open={questionOpen}
        onClose={() => setQuestionOpen(false)}
        onSaved={(q) =>
          setSavedFlash({
            id: `flash-${Date.now()}`,
            custom: `Question published to the Quiz Hub bank: "${q.prompt.slice(0, 60)}…"`,
          })
        }
      />
    </section>
  );
}