"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogOut, Play } from "lucide-react";
import {
  getUsers,
  findUserByEmail,
  setSession,
} from "@/lib/auth";
import { EmailField, PasswordField, SubmitButton, Alert, SocialButtons } from "./ui";

export default function SignInView({
  initialEmail = "",
  session,
  dashboardHref = "/dashboard",
  onLogIn,
  onSocialLogIn,
  onGoForgot,
  onSignOut,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    const initials = session.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-4 text-center"
      >
        <div className="relative">
          <div className="pointer-events-none absolute -inset-2 rounded-full radial-crimson blur-xl" />
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-rose-500/40 bg-gradient-to-br from-red-500/20 via-rose-600/15 to-red-900/20 font-mono text-2xl font-extrabold text-rose-300 shadow-[0_0_30px_rgba(225,29,72,0.35)]">
            {initials}
          </div>
        </div>
        <p className="mt-5 font-mono text-xs uppercase tracking-widest text-rose-400">
          session active
        </p>
        <h3 className="mt-1 text-xl font-bold text-white">{session.name}</h3>
        <p className="mt-1 font-mono text-sm text-zinc-500">{session.email}</p>
        <span className="mt-3 rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-zinc-400">
          {session.track}
        </span>
        <div className="mt-7 grid w-full grid-cols-2 gap-3">
          <Link
            href={dashboardHref}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(225,29,72,0.4)] transition-all hover:shadow-[0_0_34px_rgba(225,29,72,0.7)]"
          >
            <Play size={15} />
            Continue Learning
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-rose-500/40 hover:text-white"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </motion.div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorBanner("");
    const nextErrors = {};

    if (!email.trim()) nextErrors.email = "Email is required";
    if (!password) nextErrors.password = "Password is required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      const users = getUsers();
      const user = findUserByEmail(users, email);
      if (!user || user.password !== password) {
        setLoading(false);
        setErrors({});
        setPassword("");
        setErrorBanner("Invalid email or password. Check your credentials and try again.");
        return;
      }
      setLoading(false);
      onLogIn(user, remember);
    }, 650);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorBanner && <Alert>{errorBanner}</Alert>}

      <EmailField
        label="Email Address"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
        placeholder="you@devforge.dev"
        error={errors.email}
        autoFocus
      />

      <div>
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          placeholder="Enter your password"
          error={errors.password}
          autoComplete="current-password"
        />
        <div className="mt-2 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
            <span
              className={`grid h-4 w-4 place-items-center rounded border transition-all ${
                remember
                  ? "border-rose-500 bg-rose-500/20 shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                  : "border-line bg-[#0a0a0f]"
              }`}
            >
              {remember && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="sr-only"
            />
            Remember me for 30 days
          </label>
          <button
            type="button"
            onClick={onGoForgot}
            className="font-mono text-xs font-semibold text-rose-400 underline decoration-rose-500/40 underline-offset-4 transition-colors hover:text-rose-300"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <SubmitButton loading={loading}>Sign In securely</SubmitButton>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          or continue with
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <SocialButtons
        onGitHub={() => onSocialLogIn("github")}
        onGoogle={() => onSocialLogIn("google")}
      />

      <p className="rounded-xl border border-line bg-[#0a0a0f] px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-zinc-500">
        <span className="text-rose-400">$</span> demo account —{" "}
        <span className="text-zinc-300">demo@devforge.dev</span> ·{" "}
        <span className="text-zinc-300">forge1234</span>
      </p>
    </form>
  );
}