import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Admin &rarr; Settings</p>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Link
          href="/admin/settings/social-links"
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <div>
            <h2 className="font-semibold text-gray-900">Social Links</h2>
            <p className="text-sm text-gray-600">
              Edit email, WhatsApp and social media links for the whole site.
            </p>
          </div>
          <span className="text-green-700">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}