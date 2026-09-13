export const MENTOR = {
  name: "Alex Vance",
  role: "Senior Web3 Systems Mentor",
  email: "alex.vance@devforge.dev",
  cohort: "Cohort 12 · Web3 Systems Track",
  avatarFallback: "AV",
};

export const MENTOR_METRICS = [
  { label: "Active Mentored Students", value: "142", icon: "users" },
  { label: "Pending Help Tickets", value: "3", icon: "lifebuoy" },
  { label: "Average Resolution Time", value: "12 mins", icon: "clock" },
  { label: "Code Reviews Approved", value: "389", icon: "check" },
];

const PRIORITY_ORDER = { blocker: 0, urgent: 1, low: 2 };

export const SEED_TICKETS = [
  {
    id: "DF-9082",
    status: "Open",
    studentName: "Amara Okafor",
    studentEmail: "amara@devforge.dev",
    studentTrack: "Solana Anchor Framework Masterclass",
    course: "Solana Anchor Framework Masterclass",
    module: "Module 6 · PDAs & CPI",
    priority: "blocker",
    snippet: `const [pda, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("player_state"), player.publicKey.toBuffer()],
  programId
);

await program.methods
  .createPlayerState()
  .accounts({
    playerState: pda,
    player: player.publicKey,
  })
  .rpc();`,
    description:
      "Getting Error: InvalidProgramId when invoking createPlayerState. The PDA derives fine on the client but the program rejects the CPI signer.",
    createdAt: "2026-09-08T09:24:00.000Z",
    resolvedAt: null,
    mentorReply: "",
  },
  {
    id: "DF-9079",
    status: "Open",
    studentName: "Diego Fernandez",
    studentEmail: "diego@devforge.dev",
    studentTrack: "Next.js 15 App Router Architecture",
    course: "Next.js 15 App Router Architecture",
    module: "Module 4 · Server Actions",
    priority: "urgent",
    snippet: `"use server";

export async function updateProfile(formData) {
  const name = formData.get("name");
  await db.user.update({ data: { name } });
  revalidatePath("/settings");
}`,
    description:
      "Server Action works but the client form shows a hydration mismatch warning in console. Unsure if it's a real issue or a dev-server false positive.",
    createdAt: "2026-09-08T16:02:00.000Z",
    resolvedAt: null,
    mentorReply: "",
  },
  {
    id: "DF-9076",
    status: "Open",
    studentName: "Lena Petrova",
    studentEmail: "lena@devforge.dev",
    studentTrack: "Rust Systems & Memory Management",
    course: "Rust Systems & Memory Management",
    module: "Module 3 · Borrow Checker Deep Dive",
    priority: "low",
    snippet: `let items = vec![1, 2, 3];
for item in &items {
  println!("{}", item);
}
let total = items.iter().sum::<u32>();`,
    description:
      "Why does the borrow still hold after the loop when I try to move items into a closure later? Expected to understand when NLL releases the borrow.",
    createdAt: "2026-09-09T11:11:00.000Z",
    resolvedAt: null,
    mentorReply: "",
  },
];

export const COHORT_STUDENTS = [
  {
    id: "stu_01",
    name: "Amara Okafor",
    course: "Solana Anchor Framework Masterclass",
    progress: 85,
    submission: { file: "anchor_vault.ts", lang: "typescript", status: "pending" },
    track: "backend",
  },
  {
    id: "stu_02",
    name: "Diego Fernandez",
    course: "Next.js 15 App Router Architecture",
    progress: 90,
    submission: { file: "server-actions.tsx", lang: "tsx", status: "approved" },
    track: "frontend",
  },
  {
    id: "stu_03",
    name: "Lena Petrova",
    course: "Rust Systems & Memory Management",
    progress: 60,
    submission: { file: "allocator.rs", lang: "rust", status: "revision" },
    track: "backend",
  },
  {
    id: "stu_04",
    name: "Michael Zhou",
    course: "Solana Anchor Framework Masterclass",
    progress: 45,
    submission: { file: "pda_lookup.rs", lang: "rust", status: "pending" },
    track: "backend",
  },
  {
    id: "stu_05",
    name: "Priya Raghavan",
    course: "Next.js 15 App Router Architecture",
    progress: 72,
    submission: { file: "route-handler.ts", lang: "typescript", status: "approved" },
    track: "frontend",
  },
];

export const SUBMISSION_SNIPPETS = {
  "anchor_vault.ts": `import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program } from "@project-serum/anchor";

const { connection } = useConnection();
const wallet = useAnchorWallet() as any;

const program = new Program(IDL, PROGRAM_ID, provider);

const [vault] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), wallet.publicKey.toBuffer()],
  program.programId
);

await program.methods
  .initializeVault(new anchor.BN(1_000_000))
  .accounts({ vault, owner: wallet.publicKey, systemProgram: SystemProgram.programId })
  .rpc();`,
  "server-actions.tsx": `"use client";

import { useTransition } from "react";
import { updateProfile } from "./actions";

export default function SettingsForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => updateProfile(formData))
      }
    >
      <input name="name" defaultValue="" />
      <button disabled={isPending}>
        {isPending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}`,
  "allocator.rs": `use std::alloc::{GlobalAlloc, Layout, System};

struct TrackingAllocator;

unsafe impl GlobalAlloc for TrackingAllocator {
  unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
    // track peak usage before delegating
    System.alloc(layout)
  }

  unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
    System.dealloc(ptr, layout);
  }
}

#[global_allocator]
static ALLOC: TrackingAllocator = TrackingAllocator;`,
  "pda_lookup.rs": `use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Lookup<'info> {
  #[account(
    seeds = [b"player", player.key().as_ref()],
    bump
  )]
  pub player_state: Account<'info, PlayerState>,
  pub player: Signer<'info>,
}`,
  "route-handler.ts": `import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const data = await db.post.findMany({
    where: { slug: slug ?? undefined },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=60" },
  });
}`,
};

export const QUIZ_ANALYTICS = [
  { course: "Solana Anchor Masterclass", passRate: 78, attempts: 340, label: "78% Pass Rate" },
  { course: "Next.js 15 App Router Architecture", passRate: 84, attempts: 512, label: "84% Pass Rate" },
  { course: "Rust Systems & Memory Management", passRate: 69, attempts: 298, label: "69% Pass Rate" },
  { course: "EVM Smart Contracts", passRate: 74, attempts: 261, label: "74% Pass Rate" },
];

export function sortTickets(tickets) {
  return [...(tickets || [])].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 3;
    const pb = PRIORITY_ORDER[b.priority] ?? 3;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}