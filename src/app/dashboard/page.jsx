import Dashboard from "@/components/dashboard/Dashboard";

export const metadata = {
  title: "Student Dashboard — DevForge",
  description:
    "Track your active courses, request senior engineer assistance, and chat with the ForgeAI coding tutor — all from your DevForge student dashboard.",
};

export default function DashboardPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <Dashboard />
    </main>
  );
}