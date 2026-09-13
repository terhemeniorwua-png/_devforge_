import StartLearningTabs from "@/components/start-learning/StartLearningTabs";

export const metadata = {
  title: "Start Learning — DevForge",
  description:
    "Pick your path — browse the Resource Vault, test yourself in the Quiz Hub, or dive into the course catalog and start learning with DevForge.",
};

export default function StartLearningPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <StartLearningTabs />
    </main>
  );
}