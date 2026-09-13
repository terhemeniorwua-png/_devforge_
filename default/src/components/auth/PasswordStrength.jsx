"use client";

import { motion } from "framer-motion";
import { scorePassword } from "@/lib/auth";

const LEVELS = [
  { score: 0, label: "Too short", color: "#71717a" },
  { score: 1, label: "Weak", color: "#ffffff" },
  { score: 2, label: "Fair", color: "#fb923c" },
  { score: 3, label: "Good", color: "#a3e635" },
  { score: 4, label: "Strong", color: "#34d399" },
];

const COLORS = {
  empty: "rgba(82,82,91,0.35)",
  ...LEVELS.reduce((acc, level) => {
    acc[level.score] = level.color;
    return acc;
  }, {}),
};

export default function PasswordStrength({ password }) {
  const score = scorePassword(password);
  const level = LEVELS[score];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <motion.span
            key={index}
            className="h-1.5 flex-1 rounded-full"
            animate={{
              backgroundColor: password
                ? index < level.score
                  ? COLORS[level.score]
                  : COLORS.empty
                : COLORS.empty,
            }}
            transition={{ duration: 0.25 }}
          />
        ))}
      </div>
      <p className="mt-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span
          style={{
            color: password ? level.color : "#71717a",
            textShadow: password ? `0 0 12px ${level.color}55` : "none",
          }}
        >
          {password ? level.label : "Password strength"}
        </span>
        <span className="text-zinc-600">{score}/4</span>
      </p>
    </div>
  );
}