"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LifeBuoy, X } from "lucide-react";
import { ACTIVE_COURSES, HELP_MODULES } from "@/lib/dashboardData";

const PRIORITIES = [
  { key: "low", label: "Low", hint: "Can wait until office hours" },
  { key: "urgent", label: "Urgent", hint: "Blocking tonight's milestone" },
  { key: "blocker", label: "System Blocker", hint: "Need a hotfix now" },
];

const TICKETS_KEY = "devforge_tickets";

function makeTicket() {
  const previous = readTickets();
  const nextNum = 9000 + previous.length + 1;
  return `DF-${nextNum}`;
}

function readTickets() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TICKETS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTickets(tickets) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export default function RequestHelpModal({ open, onClose, onSubmitted, user }) {
  const [course, setCourse] = useState(ACTIVE_COURSES[0].title);
  const [module, setModule] = useState(HELP_MODULES[ACTIVE_COURSES[0].title][1]);
  const [priority, setPriority] = useState("urgent");
  const [snippet, setSnippet] = useState("");
  const [description, setDescription] = useState("");

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

  const submit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    const id = makeTicket();
    const ticket = {
      id,
      status: "Open",
      studentName: user?.name || "Guest Student",
      studentEmail: user?.email || "guest@devforge.dev",
      studentTrack: user?.track || "",
      course,
      module,
      priority,
      snippet,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      mentorReply: "",
    };
    writeTickets([...readTickets(), ticket]);
    onSubmitted({ ticket: id, course, module });
    setSnippet("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-panel shadow-[0_0_60px_rgba(225,29,72,0.2)]"
          data-shift-help="modal"
        >
          <div className="flex items-center justify-between border-b border-line bg-[#0c0c10] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                <LifeBuoy size={18} />
              </span>
              <div>
                <p className="text-base font-bold text-white">Request Instructor Assistance</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Need a hand from a senior engineer?
                </p>
              </div>
            </div>
            <button
              type="button"
              data-shift-help-close
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5 px-5 py-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Course / Module
                </span>
                <select
                  data-shift-help-course
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setModule(HELP_MODULES[e.target.value][1]);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-line bg-[#0b0b0f] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-rose-500/60"
                >
                  {ACTIVE_COURSES.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Current Module
                </span>
                <select
                  data-shift-help-module
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line bg-[#0b0b0f] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-rose-500/60"
                >
                  {(HELP_MODULES[course] || []).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Priority Level
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    data-shift-help-priority={p.key}
                    onClick={() => setPriority(p.key)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                      priority === p.key
                        ? p.key === "blocker"
                          ? "border-red-500/60 bg-red-600/10 text-white shadow-[0_0_14px_rgba(225,29,72,0.3)]"
                          : p.key === "urgent"
                            ? "border-amber-500/60 bg-amber-500/10 text-white shadow-[0_0_14px_rgba(245,158,11,0.2)]"
                            : "border-emerald-500/60 bg-emerald-500/10 text-white shadow-[0_0_14px_rgba(16,185,129,0.2)]"
                        : "border-line text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-sm font-bold">{p.label}</span>
                    <span className="block font-mono text-[10px] text-zinc-500">{p.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Code Snippet
              </span>
              <textarea
                data-shift-help-snippet
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                rows={3}
                placeholder={'{"\n  token_program: ctx.accounts.token_program.toAccountInfo(),\n}'}
                className="mt-1.5 w-full resize-none rounded-lg border border-line bg-[#0b0b0f] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-emerald-300/90 placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Problem Description
              </span>
              <textarea
                data-shift-help-desc
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="What are you trying to do, what error are you seeing, and what have you tried?"
                className="mt-1.5 w-full resize-none rounded-lg border border-line bg-[#0b0b0f] px-3 py-2.5 text-sm leading-relaxed text-white placeholder-zinc-700 outline-none transition-colors focus:border-rose-500/60"
              />
            </label>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                data-shift-help-submit
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(225,29,72,0.4)] transition-all hover:shadow-[0_0_30px_rgba(225,29,72,0.65)] hover:brightness-110"
              >
                <AlertTriangle size={15} />
                Submit Request
              </button>
              <span className="font-mono text-[11px] text-zinc-600">
                Avg. senior mentor response: &lt; 15 mins
              </span>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}