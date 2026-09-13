"use client";

import { useContext } from "react";
import { ContactSettingsContext } from "@/lib/ContactSettingsContext";

export function useContactSettings() {
  const ctx = useContext(ContactSettingsContext);
  if (!ctx) {
    throw new Error("useContactSettings must be used within ContactSettingsProvider");
  }
  return ctx;
}
