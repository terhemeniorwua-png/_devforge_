"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, RefreshCw, Fingerprint } from "lucide-react";
import {
  getUsers,
  findUserByEmail,
  generateOtp,
  storeResetCode,
  getResetCode,
  clearResetCode,
  updatePassword,
  scorePassword,
} from "@/lib/auth";
import { EmailField, PasswordField, SubmitButton, Alert } from "./ui";
import PasswordStrength from "./PasswordStrength";
import OtpInput from "./OtpInput";

const stepVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -36 : 36 }),
};

export default function ForgotPasswordView({ pushToast, onComplete }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpAttempt, setOtpAttempt] = useState(0);
  const [verifyAttempt, setVerifyAttempt] = useState(0);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const goTo = (next, dir = 1) => {
    setDirection(dir);
    setStep(next);
  };

  const handleRequest = (event) => {
    event.preventDefault();
    setErrorBanner("");
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const users = getUsers();
      const user = findUserByEmail(users, email);
      if (!user) {
        setErrors({});
        setErrorBanner("No DevForge account found for this email.");
        return;
      }
      const code = generateOtp();
      storeResetCode(user.email, code);
      setResetEmail(user.email);
      setErrors({});
      pushToast({
        variant: "security",
        title: "DevForge Security Code",
        code,
        message: `Simulated notification for ${user.email} — this code resets your password.`,
      });
      goTo(2, 1);
    }, 700);
  };

  const handleVerify = (enteredCode) => {
    const stored = getResetCode(resetEmail);
    if (!stored) {
      setVerifyAttempt((count) => count + 1);
      setOtpError("This code has expired. Request a new one.");
      return;
    }
    if (enteredCode !== stored) {
      setVerifyAttempt((count) => count + 1);
      setOtpError("Incorrect OTP. Check the code in your notification.");
      return;
    }
    setOtpError("");
    goTo(3, 1);
  };

  const handleResend = () => {
    const code = generateOtp();
    storeResetCode(resetEmail, code);
    setOtpError("");
    setOtpAttempt((count) => count + 1);
    pushToast({
      variant: "security",
      title: "DevForge Security Code",
      code,
      message: `A fresh code was sent to ${resetEmail}.`,
    });
  };

  const handleReset = (event) => {
    event.preventDefault();
    setErrorBanner("");
    const nextErrors = {};
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else if (scorePassword(password) < 2) {
      nextErrors.password = "Password too weak — add numbers and mixed case";
    }
    if (confirm !== password) nextErrors.confirm = "Passwords do not match";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      updatePassword(resetEmail, password);
      clearResetCode();
      pushToast({
        variant: "success",
        title: "Password updated",
        message: "Your password was changed. Login with your new credentials.",
      });
      onComplete(resetEmail);
    }, 750);
  };

  const stepHeaders = {
    1: { kicker: "Step 1 of 3", title: "Find your account" },
    2: { kicker: "Step 2 of 3 · OTP", title: "Enter reset code" },
    3: { kicker: "Step 3 of 3", title: "Set a new password" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 1 ? onComplete("") : goTo(step - 1, -1))}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-400 transition-colors hover:text-rose-400"
        >
          <ArrowLeft size={14} />
          {step === 1 ? "Back to Sign In" : "Back"}
        </button>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          {[1, 2, 3].map((number) => (
            <span
              key={number}
              className={`grid h-5 w-5 place-items-center rounded-full border font-bold transition-all ${
                step >= number
                  ? "border-rose-500/60 bg-rose-500/15 text-rose-400 shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                  : "border-line text-zinc-600"
              }`}
            >
              {number}
            </span>
          ))}
        </span>
      </div>

      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-400">
          {stepHeaders[step].kicker}
        </p>
        <h3 className="mt-1 text-xl font-bold text-white">
          {stepHeaders[step].title}
        </h3>
      </div>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {step === 1 && (
          <motion.form
            key="step1"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            onSubmit={handleRequest}
            noValidate
            className="space-y-4"
          >
            {errorBanner && <Alert>{errorBanner}</Alert>}
            <p className="text-sm text-zinc-400">
              Enter the email linked to your account and we will send a
              one-time security code.
            </p>
            <EmailField
              label="Email Address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="you@devforge.dev"
              error={errors.email}
              autoComplete="email"
              autoFocus
            />
            <SubmitButton loading={loading}>Send Reset Code</SubmitButton>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-4"
          >
            {otpError && <Alert>{otpError}</Alert>}
            <p className="flex items-start gap-2 text-sm text-zinc-400">
              <Fingerprint size={16} className="mt-0.5 shrink-0 text-rose-400" />
              <span>
                We just pinged a 6-digit code to{" "}
                <span className="font-semibold text-white">{resetEmail}</span>.
                Check the simulated notification in the corner.
              </span>
            </p>
            <OtpInput
              key={`otp-${otpAttempt}-${verifyAttempt}`}
              length={6}
              error={otpError}
              onComplete={handleVerify}
            />
            <div className="flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 font-semibold text-rose-400 transition-colors hover:text-rose-300"
              >
                <RefreshCw size={13} />
                Resend code
              </button>
              <span className="text-zinc-600">valid for 5 min</span>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.form
            key="step3"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            onSubmit={handleReset}
            noValidate
            className="space-y-4"
          >
            <p className="flex items-start gap-2 text-sm text-zinc-400">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>
                Identity verified for{" "}
                <span className="font-semibold text-white">{resetEmail}</span>.
                Choose a fresh password.
              </span>
            </p>
            <div>
              <PasswordField
                label="New Password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="At least 8 characters"
                error={errors.password}
                autoComplete="new-password"
              />
              {password && <PasswordStrength password={password} />}
            </div>
            <PasswordField
              label="Confirm New Password"
              value={confirm}
              onChange={(event) => {
                setConfirm(event.target.value);
                setErrors((prev) => ({ ...prev, confirm: "" }));
              }}
              placeholder="Repeat your password"
              error={errors.confirm}
              autoComplete="new-password"
            />
            <SubmitButton loading={loading}>Update Password</SubmitButton>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}