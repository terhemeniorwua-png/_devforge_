"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trophy, GraduationCap } from "lucide-react";
import DocsStore from "@/components/store/DocsStore";
import QuizHub from "@/components/quiz/QuizHub";
import CourseCatalog from "@/components/landing/CourseCatalog";

const TABS = [
  {
    key: "vault",
    label: "Resource Vault",
    hint: "Docs & video library",
    icon: BookOpen,
  },
  {
    key: "learn",
    label: "Learn",
    hint: "Course catalog",
    icon: GraduationCap,
  },
  {
    key: "quiz",
    label: "Quiz Hub",
    hint: "Timed assessments",
    icon: Trophy,
  },
];

export default function StartLearningTabs() {
  const [tab, setTab] = useState("vault");

  return (
    <div className="relative min-h-full">
      <div className="sticky top-16 z-30 border-b border-line/70 bg-obsidian/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {TABS.map((item) => {
            const active = tab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-pressed={active}
                className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "text-obsidian" : "text-zinc-400 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="start-learning-tab-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 shadow-[0_0_20px_rgba(255,255,255,0.45)]"
                  />
                )}
                <Icon size={15} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "vault" && <DocsStore />}
            {tab === "learn" && <CourseCatalog />}
            {tab === "quiz" && <QuizHub />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}