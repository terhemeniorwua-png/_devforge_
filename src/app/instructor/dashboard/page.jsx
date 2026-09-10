import InstructorDashboard from "@/components/instructor/InstructorDashboard";

export const metadata = {
  title: "Instructor Dashboard — DevForge",
  description:
    "Manage mentored students, resolve 1-on-1 assistance tickets, inspect code submissions, and track quiz analytics from the DevForge instructor console.",
};

export default function InstructorDashboardPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <InstructorDashboard />
    </main>
  );
}