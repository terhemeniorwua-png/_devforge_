"use client";

const STORAGE_KEY = "pcp_contact_settings";

const DEFAULT_SETTINGS = {
  email: "",
  whatsappNumber: "",
  facebook: "",
  instagram: "",
  x: "",
  youtube: "",
  tiktok: "",
  linkedin: "",
};

const SOCIAL_URL_KEYS = [
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
  "linkedin",
];

export function getDefaultSettings() {
  return { ...DEFAULT_SETTINGS };
}

export function normalizeSocialUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function normalizeStoredSettings(settings) {
  const merged = { ...DEFAULT_SETTINGS, ...settings };
  for (const key of SOCIAL_URL_KEYS) {
    merged[key] = normalizeSocialUrl(merged[key]);
  }
  return merged;
}

export function getContactSettings() {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return normalizeStoredSettings(parsed);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveContactSettings(settings) {
  if (typeof window === "undefined") return;
  const merged = normalizeStoredSettings(settings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function normalizeWhatsappNumber(number) {
  if (!number) return "";
  const digits = number.replace(/\D/g, "");
  let normalized = digits;
  if (digits.startsWith("0") && digits.length >= 10) {
    normalized = "234" + digits.slice(1);
  } else if (digits.startsWith("234")) {
    normalized = digits;
  }
  // wa.me requires a full international-format number. Anything shorter is
  // a typo — treat it as unset so a broken link is never rendered.
  if (normalized.length < 10) return "";
  return normalized;
}

export function buildWhatsappLink(number) {
  const normalized = normalizeWhatsappNumber(number);
  if (!normalized) return "";
  return `https://wa.me/${normalized}`;
}

export function buildMailtoLink(email) {
  if (!email) return "";
  return `mailto:${email}`;
}
