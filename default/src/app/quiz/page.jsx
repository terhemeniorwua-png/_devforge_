import QuizHub from "@/components/quiz/QuizHub";

export const metadata = {
  title: "Quiz Hub — DevForge Timed Ecosystem Assessments",
  description:
    "Pick your pace — 10s, 20s, 30s, or Unlimited — and prove your skills across Frontend, Backend, and Fullstack, spanning Web2 and Web3. XP, streaks, and instant code feedback.",
};

export default function QuizPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <QuizHub />
    </main>
  );
}