import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
      <h1 className="text-3xl font-bold text-white mb-2">Admin</h1>
      <p className="text-zinc-400 mb-8">Manage the party website.</p>
      <div className="bg-panel rounded-lg border border-line overflow-hidden">
        <Link
          href="/admin/settings"
          className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
        >
          <div>
            <h2 className="font-semibold text-zinc-200">Settings</h2>
            <p className="text-sm text-zinc-400">
              Configure site-wide contact and social links.
            </p>
          </div>
          <span className="text-green-700">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}