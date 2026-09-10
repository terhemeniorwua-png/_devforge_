"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  Trophy,
  Zap,
  Flame,
  Target,
  Check,
  X,
  RotateCcw,
  ChevronRight,
  Gauge,
  AlertTriangle,
} from "lucide-react";
import {
  QUIZ_MODES,
  TRACK_OPTIONS,
  ECOSYSTEM_OPTIONS,
  QUIZ_TIME,
  QUIZ_QUESTIONS,
} from "@/lib/quizBank";

const QUIZ_SIZE = 8;
const BASE_XP = 100;
const TIME_BONUS_PER_SECOND = 5;
const COMBO_BONUS = 15;
const UNLIMITED_TIME_BONUS = 90;

const TIMER_OPTIONS = [
  { value: 10, label: "Blitz Mode", hint: "10s per question" },
  { value: 20, label: "Standard Mode", hint: "20s per question" },
  { value: 30, label: "Relaxed Mode", hint: "30s per question" },
  { value: null, label: "Unlimited", hint: "No countdown" },
];

const CUSTOM_QUESTIONS_KEY = "devforge_custom_questions";

function loadCustomQuestions() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function poolFor(custom) {
  return [...(Array.isArray(custom) ? custom : []), ...QUIZ_QUESTIONS];
}

function buildQuiz(pool, mode, selection) {
  const filtered = pool.filter((q) =>
    mode === "track" ? q.track === selection : q.ecosystem === selection
  );
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUIZ_SIZE);
}

function countFor(pool, mode, selection) {
  return pool.filter((q) =>
    mode === "track" ? q.track === selection : q.ecosystem === selection
  ).length;
}

function CodeBlock({ code }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-[#0b0b0f] p-4 font-mono text-[13px] leading-relaxed text-zinc-300 shadow-[inset_0_0_20px_rgba(225,29,72,0.05)]">
      <span className="mr-2 select-none text-rose-500">&gt;</span>
      {code}
    </pre>
  );
}

function StatCard({ icon, label, value, accent = "text-zinc-100" }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-panel/80 px-4 py-3 backdrop-blur">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/25">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {label}
        </p>
        <p className={`truncate font-mono text-lg font-bold ${accent}`}>{value}</p>
      </div>
    </div>
  );
}

function TimerBar({ secondsLeft, duration }) {
  const unlimited = !duration;
  const max = duration || QUIZ_TIME;
  const pct = ((secondsLeft || 0) / max) * 100;
  const danger = !unlimited && secondsLeft <= 5;
  return (
    <div className="rounded-xl border border-line bg-panel/80 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          <Timer size={13} className={danger ? "animate-pulse text-rose-500" : "text-rose-400"} />
          Time remaining
        </span>
        <span
          data-shift-timer-display={`${secondsLeft}s`}
          className={`font-mono text-xl font-extrabold ${
            danger ? "animate-pulse text-rose-500" : "text-white"
          }`}
        >
          {secondsLeft}s
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            danger
              ? "bg-gradient-to-r from-red-600 to-rose-500"
              : "bg-gradient-to-r from-emerald-500 via-rose-500 to-red-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function UnlimitedBar() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3">
      <div className="text-center">
        <span
          data-shift-timer-display="∞"
          className="font-mono text-3xl font-extrabold text-emerald-400"
        >
          ∞
        </span>
        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80">
          Unlimited · no countdown
        </p>
      </div>
    </div>
  );
}

function OptionButton({ option, state, onClick, disabled, optionIndex }) {
  const base =
    "relative w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 backdrop-blur";
  let classes = base + " border-line bg-white/[0.03] text-zinc-200 hover:border-rose-500/50 hover:bg-rose-500/10";
  let marker = null;

  if (state === "correct") {
    classes =
      base +
      " border-emerald-500/70 bg-emerald-500/10 text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,0.25)]";
    marker = (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-[#050507]">
        <Check size={12} strokeWidth={3} />
      </span>
    );
  } else if (state === "wrong") {
    classes =
      base +
      " border-red-600/70 bg-red-600/10 text-red-200 shadow-[0_0_22px_rgba(220,38,38,0.25)]";
    marker = (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-600 text-white">
        <X size={12} strokeWidth={3} />
      </span>
    );
  } else if (state === "dim") {
    classes = base + " border-line bg-white/[0.02] text-zinc-500";
  }

  return (
    <button
      type="button"
      data-shift-option={optionIndex}
      disabled={disabled}
      onClick={onClick}
      className={`${classes} ${
        state === "idle" && disabled ? "cursor-wait opacity-70" : ""
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{option}</span>
        {marker}
      </span>
    </button>
  );
}

export default function QuizHub() {
  const [view, setView] = useState("select");
  const [mode, setMode] = useState("track");
  const [selection, setSelection] = useState("Frontend");
  const [timerDuration, setTimerDuration] = useState(20);
  const [questions, setQuestions] = useState([]);
  const [pool, setPool] = useState(QUIZ_QUESTIONS);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPool(poolFor(loadCustomQuestions()));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_TIME);

  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeouts, setTimeouts] = useState(0);
  const [results, setResults] = useState([]);

  const secondsRef = useRef(QUIZ_TIME);
  const answeredRef = useRef(false);
  const indexRef = useRef(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (view !== "play" || !timerDuration) return undefined;

    const tick = setInterval(() => {
      const next = secondsRef.current - 1;
      secondsRef.current = next;
      setSecondsLeft(next);
      if (next <= 0 && !answeredRef.current) {
        answeredRef.current = true;
        tickRef.current = null;
        clearInterval(tick);
        setAnswered(true);
        setSelected(null);
        setOutcome("timeout");
        setStreak(0);
        setTimeouts((t) => t + 1);
        setResults((r) => {
          const copy = [...r];
          copy[indexRef.current] = { ok: false, timedOut: true };
          return copy;
        });
      }
    }, 1000);
    tickRef.current = tick;

    return () => clearInterval(tick);
  }, [view, index, questions, timerDuration]);

  const xpGainFor = (nextStreak) =>
    BASE_XP +
    (nextStreak - 1) * COMBO_BONUS +
    (timerDuration ? secondsLeft * TIME_BONUS_PER_SECOND : UNLIMITED_TIME_BONUS);

  const startAssessment = () => {
    const quiz = buildQuiz(pool, mode, selection);
    setQuestions(quiz);
    setIndex(0);
    indexRef.current = 0;
    secondsRef.current = timerDuration || 0;
    answeredRef.current = false;
    setScore(0);
    setXp(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeouts(0);
    setResults(Array(quiz.length).fill(null));
    setSelected(null);
    setAnswered(false);
    setOutcome(null);
    setSecondsLeft(timerDuration || 0);
    setView("play");
  };

  const chooseOption = (optionIndex) => {
    if (answered) return;
    answeredRef.current = true;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setAnswered(true);
    setSelected(optionIndex);
    const question = questions[index];
    const isCorrect = optionIndex === question.answer;
    setOutcome(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      const nextStreak = streak + 1;
      setScore((s) => s + 1);
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      const gained = xpGainFor(nextStreak);
      setXp((x) => x + gained);
      setResults((r) => {
        const next = [...r];
        next[index] = { ok: true, timedOut: false };
        return next;
      });
    } else {
      setStreak(0);
      setResults((r) => {
        const next = [...r];
        next[index] = { ok: false, timedOut: false };
        return next;
      });
    }
  };

  const nextQuestion = () => {
    const next = index + 1;
    if (next >= questions.length) {
      setView("results");
      return;
    }
    answeredRef.current = false;
    secondsRef.current = timerDuration || 0;
    indexRef.current = next;
    setIndex(next);
    setSelected(null);
    setAnswered(false);
    setOutcome(null);
    setSecondsLeft(timerDuration || 0);
  };

  const retake = () => {
    setView("select");
    setMode("track");
    setSelection("Frontend");
    setQuestions([]);
    setIndex(0);
    indexRef.current = 0;
    secondsRef.current = timerDuration || 0;
    answeredRef.current = false;
    setScore(0);
    setXp(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeouts(0);
    setResults([]);
    setSelected(null);
    setAnswered(false);
    setOutcome(null);
    setSecondsLeft(timerDuration || 0);
  };

  const current = questions[index];
  const accuracy = useMemo(() => {
    if (index === 0) return 0;
    return Math.round((score / index) * 100);
  }, [score, index]);

  const optionStateFor = (optionIndex) => {
    if (answered && selected !== null) {
      if (current && optionIndex === current.answer) return "correct";
      if (optionIndex === selected) return "wrong";
      return "dim";
    }
    if (answered && selected === null && current && optionIndex === current.answer) {
      return "correct";
    }
    return "idle";
  };

  const feedbackMeta = {
    correct: {
      title: "Correct",
      color: "text-emerald-400",
      ring: "border-emerald-500/40",
      gain: streak > 0 ? ` +${xpGainFor(streak)} XP` : "",
    },
    wrong: {
      title: "Incorrect",
      color: "text-red-400",
      ring: "border-red-600/40",
      gain: "",
    },
    timeout: {
      title: "Time's up",
      color: "text-amber-400",
      ring: "border-amber-500/40",
      gain: "",
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-40 h-[460px] w-[460px] rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-24 h-[400px] w-[400px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-rose-400 shadow-[0_0_18px_rgba(225,29,72,0.15)]">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
            Ecosystem Quiz Hub
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Prove it with a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700">
              timed assessment
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {QUIZ_SIZE} questions. Pick your pace — 10s, 20s, 30s, or Unlimited —
            then every answer unlocks instant code feedback, XP, and streak
            combos across your track or ecosystem.
          </p>
        </div>

        <div className="mt-12">
          <AnimatePresence mode="wait">
            {view === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-3xl rounded-3xl border border-line bg-panel/80 p-6 shadow-[0_0_50px_rgba(225,29,72,0.14)] backdrop-blur-2xl sm:p-10"
              >
                <div className="flex flex-col items-center text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_28px_rgba(225,29,72,0.55)]">
                    <Target size={26} className="text-white" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-white">
                    Choose your assessment
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Filter the question bank by track or by ecosystem, then hit start.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {QUIZ_MODES.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      data-shift-mode={m.key}
                      onClick={() => setMode(m.key)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                        mode === m.key
                          ? "border-rose-500/60 bg-rose-500/10 text-white shadow-[0_0_18px_rgba(225,29,72,0.25)]"
                          : "border-line text-zinc-400 hover:bg-white/5"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Time per question
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {TIMER_OPTIONS.map((opt) => {
                    const active = timerDuration === opt.value;
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        data-shift-timer={String(opt.value)}
                        onClick={() => setTimerDuration(opt.value)}
                        className={`rounded-xl border px-4 py-3 text-left transition-all ${
                          active
                            ? "border-rose-500/60 bg-rose-500/10 shadow-[0_0_18px_rgba(225,29,72,0.25)]"
                            : "border-line bg-white/[0.03] hover:border-rose-500/40"
                        }`}
                      >
                        <span
                          className={`block text-sm font-bold ${
                            active ? "text-white" : "text-zinc-200"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="block font-mono text-[11px] text-zinc-500">
                          {opt.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2.5">
                  {(mode === "track" ? TRACK_OPTIONS : ECOSYSTEM_OPTIONS).map((opt) => {
                    const active = selection === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        data-shift-quiz={opt.key}
                        onClick={() => setSelection(opt.key)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                          active
                            ? "border-rose-500/60 bg-rose-500/10 shadow-[0_0_18px_rgba(225,29,72,0.2)]"
                            : "border-line bg-white/[0.03] hover:border-rose-500/40"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-bold text-white">{opt.label}</span>
                          <span className="block font-mono text-xs text-zinc-500">{opt.hint}</span>
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="rounded-full border border-line bg-white/5 px-2.5 py-1 font-mono text-xs text-zinc-300">
                            {countFor(pool, mode, opt.key)} questions
                          </span>
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                              active ? "border-rose-500 bg-rose-500 text-white" : "border-line"
                            }`}
                          >
                            {active && <Check size={12} strokeWidth={3} />}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  data-shift-timer-value={String(timerDuration)}
                  onClick={startAssessment}
                  className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-6 py-4 text-base font-bold text-white shadow-[0_0_26px_rgba(225,29,72,0.45)] transition-all hover:shadow-[0_0_40px_rgba(225,29,72,0.7)] hover:brightness-110"
                >
                  <Zap size={18} className="transition-transform group-hover:scale-125" />
                  Start Assessment
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {view === "play" && current && (
              <motion.div
                key={`q-${index}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-3xl"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <StatCard icon={<Trophy size={16} />} label="Score" value={`${score}/${questions.length}`} accent="text-emerald-400" />
                  <StatCard icon={<Zap size={16} />} label="XP" value={xp.toLocaleString()} accent="text-amber-400" />
                  <StatCard icon={<Flame size={16} />} label="Streak" value={`x${streak}`} accent="text-rose-400" />
                  <StatCard icon={<Gauge size={16} />} label="Max combo" value={`x${maxStreak}`} accent="text-zinc-100" />
                  <div className="hidden sm:block">
                    {timerDuration ? (
                      <TimerBar secondsLeft={secondsLeft} duration={timerDuration} />
                    ) : (
                      <UnlimitedBar />
                    )}
                  </div>
                </div>
                <div className="mt-3 sm:hidden">
                  {timerDuration ? (
                    <TimerBar secondsLeft={secondsLeft} duration={timerDuration} />
                  ) : (
                    <UnlimitedBar />
                  )}
                </div>

                <div className="mt-6 rounded-3xl border border-line bg-panel/80 p-6 shadow-[0_0_50px_rgba(225,29,72,0.12)] backdrop-blur-2xl sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/25">
                      Question {index + 1} / {questions.length}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400 ring-1 ring-line">
                      {current.track} · {current.ecosystem}
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-600 to-red-800 transition-all duration-500"
                      style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-bold leading-snug text-white sm:text-2xl">
                    {current.prompt}
                  </h2>

                  <div className="mt-4">
                    <CodeBlock code={current.code} />
                  </div>

                  <div className="mt-6 space-y-3">
                    {current.options.map((option, optionIndex) => (
                      <OptionButton
                        key={option}
                        option={option}
                        optionIndex={optionIndex}
                        state={optionStateFor(optionIndex)}
                        disabled={answered}
                        onClick={() => chooseOption(optionIndex)}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className={`mt-5 rounded-xl border ${feedbackMeta[outcome].ring} bg-white/[0.03] p-4`}
                      >
                        <p
                          className={`flex flex-wrap items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest ${feedbackMeta[outcome].color}`}
                        >
                          {outcome === "correct" ? (
                            <Check size={16} strokeWidth={3} />
                          ) : outcome === "wrong" ? (
                            <X size={16} strokeWidth={3} />
                          ) : (
                            <AlertTriangle size={16} />
                          )}
                          {feedbackMeta[outcome].title}
                          {outcome === "correct" && (
                            <span className="text-amber-400">
                              +{xpGainFor(streak)} XP
                            </span>
                          )}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                          {current.explanation}
                        </p>
                        {outcome === "timeout" && (
                          <p className="mt-2 text-xs text-amber-400/80">
                            The clock hit zero — the correct answer glows green above.
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={nextQuestion}
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(225,29,72,0.4)] transition-all hover:shadow-[0_0_30px_rgba(225,29,72,0.6)]"
                        >
                          {index + 1 >= questions.length ? "View Results" : "Next Question"}
                          <ChevronRight size={15} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {view === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32 }}
                className="mx-auto max-w-3xl rounded-3xl border border-line bg-panel/80 p-6 shadow-[0_0_50px_rgba(225,29,72,0.14)] backdrop-blur-2xl sm:p-10"
              >
                <div className="flex flex-col items-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_34px_rgba(225,29,72,0.6)]">
                    <Trophy size={28} className="text-white" />
                  </span>
                  <h2 className="mt-5 text-3xl font-bold text-white">
                    Assessment complete
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    {selection} · {mode === "track" ? "by track" : "by ecosystem"}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard icon={<Trophy size={16} />} label="Final score" value={`${score}/${questions.length}`} accent="text-emerald-400" />
                  <StatCard icon={<Zap size={16} />} label="XP earned" value={`+${xp.toLocaleString()}`} accent="text-amber-400" />
                  <StatCard icon={<Gauge size={16} />} label="Accuracy" value={`${accuracy}%`} accent="text-white" />
                  <StatCard icon={<Flame size={16} />} label="Best streak" value={`x${maxStreak}`} accent="text-rose-400" />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
                    <p className="font-mono text-2xl font-bold text-emerald-400">{score}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Correct</p>
                  </div>
                  <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4 text-center">
                    <p className="font-mono text-2xl font-bold text-red-400">
                      {questions.length - score - timeouts}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Missed</p>
                  </div>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
                    <p className="font-mono text-2xl font-bold text-amber-400">{timeouts}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Timed out</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Question trace
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {results.map((r, i) => (
                      <span
                        key={i}
                        data-shift-trace={i}
                        className={`grid h-9 w-9 place-items-center rounded-lg border font-mono text-xs font-bold ${
                          r && r.ok
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : r && r.timedOut
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                              : "border-red-600/40 bg-red-600/10 text-red-400"
                        }`}
                      >
                        {r && r.ok ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={retake}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-zinc-200 transition-all hover:border-rose-500/50 hover:text-white"
                  >
                    <RotateCcw size={16} className="text-rose-400" />
                    Re-take Assessment
                  </button>
                  <button
                    type="button"
                    onClick={retake}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_22px_rgba(225,29,72,0.4)] transition-all hover:shadow-[0_0_36px_rgba(225,29,72,0.6)]"
                  >
                    <RotateCcw size={16} />
                    Reconfigure &amp; Run New Mix
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}