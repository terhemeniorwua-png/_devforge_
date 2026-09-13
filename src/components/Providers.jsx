"use client";

import { ContactSettingsProvider } from "@/lib/ContactSettingsContext";

export default function Providers({ children }) {
  return <ContactSettingsProvider>{children}</ContactSettingsProvider>;
}
