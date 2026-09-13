import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
      <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
      <p className="text-zinc-400 mb-8">Admin &rarr; Settings</p>
      <div className="bg-panel rounded-lg border border-line overflow-hidden">
        <Link
          href="/admin/settings/social-links"
          className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-b border-line"
        >
          <div>
            <h2 className="font-semibold text-zinc-200">Social Links</h2>
            <p className="text-sm text-zinc-400">
              Edit email, WhatsApp and social media links for the whole site.
            </p>
          </div>
          <span className="text-green-700">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}