"use client";

import { useRef, useState } from "react";

export default function OtpInput({
  length = 6,
  error,
  onComplete,
  disabled,
  autoFocus = true,
}) {
  const [values, setValues] = useState(Array(length).fill(""));
  const refs = useRef([]);

  const commit = (index, digit, currentValues = values) => {
    const next = [...currentValues];
    next[index] = digit;
    setValues(next);
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
    if (next.every((value) => value !== "") && next.length === length) {
      onComplete?.(next.join(""));
    }
    return next;
  };

  const handleChange = (index) => (event) => {
    const digit = event.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    if (digit) commit(index, digit);
    else {
      const next = [...values];
      next[index] = "";
      setValues(next);
    }
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (values[index]) {
        commit(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    } else if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      commit(index, event.key);
    }
  };

  const handlePaste = (index) => (event) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (!digits) return;
    const next = [...values];
    digits.split("").forEach((digit, offset) => {
      const target = index + offset;
      if (target < length) next[target] = digit;
    });
    setValues(next);
    const focusTarget = Math.min(index + digits.length, length - 1);
    refs.current[focusTarget]?.focus();
    if (next.every((value) => value !== "") && next.length === length) {
      onComplete?.(next.join(""));
    }
    return next;
  };

  return (
    <div className="flex justify-between gap-2">
      {values.map((value, index) => (
        <input
          key={`${index}-${error ? "err" : "ok"}`}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={value}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`OTP digit ${index + 1}`}
          className={`h-12 w-full rounded-xl border bg-[#0a1122] text-center font-mono text-lg font-bold text-white outline-none transition-all duration-200 ${
            error
              ? "border-rose-600/70 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
              : value
                ? "border-rose-500/60 shadow-[0_0_14px_rgba(255,255,255,0.18)]"
                : "border-line focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)]"
          }`}
        />
      ))}
    </div>
  );
}