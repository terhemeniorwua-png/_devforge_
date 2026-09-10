"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Check, X, Info, GraduationCap, Presentation } from "lucide-react";
import {
  getSession,
  setSession,
  clearSession,
  socialAccount,
  formatOtp,
} from "@/lib/auth";
import SignInView from "./SignInView";
import ForgotPasswordView from "./ForgotPasswordView";

const TABS = [
  { key: "signin", label: "Sign In" },
  { key: "forgot", label: "Forgot Password" },
];

const ROLES = [
  { key: "student", label: "Student", icon: GraduationCap, hint: "Student dashboard" },
  { key: "instructor", label: "Instructor", icon: Presentation, hint: "Instructor dashboard" },
];

const HEADLINES = {
  signin: "Welcome back. Forge on.",
  forgot: "Reset your DevForge password.",
};

const viewMotion = {
  initial: { opacity: 0, y: 26, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, filter: "blur(6px)" },
};

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-24">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-[0_0_35px_rgba(225,29,72,0.25)] backdrop-blur-xl ${
              toast.variant === "security"
                ? "border-rose-500/60 bg-[#0b0b0f]/95 shadow-[0_0_40px_rgba(225,29,72,0.4)]"
                : toast.variant === "success"
                  ? "border-emerald-500/40 bg-[#0b0b0f]/95"
                  : toast.variant === "error"
                    ? "border-rose-600/50 bg-[#0b0b0f]/95"
                    : "border-line bg-[#0b0b0f]/95"
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/70 to-transparent" />
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  toast.variant === "security"
                    ? "bg-gradient-to-br from-red-500 to-red-900 text-white shadow-[0_0_16px_rgba(225,29,72,0.5)]"
                    : toast.variant === "success"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : toast.variant === "error"
                        ? "bg-rose-500/15 text-rose-400"
                        : "bg-white/5 text-zinc-300"
                }`}
              >
                {toast.variant === "security" ? (
                  <Shield size={16} />
                ) : toast.variant === "success" ? (
                  <Check size={16} />
                ) : toast.variant === "error" ? (
                  <X size={16} />
                ) : (
                  <Info size={16} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {toast.title}
                </p>
                {toast.variant === "security" && toast.code ? (
                  <p className="mt-1.5 font-mono text-2xl font-bold tracking-[0.25em] text-rose-400 text-glow-red">
                    {formatOtp(toast.code)}
                  </p>
                ) : null}
                {toast.message ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                    {toast.message}
                  </p>
                ) : null}
                {toast.variant === "security" ? (
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    simulated system notification
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AuthClient() {
  const [tab, setTab] = useState("signin");
  const [role, setRole] = useState("student");
  const [session, setSessionState] = useState(null);
  const [signinEmail, setSigninEmail] = useState("");
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const router = useRouter();

  const dashboardFor = (activeRole) =>
    activeRole === "instructor" ? "/instructor/dashboard" : "/dashboard";

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSessionState(getSession());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const pushToast = ({ variant = "info", title, message, code, duration }) => {
    toastId.current += 1;
    const toast = { id: toastId.current, variant, title, message, code };
    setToasts((prev) => [...prev, toast]);
    const timeout = duration ?? (variant === "security" ? 14000 : 5000);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((entry) => entry.id !== toast.id));
    }, timeout);
  };

  const dismissToast = (id) =>
    setToasts((prev) => prev.filter((entry) => entry.id !== id));

  const handleLogIn = (user, remember) => {
    const active = setSession(user, remember);
    setSessionState(active);
    pushToast({
      variant: "success",
      title: "Authentication successful",
      message: `Welcome back, ${user.name}. Session saved ${remember ? "for 30 days" : "for this browser"} via localStorage.`,
    });
    window.setTimeout(() => {
      router.push(dashboardFor(role));
    }, 900);
  };

  const handleSocialLogIn = (provider) => {
    const user = socialAccount(provider);
    const active = setSession(user, true);
    setSessionState(active);
    pushToast({
      variant: "success",
      title: `Signed in with ${provider === "github" ? "GitHub" : "Google"}`,
      message: `${user.name} — simulated OAuth handshake completed.`,
    });
    window.setTimeout(() => {
      router.push(dashboardFor(role));
    }, 900);
  };

  const handleSignOut = () => {
    clearSession();
    setSessionState(null);
    pushToast({
      variant: "info",
      title: "Signed out",
      message: "Your session was cleared from localStorage.",
    });
  };

  const handleForgotComplete = (email) => {
    if (email) setSigninEmail(email);
    setTab("signin");
  };

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 grid-lines" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full radial-crimson blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full radial-crimson blur-3xl" />

      <div className="pointer-events-none absolute left-8 top-24 hidden xl:block">
        <div className="animate-float rounded-xl border border-line bg-panel/80 px-4 py-3 font-mono text-xs text-zinc-400 shadow-[0_0_24px_rgba(0,0,0,0.5)] backdrop-blur">
          <span className="text-rose-400">&gt;</span> cat devforge.session
          <p className="mt-0.5 text-emerald-400">✓ stored in localStorage</p>
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-24 right-8 hidden xl:block"
        style={{ animationDelay: "1.6s" }}
      >
        <div className="animate-float rounded-xl border border-line bg-panel/80 p-4 font-mono text-xs text-zinc-400 shadow-[0_0_24px_rgba(0,0,0,0.5)] backdrop-blur">
          <p className="text-rose-400">[otp-relay]</p>
          <p className="mt-1">relay: online · tls 1.3</p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-glow" />
            awaiting code…
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="group mb-5 inline-flex items-center gap-2 font-mono text-sm text-zinc-400 transition-colors hover:text-rose-400"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel/70 transition-all group-hover:border-rose-500/40 group-hover:shadow-[0_0_16px_rgba(225,29,72,0.3)]">
            <ArrowLeft size={15} />
          </span>
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-line bg-panel/80 shadow-[0_0_50px_rgba(225,29,72,0.16)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/70 to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full radial-crimson blur-2xl" />

          <div className="relative px-6 pb-9 pt-8 sm:px-9">
            <div className="flex flex-col items-center text-center">
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_26px_rgba(225,29,72,0.55)]">
                <span className="font-mono text-2xl font-extrabold text-white">D</span>
                <span className="absolute -inset-1 -z-10 rounded-xl bg-rose-500/30 blur-md" />
              </span>
              <h1 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white">
                Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700">Forge</span>
              </h1>
              <p className="mt-1.5 text-sm text-zinc-400">{HEADLINES[tab]}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-black/40 p-1.5">
              {ROLES.map((item) => {
                const active = role === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setRole(item.key)}
                    aria-pressed={active}
                    className={`relative rounded-xl px-3 py-3 transition-colors ${
                      active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-role-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 shadow-[0_0_20px_rgba(225,29,72,0.45)]"
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-semibold">
                      <Icon size={15} className="shrink-0" />
                      {item.label}
                    </span>
                    <span
                      className={`relative z-10 mt-0.5 block font-mono text-[10px] uppercase tracking-widest ${
                        active ? "text-rose-100/80" : "text-zinc-600"
                      }`}
                    >
                      {item.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-black/40 p-1.5">
              {TABS.map((item) => {
                const active = tab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`relative rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-colors sm:text-xs ${
                      active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-tab-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 shadow-[0_0_20px_rgba(225,29,72,0.45)]"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  variants={viewMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {tab === "signin" && (
                    <SignInView
                      initialEmail={signinEmail}
                      session={session}
                      dashboardHref={dashboardFor(role)}
                      onLogIn={handleLogIn}
                      onSocialLogIn={handleSocialLogIn}
                      onGoForgot={() => setTab("forgot")}
                      onSignOut={handleSignOut}
                    />
                  )}
                  {tab === "forgot" && (
                    <ForgotPasswordView
                      pushToast={pushToast}
                      onComplete={handleForgotComplete}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <p className="mt-5 text-center font-mono text-[11px] text-zinc-600">
          devforge_auth v2.1 · <span className="text-rose-500/80">localStorage</span>{" "}
          simulated · encrypted in memory
        </p>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </section>
  );
}