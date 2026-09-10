"use client";

import { useState } from "react";
import { createUser, getUsers, findUserByEmail, isValidEmail, scorePassword } from "@/lib/auth";
import { NameField, EmailField, PasswordField, SelectField, SubmitButton, Alert } from "./ui";
import PasswordStrength from "./PasswordStrength";

const TRACK_OPTIONS = [
  "Frontend (Web2)",
  "Backend (Web2)",
  "Fullstack (Web2)",
  "Frontend (Web3)",
  "Backend (Web3)",
  "Fullstack (Web3)",
];

export default function SignUpView({ onRegistered, onGoSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tos, setTos] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorBanner("");
    const nextErrors = {};

    if (name.trim().length < 2) nextErrors.name = "Enter your full name";
    if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address";
    if (!track) nextErrors.track = "Select your preferred track";
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else if (scorePassword(password) < 2) {
      nextErrors.password = "Password too weak — add numbers and mixed case";
    }
    if (confirm !== password) nextErrors.confirm = "Passwords do not match";
    if (!tos) nextErrors.tos = "Please accept the Terms of Service";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      const users = getUsers();
      if (findUserByEmail(users, email)) {
        setLoading(false);
        setErrors({});
        setErrorBanner("An account with this email already exists — try signing in instead.");
        return;
      }
      setLoading(false);
      const user = createUser({ name, email, track, password });
      onRegistered(user);
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorBanner && <Alert>{errorBanner}</Alert>}

      <NameField
        label="Full Name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          clearError("name");
        }}
        placeholder="Ada Lovelace"
        error={errors.name}
        autoFocus
      />

      <EmailField
        label="Email Address"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          clearError("email");
        }}
        placeholder="you@devforge.dev"
        error={errors.email}
      />

      <SelectField
        label="Preferred Track"
        value={track}
        onChange={(event) => {
          setTrack(event.target.value);
          clearError("track");
        }}
        options={TRACK_OPTIONS}
        placeholder="Select a specialization"
        error={errors.track}
      />

      <div>
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearError("password");
          }}
          placeholder="Create a strong password"
          error={errors.password}
          autoComplete="new-password"
        />
        {password && <PasswordStrength password={password} />}
      </div>

      <PasswordField
        label="Confirm Password"
        value={confirm}
        onChange={(event) => {
          setConfirm(event.target.value);
          clearError("confirm");
        }}
        placeholder="Repeat your password"
        error={errors.confirm}
        autoComplete="new-password"
      />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-zinc-400">
          <span
            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition-all ${
              tos
                ? "border-rose-500 bg-rose-500/20 shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                : "border-line bg-[#0a0a0f]"
            }`}
          >
            {tos && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={tos}
            onChange={(event) => {
              setTos(event.target.checked);
              clearError("tos");
            }}
            className="sr-only"
          />
          <span>
            I agree to the{" "}
            <span className="font-semibold text-rose-400">Terms of Service</span>{" "}
            and{" "}
            <span className="font-semibold text-rose-400">Privacy Policy</span>.
          </span>
        </label>
        {errors.tos && (
          <p className="mt-2 font-mono text-xs text-rose-400">{errors.tos}</p>
        )}
      </div>

      <SubmitButton loading={loading}>Forge My Account</SubmitButton>

      <p className="text-center text-xs text-zinc-500">
        Already forging?{" "}
        <button
          type="button"
          onClick={onGoSignIn}
          className="font-semibold text-rose-400 underline decoration-rose-500/40 underline-offset-4 hover:text-rose-300"
        >
          Sign in instead
        </button>
      </p>
    </form>
  );
}