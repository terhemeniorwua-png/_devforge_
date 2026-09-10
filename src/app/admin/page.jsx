import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin</h1>
      <p className="text-gray-600 mb-8">Manage the party website.</p>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Link
          href="/admin/settings"
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div>
            <h2 className="font-semibold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-600">
              Configure site-wide contact and social links.
            </p>
          </div>
          <span className="text-green-700">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}