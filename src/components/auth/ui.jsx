"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";

export function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  right,
  inputMode,
  autoComplete,
  maxLength,
  autoFocus,
  name,
  optional,
}) {
  const Icon = icon;
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-400">
        <span>{label}</span>
        {optional && <span className="font-mono text-[10px] text-zinc-600">optional</span>}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon
            className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
              error ? "text-rose-500" : "text-zinc-500"
            }`}
          />
        )}
        <input
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border bg-[#0a0a0f] py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 ${
            icon ? "pl-10" : "pl-4"
          } ${right ? "pr-12" : "pr-4"} ${
            error
              ? "border-rose-600/70 shadow-[0_0_0_3px_rgba(225,29,72,0.14),0_0_18px_rgba(225,29,72,0.25)] focus:border-rose-500"
              : "border-line focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.12)]"
          }`}
        />
        {right && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">{right}</span>
        )}
      </span>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1.5 font-mono text-xs text-rose-400"
        >
          <AlertTriangle size={13} className="shrink-0" />
          {error}
        </motion.span>
      )}
    </label>
  );
}

export function PasswordField(props) {
  const [show, setShow] = useState(false);
  const { error } = props;
  return (
    <FormField
      {...props}
      type={show ? "text" : "password"}
      icon={Lock}
      right={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
            error ? "text-rose-500" : "text-zinc-500"
          } hover:text-white`}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

export function EmailField(props) {
  return (
    <FormField {...props} type="email" icon={Mail} autoComplete="email" />
  );
}

export function NameField(props) {
  return <FormField {...props} type="text" icon={UserIcon} autoComplete="name" />;
}

export function SelectField({ label, value, onChange, options, placeholder, error }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-[10px] text-rose-500/80">dual ecosystem</span>
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          className={`w-full cursor-pointer appearance-none rounded-xl border bg-[#0a0a0f] py-3 pl-4 pr-10 text-sm outline-none transition-all duration-200 ${
            value
              ? "text-white"
              : "text-zinc-600"
          } ${
            error
              ? "border-rose-600/70 shadow-[0_0_0_3px_rgba(225,29,72,0.14),0_0_18px_rgba(225,29,72,0.25)]"
              : "border-line focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.12)]"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-panel text-white">
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </span>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1.5 font-mono text-xs text-rose-400"
        >
          <AlertTriangle size={13} className="shrink-0" />
          {error}
        </motion.span>
      )}
    </label>
  );
}

export function SubmitButton({ children, loading, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(225,29,72,0.4)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(225,29,72,0.7)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : null}
      {children}
    </button>
  );
}

export function Alert({ variant = "error", children }) {
  const isError = variant === "error";
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium ${
        isError
          ? "border-rose-600/50 bg-rose-500/[0.08] text-rose-300 shadow-[0_0_22px_rgba(225,29,72,0.2)]"
          : "border-emerald-500/40 bg-emerald-500/[0.07] text-emerald-300"
      }`}
    >
      {isError ? (
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
      ) : (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
      )}
      <span>{children}</span>
    </motion.div>
  );
}

export function SocialButtons({ onGitHub, onGoogle }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onGitHub}
        className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/[0.06] hover:text-white hover:shadow-[0_0_18px_rgba(225,29,72,0.25)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-200">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.15 0 .31.21.68.8.56A10.62 10.62 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        GitHub
      </button>
      <button
        type="button"
        onClick={onGoogle}
        className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/[0.06] hover:text-white hover:shadow-[0_0_18px_rgba(225,29,72,0.25)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        Google
      </button>
    </div>
  );
}

export function OrDivider({ label = "or continue with email" }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}