"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CreditCard,
  Flame,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { setSession, createUser, findUserByEmail, getUsers, isValidEmail, scorePassword } from "@/lib/auth";

const TIER = {
  name: "DevForge Guided Tier",
  price: 149,
  period: "/mo",
  features: [
    "1-on-1 Senior Mentor Support",
    "ForgeAI Code Tutor",
    "100% In-Browser Execution",
    "Custom Quizzes",
    "Verified Certification",
  ],
};

const TRACKS = [
  {
    key: "frontend",
    label: "Frontend (Web2/Web3)",
    stack: "React · Next.js · Tailwind · Wagmi/Viem",
    blurb: "Component-driven apps and wallet-connected UIs",
  },
  {
    key: "backend",
    label: "Backend (Web2/Web3)",
    stack: "Node.js · Rust · Anchor · Solana RPC",
    blurb: "APIs, indexers, and on-chain programs",
  },
  {
    key: "fullstack",
    label: "Fullstack Ecosystem Master",
    stack: "Web2 APIs → EVM / Solana Smart Contracts",
    blurb: "End-to-end: frontend, backend, and protocol",
  },
];

const COMMITMENTS = [
  { key: "5", label: "5 hrs / week", hint: "Starter stride" },
  { key: "10", label: "10 hrs / week", hint: "Steady climb" },
  { key: "20", label: "20+ hrs / week", hint: "Full sprint" },
];

const STEPS = [
  { key: 1, label: "Tier & Payment" },
  { key: 2, label: "Create Account" },
  { key: 3, label: "Track & Skills" },
  { key: 4, label: "Welcome" },
];

function useActiveUser() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem("devforge_active_user");
        setActive(raw ? JSON.parse(raw) : null);
      } catch {
        setActive(null);
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  return active;
}

function formatCard(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {STEPS.map((step, index) => {
        const done = current > step.key;
        const active = current === step.key;
        return (
          <div key={step.key} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border font-mono text-xs font-bold transition-all ${
                  done
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : active
                      ? "border-rose-500/60 bg-rose-500/15 text-white shadow-[0_0_18px_rgba(255,255,255,0.4)]"
                      : "border-line bg-panel text-zinc-600"
                }`}
              >
                {done ? <Check size={15} strokeWidth={3} /> : step.key}
              </span>
              <span
                className={`hidden text-xs font-semibold sm:block ${
                  active ? "text-white" : done ? "text-emerald-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="h-px w-10 bg-line sm:w-16" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FeatureRow({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <Check size={11} strokeWidth={3} />
      </span>
      <span className="text-sm leading-relaxed text-zinc-300">{children}</span>
    </li>
  );
}

function TierCard({ selected, onSelect, tier }) {
  const isActive = selected === tier.key;
  return (
    <button
      type="button"
      onClick={() => onSelect(tier.key)}
      className={`relative w-full rounded-2xl border p-6 text-left transition-all ${
        isActive
          ? "border-rose-500/60 bg-gradient-to-b from-rose-500/10 to-transparent shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          : "border-line bg-panel/60 hover:border-rose-500/30"
      }`}
    >
      <span
        className={`absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border-2 ${
          isActive ? "border-rose-500 bg-rose-500 text-obsidian" : "border-line"
        }`}
      >
        {isActive && <Check size={12} strokeWidth={3} />}
      </span>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-rose-400">
        {tier.badge}
      </p>
      <h3 className="mt-2 text-lg font-bold text-white">{tier.name}</h3>
      <p className="mt-2 font-mono text-3xl font-extrabold text-white">
        ${tier.price}
        <span className="text-sm font-semibold text-zinc-500">{tier.period}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tier.blurb}</p>
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const saved = useActiveUser();

  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [tierKey, setTierKey] = useState("guided");
  const [cardholder, setCardholder] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [trackKey, setTrackKey] = useState("fullstack");
  const [commitment, setCommitment] = useState("10");

  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountConfirm, setAccountConfirm] = useState("");
  const [accountErrors, setAccountErrors] = useState({});
  const [accountErrorBanner, setAccountErrorBanner] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!saved) return undefined;
    const id = window.setTimeout(() => {
      setCardholder((v) => v || saved.name || "");
      setEmail((v) => v || saved.email || "");
    }, 0);
    return () => window.clearTimeout(id);
  }, [saved]);

  const tier = TIER;

  const track = TRACKS.find((t) => t.key === trackKey) || TRACKS[0];
  const commitmentLabel =
    COMMITMENTS.find((c) => c.key === commitment)?.label || "10 hrs / week";

  const cardReady =
    cardholder.trim().length >= 3 &&
    email.includes("@") &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length >= 4 &&
    cvc.length >= 3;

  const processPayment = () => {
    if (!cardReady || processing) return;
    setProcessing(true);
    window.setTimeout(() => {
      const activeUser = {
        id: saved?.id || `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
        name: cardholder.trim(),
        email: email.trim().toLowerCase(),
        tier: "guided_mentor",
        tierLabel: "DevForge Guided Tier",
        isPaid: true,
        paymentStatus: "paid",
        payment: {
          last4: cardNumber.replace(/\s/g, "").slice(-4),
          brand: "Visa",
          amount: tier.price,
          currency: "USD",
          billedAt: new Date().toISOString(),
        },
        track: track.label,
        trackStack: track.stack,
        commitment,
        onboardedAt: saved?.onboardedAt || new Date().toISOString(),
      };
      try {
        window.localStorage.setItem("devforge_active_user", JSON.stringify(activeUser));
      } catch {
        // storage disabled — still advance the simulation
      }
      setAccountName(cardholder.trim());
      setAccountEmail(email.trim().toLowerCase());
      setProcessing(false);
      setStep(2);
    }, 1600);
  };

  const createAccount = () => {
    if (creatingAccount) return;
    const nextErrors = {};
    if (accountName.trim().length < 2) nextErrors.name = "Enter your full name";
    if (!isValidEmail(accountEmail)) nextErrors.email = "Enter a valid email address";
    if (accountPassword.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else if (scorePassword(accountPassword) < 2) {
      nextErrors.password = "Password too weak — add numbers and mixed case";
    }
    if (accountConfirm !== accountPassword) nextErrors.confirm = "Passwords do not match";
    if (Object.keys(nextErrors).length) {
      setAccountErrors(nextErrors);
      return;
    }
    setAccountErrors({});
    setAccountErrorBanner("");
    setCreatingAccount(true);
    window.setTimeout(() => {
      const users = getUsers();
      if (findUserByEmail(users, accountEmail)) {
        setCreatingAccount(false);
        setAccountErrorBanner("An account with this email already exists — try signing in instead.");
        return;
      }
      const user = createUser({
        name: accountName.trim(),
        email: accountEmail.trim().toLowerCase(),
        track: track.label,
        password: accountPassword,
      });
      setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        track: user.track,
      });
      setCreatingAccount(false);
      setStep(3);
    }, 700);
  };

  const finish = () => {
    setCompleted(true);
    window.setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-32 h-[460px] w-[460px] rounded-full radial-red blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-2/3 h-[420px] w-[420px] rounded-full radial-crimson blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-rose-400 shadow-[0_0_18px_rgba(255,255,255,0.15)]">
            <Sparkles size={13} />
            Paid Student Onboarding
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Forge your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-700 text-glow-red">
              guided seat
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Enroll in the DevForge Guided Tier, pick your ecosystem track, and
            step into a dashboard built around your goals.
          </p>
        </div>

        <div className="mt-10">
          <StepIndicator current={step} />
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-4xl"
              >
                <div className="overflow-hidden rounded-3xl border border-line bg-panel/80 shadow-[0_0_60px_rgba(255,255,255,0.14)] backdrop-blur-2xl">
                  <div className="border-b border-line bg-[#0e1629] px-6 py-4 sm:px-10">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        <ShieldCheck size={18} className="text-white" />
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">
                          Step 1 · Tier &amp; Payment
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500">
                          Choose your tier and confirm a payment method. Demo
                          checkout — no real charge.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10">
                    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
                      <div className="space-y-4">
                        <TierCard
                          selected={tierKey}
                          onSelect={setTierKey}
                          tier={{
                            key: "guided",
                            badge: "Mentor-guided",
                            name: TIER.name,
                            price: TIER.price,
                            period: TIER.period,
                            blurb:
                              "Senior 1-on-1 mentors, ForgeAI tutor access, in-browser labs, and verified certification.",
                          }}
                        />

                        <div className="rounded-2xl border border-line bg-[#0a1122]/60 p-5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            What you unlock
                          </p>
                          <ul className="mt-4 space-y-2.5">
                            {TIER.features.map((f) => (
                              <FeatureRow key={f}>{f}</FeatureRow>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <form
                        className="rounded-2xl border border-line bg-panel p-6"
                        onSubmit={(e) => {
                          e.preventDefault();
                          processPayment();
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30">
                            <CreditCard size={15} />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">Payment method</p>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                              Simulation — sandbox card gateway
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          <label className="block">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                              Cardholder name
                            </span>
                            <input
                              value={cardholder}
                              onChange={(e) => setCardholder(e.target.value)}
                              placeholder="Alex Rivera"
                              className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                            />
                          </label>

                          <label className="block">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                              Email for onboarding
                            </span>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="alex@devforge.dev"
                              className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                            />
                          </label>

                          <label className="block">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                              Card number
                            </span>
                            <input
                              inputMode="numeric"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCard(e.target.value))}
                              placeholder="4242 4242 4242 4242"
                              className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                            />
                          </label>

                          <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                                Expiry
                              </span>
                              <input
                                inputMode="numeric"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                placeholder="09 / 28"
                                className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 font-mono text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                              />
                            </label>
                            <label className="block">
                              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                                CVC
                              </span>
                              <input
                                inputMode="numeric"
                                value={cvc}
                                onChange={(e) =>
                                  setCvc(String(e.target.value).replace(/\D/g, "").slice(0, 4))
                                }
                                placeholder="123"
                                className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 font-mono text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">DevForge Guided Tier</span>
                            <span className="font-mono text-lg font-bold text-white">${TIER.price}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm text-zinc-500">
                              {TIER.period === "/mo" ? "Monthly billing" : TIER.period}
                            </span>
                            <span className="font-mono text-[11px] text-emerald-400">Due today</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={!cardReady || processing}
                          data-shift-onboard-pay
                          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-6 py-3.5 text-sm font-bold text-obsidian shadow-[0_0_22px_rgba(255,255,255,0.45)] transition-all hover:shadow-[0_0_36px_rgba(255,255,255,0.7)] disabled:cursor-wait disabled:opacity-50"
                        >
                          {processing ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Authorizing payment…
                            </>
                          ) : (
                            <>
                              <Lock size={15} />
                              Pay ${TIER.price} &amp; Continue
                              <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>

                        <p className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                          <ShieldCheck size={12} className="text-emerald-400" />
                          Sandbox checkout · no card is charged
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-4xl"
              >
                <div className="overflow-hidden rounded-3xl border border-line bg-panel/80 shadow-[0_0_60px_rgba(255,255,255,0.14)] backdrop-blur-2xl">
                  <div className="border-b border-line bg-[#0e1629] px-6 py-4 sm:px-10">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        <Lock size={18} className="text-white" />
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">
                          Step 2 · Create Your Account
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500">
                          Payment confirmed. Set your credentials to unlock your
                          dashboard and save your seat.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        createAccount();
                      }}
                    >
                      {accountErrorBanner && (
                        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
                          {accountErrorBanner}
                        </div>
                      )}

                      <label className="block">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                          Full name
                        </span>
                        <input
                          value={accountName}
                          onChange={(e) => {
                            setAccountName(e.target.value);
                            setAccountErrors((prev) => ({ ...prev, name: "" }));
                          }}
                          placeholder="Alex Rivera"
                          className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                        />
                        {accountErrors.name && (
                          <p className="mt-1.5 font-mono text-xs text-rose-400">{accountErrors.name}</p>
                        )}
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                          Email address
                        </span>
                        <input
                          type="email"
                          value={accountEmail}
                          onChange={(e) => {
                            setAccountEmail(e.target.value);
                            setAccountErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          placeholder="alex@devforge.dev"
                          className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                        />
                        {accountErrors.email && (
                          <p className="mt-1.5 font-mono text-xs text-rose-400">{accountErrors.email}</p>
                        )}
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                            Password
                          </span>
                          <input
                            type="password"
                            value={accountPassword}
                            onChange={(e) => {
                              setAccountPassword(e.target.value);
                              setAccountErrors((prev) => ({ ...prev, password: "" }));
                            }}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                          />
                          {accountErrors.password && (
                            <p className="mt-1.5 font-mono text-xs text-rose-400">{accountErrors.password}</p>
                          )}
                        </label>

                        <label className="block">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                            Confirm password
                          </span>
                          <input
                            type="password"
                            value={accountConfirm}
                            onChange={(e) => {
                              setAccountConfirm(e.target.value);
                              setAccountErrors((prev) => ({ ...prev, confirm: "" }));
                            }}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            className="mt-1.5 w-full rounded-xl border border-line bg-[#0a1122] px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                          />
                          {accountErrors.confirm && (
                            <p className="mt-1.5 font-mono text-xs text-rose-400">{accountErrors.confirm}</p>
                          )}
                        </label>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-xl border border-line bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-rose-500/40 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={creatingAccount}
                          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-6 py-3 text-sm font-bold text-obsidian shadow-[0_0_22px_rgba(255,255,255,0.45)] transition-all hover:shadow-[0_0_36px_rgba(255,255,255,0.7)] disabled:cursor-wait disabled:opacity-50"
                        >
                          {creatingAccount ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Creating account…
                            </>
                          ) : (
                            <>
                              <Lock size={15} />
                              Create Account
                              <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-4xl"
              >
                <div className="overflow-hidden rounded-3xl border border-line bg-panel/80 shadow-[0_0_60px_rgba(255,255,255,0.14)] backdrop-blur-2xl">
                  <div className="border-b border-line bg-[#0e1629] px-6 py-4 sm:px-10">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        <Target size={18} className="text-white" />
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">
                          Step 2 · Track &amp; Skill Customization
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500">
                          Pick your focus track and weekly commitment to shape
                          your curriculum and mentor plan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Primary focus track
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {TRACKS.map((t) => {
                        const activeTrack = trackKey === t.key;
                        return (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => setTrackKey(t.key)}
                            className={`rounded-2xl border p-5 text-left transition-all ${
                              activeTrack
                                ? "border-rose-500/60 bg-rose-500/10 shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                                : "border-line bg-white/[0.02] hover:border-rose-500/30 hover:bg-white/[0.04]"
                            }`}
                          >
                            <span
                              className={`grid h-8 w-8 place-items-center rounded-lg ${
                                activeTrack
                                  ? "bg-rose-500/20 text-rose-400"
                                  : "bg-white/5 text-zinc-400"
                              }`}
                            >
                              <Zap size={15} />
                            </span>
                            <p className="mt-3 text-sm font-bold text-white">{t.label}</p>
                            <p className="mt-1 font-mono text-[11px] leading-relaxed text-rose-400/80">
                              {t.stack}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                              {t.blurb}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Weekly commitment
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {COMMITMENTS.map((c) => {
                        const activeC = commitment === c.key;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCommitment(c.key)}
                            className={`rounded-2xl border p-5 text-left transition-all ${
                              activeC
                                ? "border-rose-500/60 bg-rose-500/10 shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                                : "border-line bg-white/[0.02] hover:border-rose-500/30"
                            }`}
                          >
                            <p
                              className={`font-mono text-xl font-bold ${
                                activeC ? "text-white" : "text-zinc-300"
                              }`}
                            >
                              {c.label}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{c.hint}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="rounded-xl border border-line bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-rose-500/40 hover:text-white"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        data-shift-onboard-track={trackKey}
                        onClick={() => setStep(4)}
                        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-6 py-3 text-sm font-bold text-obsidian shadow-[0_0_22px_rgba(255,255,255,0.45)] transition-all hover:shadow-[0_0_36px_rgba(255,255,255,0.7)]"
                      >
                        Review my plan
                        <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && !completed && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-3xl"
              >
                <div className="overflow-hidden rounded-3xl border border-rose-500/40 bg-panel/80 text-center shadow-[0_0_70px_rgba(255,255,255,0.22)] backdrop-blur-2xl">
                  <div className="relative px-6 py-12 sm:px-12">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                      className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_0_26px_rgba(16,185,129,0.55)]"
                    >
                      <BadgeCheck size={30} className="text-white" />
                    </motion.div>

                    <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                      You&apos;re all set, {cardholder.split(" ")[0] || "Engineer"}
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                      Your seat in the <span className="font-semibold text-rose-400">DevForge Guided Tier</span> is
                      active with the{" "}
                      <span className="font-semibold text-white">{track.label}</span>{" "}
                      track at {commitmentLabel}.
                    </p>

                    <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                        <Flame size={18} className="mx-auto text-amber-400" />
                        <p className="mt-2 font-mono text-sm font-bold text-white">Day 1 Streak</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
                          ignite it
                        </p>
                      </div>
                      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
                        <Trophy size={18} className="mx-auto text-rose-400" />
                        <p className="mt-2 font-mono text-sm font-bold text-white">Fullstack Apprentice</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-rose-400/80">
                          rank
                        </p>
                      </div>
                      <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
                        <Zap size={18} className="mx-auto text-emerald-400" />
                        <p className="mt-2 font-mono text-sm font-bold text-white">0 / 1000 XP</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          to rank up
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <Link
                        href="/dashboard"
                        data-shift-onboard-finish
                        onClick={finish}
                        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 px-7 py-3.5 text-sm font-bold text-obsidian shadow-[0_0_26px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_0_42px_rgba(255,255,255,0.75)]"
                      >
                        Enter Student Dashboard
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-rose-500/40 hover:text-white"
                      >
                        Browse the catalog first
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && completed && (
              <motion.div
                key="handoff"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-md text-center"
              >
                <div className="rounded-3xl border border-emerald-500/40 bg-panel/80 p-10 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                    <Rocket size={22} />
                  </span>
                  <p className="mt-5 text-lg font-bold text-white">Opening your dashboard…</p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    Handing off to /dashboard
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}