"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  CornerDownLeft,
  Send,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { AI_FALLBACK, AI_RESPONSES } from "@/lib/dashboardData";

const STORAGE_KEY = "devforge_ai_chats";
const MAX_CHATS = 50;

const SUGGESTIONS = [
  "Debug my Anchor PDA error",
  "Explain Next.js Server Actions",
  "Review my Rust code",
];

let idCounter = 0;
const rid = () => `m${Date.now()}_${idCounter++}`;

function matchResponse(prompt) {
  const needle = String(prompt || "").toLowerCase();
  for (const entry of AI_RESPONSES) {
    if (entry.match.some((k) => needle.includes(k))) return entry;
  }
  return AI_FALLBACK;
}

function readChats() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeChat(chats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(-MAX_CHATS)));
}

function MessageBlock({ chunk, partial }) {
  if (chunk.type === "code") {
    return (
      <div className="mt-2 overflow-hidden rounded-xl border border-line bg-[#0a1122]">
        <div className="flex items-center gap-1.5 border-b border-line bg-white/[0.03] px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            terminal
          </span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-emerald-300/90">
          {partial}
        </pre>
      </div>
    );
  }
  return <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{partial}</p>;
}

function MessageRow({ message, typing }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {message.role === "assistant" && (
        <span className="mr-2 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
          <Bot size={14} />
        </span>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          message.role === "user"
            ? "rounded-br-sm bg-gradient-to-r from-red-600 to-rose-700 text-obsidian shadow-[0_0_16px_rgba(255,255,255,0.3)]"
            : "border border-line bg-panel/80 text-left"
        }`}
      >
        {(message.role === "user"
          ? [{ type: "text", content: message.content || "" }]
          : message.blocks
        ).map((chunk, i) => (
          <MessageBlock
            key={i}
            chunk={chunk}
            partial={
              typing && i === message.typingBlock
                ? chunk.content.slice(0, message.typingOffset)
                : chunk.content
            }
          />
        ))}
        {typing && (
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-rose-400 animate-caret" />
        )}
      </div>
    </motion.div>
  );
}

export default function ForgeAiPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const typingRef = useRef(null);
  const listRef = useRef(null);
  const bootRef = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMessages(readChats());
      bootRef.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!bootRef.current || !listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (rawPrompt) => {
    const prompt = String(rawPrompt ?? input).trim();
    if (busy || !prompt) return;
    setInput("");
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
      setBusy(false);
    }
    const userMsg = { id: rid(), role: "user", content: prompt };
    const response = matchResponse(prompt);
    const aiMsg = {
      id: rid(),
      role: "assistant",
      blocks: response.blocks,
      typing: true,
      typingBlock: 0,
      typingOffset: 0,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setBusy(true);

    let block = 0;
    let offset = 0;
    typingRef.current = setInterval(() => {
      const blocks = response.blocks;
      if (block >= blocks.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setMessages((prev) => {
          const next = prev.map((m) =>
            m.id === aiMsg.id ? { ...m, typing: false, typingBlock: 0, typingOffset: 0 } : m
          );
          window.setTimeout(() => writeChat(next), 0);
          return next;
        });
        setBusy(false);
        return;
      }
      const chomp = blocks[block].content[offset] === undefined ? 0 : 1;
      offset += chomp;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, typing: true, typingBlock: block, typingOffset: Math.min(offset, blocks[block].content.length) }
            : m
        )
      );
      if (offset >= blocks[block].content.length) {
        block += 1;
        offset = 0;
      }
    }, 9);
  };

  return (
    <section
      className="overflow-hidden rounded-3xl border border-line bg-panel/70 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur"
      data-shift-forgeai="panel"
    >
      <div className="flex items-center justify-between border-b border-line bg-[#0e1629] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-red-500 via-rose-600 to-red-900 shadow-[0_0_16px_rgba(255,255,255,0.5)]">
            <Sparkles size={15} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">ForgeAI</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              DevForge AI Coding Tutor
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
          Online
        </span>
      </div>

      <div ref={listRef} className="h-[340px] space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <TerminalSquare size={28} className="text-rose-500/50" />
            <p className="mt-3 max-w-[220px] text-sm text-zinc-500">
              Ask ForgeAI anything about your courses, code, or the bootcamp.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <MessageRow
            key={m.id}
            message={m}
            typing={m.typing && busy}
          />
        ))}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s}
              type="button"
              data-shift-ai-chip={i}
              disabled={busy}
              onClick={() => handleSend(s)}
              className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-rose-500/50 hover:text-white disabled:cursor-wait disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            data-shift-ai-chat
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ForgeAI a question…"
            className="w-full rounded-xl border border-line bg-[#0a1122] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder-zinc-600 outline-none transition-colors focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
          />
          <button
            type="submit"
            data-shift-ai-send
            disabled={busy || !input.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-800 text-obsidian shadow-[0_0_16px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_26px_rgba(255,255,255,0.65)] disabled:cursor-wait disabled:opacity-50"
          >
            <Send size={15} />
          </button>
        </form>
        <p className="mt-2 font-mono text-[10px] text-zinc-600">
          <CornerDownLeft size={10} className="mr-1 inline" />
          Enter to send · chats persist locally in devforge_ai_chats
        </p>
      </div>
    </section>
  );
}