"use client";

import { createContext, useCallback, useSyncExternalStore } from "react";
import {
  getContactSettings,
  getDefaultSettings,
  saveContactSettings as persistSettings,
} from "./contactSettings";

export const ContactSettingsContext = createContext(null);

const listeners = new Set();
let cached = null;
const serverSnapshot = getDefaultSettings();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (cached === null) {
    cached = getContactSettings();
  }
  return cached;
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function ContactSettingsProvider({ children }) {
  const settings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => serverSnapshot
  );

  const updateSettings = useCallback((newSettings) => {
    const merged = { ...getSnapshot(), ...newSettings };
    persistSettings(merged);
    cached = merged;
    emit();
  }, []);

  return (
    <ContactSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ContactSettingsContext.Provider>
  );
}
