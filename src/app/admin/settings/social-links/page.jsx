"use client";

import { useState } from "react";
import { useContactSettings } from "@/hooks/useContactSettings";
import {
  normalizeWhatsappNumber,
  buildWhatsappLink,
  buildMailtoLink,
} from "@/lib/contactSettings";

const FIELDS = [
  { key: "email", label: "Email", type: "email", placeholder: "info@pcpparty.ng", hint: "Used for mailto links on Contact, Join, Campaign and Footer." },
  { key: "whatsappNumber", label: "WhatsApp Number", type: "tel", placeholder: "09166354571", hint: "Stored in international format (leading 0 replaced with 234)." },
  { key: "facebook", label: "Facebook", type: "url", placeholder: "https://facebook.com/pcpparty", hint: "Leave empty to hide the icon site-wide." },
  { key: "instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/pcpparty" },
  { key: "x", label: "X (Twitter)", type: "url", placeholder: "https://x.com/pcpparty" },
  { key: "youtube", label: "YouTube", type: "url", placeholder: "https://youtube.com/@pcpparty" },
  { key: "tiktok", label: "TikTok", type: "url", placeholder: "https://tiktok.com/@pcpparty" },
  { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/company/pcpparty" },
];

export default function SocialLinksSettingsPage() {
  const { settings, updateSettings } = useContactSettings();
  const [form, setForm] = useState(settings);
  const [prevSettings, setPrevSettings] = useState(settings);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  // Adopt store values that arrive after mount (e.g. saved settings loaded
  // from storage post-hydration) without clobbering the admin's own edits.
  if (prevSettings !== settings && !dirty) {
    setPrevSettings(settings);
    setForm(settings);
  }

  const handleChange = (key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setDirty(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const whatsappPreview = buildWhatsappLink(form.whatsappNumber);
  const emailPreview = buildMailtoLink(form.email);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Social Links</h1>
        <p className="text-gray-600 mt-2">
          Admin &rarr; Settings &rarr; Social Links. Save to update every
          touchpoint across the site instantly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5"
      >
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-gray-800 mb-1.5"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              name={field.key}
              type={field.type}
              value={form[field.key] ?? ""}
              onChange={handleChange(field.key)}
              placeholder={field.placeholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            {field.hint && (
              <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
            )}
            {field.key === "whatsappNumber" && whatsappPreview && (
              <p className="mt-1 text-xs text-gray-500">
                WhatsApp link: <span className="font-mono text-green-700">{whatsappPreview}</span>
              </p>
            )}
            {field.key === "email" && emailPreview && (
              <p className="mt-1 text-xs text-gray-500">
                Email link: <span className="font-mono text-green-700">{emailPreview}</span>
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-700">
              Saved. Changes are live across the site.
            </span>
          )}
        </div>
      </form>

      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Normalization preview
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          Your WhatsApp number is stored as{" "}
          <span className="font-mono font-semibold">
            {normalizeWhatsappNumber(form.whatsappNumber) || "—"}
          </span>
          . Readable link:{" "}
          {whatsappPreview ? (
            <a
              href={whatsappPreview}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              {whatsappPreview}
            </a>
          ) : (
            <span className="text-gray-400">set a number to preview</span>
          )}
        </p>
      </div>
    </div>
  );
}