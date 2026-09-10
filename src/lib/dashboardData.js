const RANK_TITLES = {
  "Fullstack (Web3)": "Fullstack Web3 Engineer",
  "Fullstack Ecosystem Master": "Fullstack Web3 Engineer",
  "Frontend (Web2)": "Frontend Craft Engineer",
  "Frontend (Web2/Web3)": "Frontend Craft Engineer",
  "Backend (Web2)": "Backend Systems Engineer",
  "Backend (Web2/Web3)": "Backend Systems Engineer",
  "Fullstack (Web2)": "Fullstack Web2 Engineer",
};

export const ACTIVE_COURSES = [
  {
    id: "anchor-masterclass",
    title: "Solana Anchor Framework Masterclass",
    tag: "Web3 · Solana",
    progress: 85,
    module: "Resume at Module 6 · PDAs & CPI",
    href: "/catalog",
  },
  {
    id: "nextjs-router",
    title: "Next.js 15 App Router Architecture",
    tag: "Web2 · Frontend",
    progress: 90,
    module: "Resume at Module 4 · Server Actions",
    href: "/catalog",
  },
  {
    id: "rust-memory",
    title: "Rust Systems & Memory Management",
    tag: "Web2 · Systems",
    progress: 60,
    module: "Resume at Module 3 · Borrow Checker Deep Dive",
    href: "/catalog",
  },
];

export const QUICK_STATS = [
  { label: "Active Enrolled Courses", value: "4", icon: "book" },
  { label: "Overall Completion Rate", value: "82%", icon: "gauge" },
  { label: "Assessments Passed", value: "18", icon: "trophy" },
  { label: "Smart Contracts Deployed", value: "12", icon: "rocket" },
];

export const HELP_MODULES = {
  "Solana Anchor Framework Masterclass": ["Module 2 · Accounts & State", "Module 4 · Error Handling", "Module 6 · PDAs & CPI"],
  "Next.js 15 App Router Architecture": ["Module 1 · Routing Fundamentals", "Module 3 · Data Fetching", "Module 4 · Server Actions"],
  "Rust Systems & Memory Management": ["Module 1 · Ownership Basics", "Module 3 · Borrow Checker Deep Dive", "Module 5 · Lifetimes"],
};

export const MOCK_PROFILE = {
  id: "usr_mock",
  name: "Kai Nakamura",
  email: "kai@devforge.dev",
  tier: "guided_mentor",
  isPaid: true,
  track: "Fullstack (Web3)",
  commitment: "10",
  streak: 14,
  xp: 2450,
  rank: "Fullstack Web3 Engineer",
  avatarFallback: "KN",
};

export const AI_RESPONSES = [
  {
    match: ["pda", "anchor", "solana"],
    blocks: [
      {
        type: "text",
        content:
          "A PDA error usually means your program is signing with the wrong seeds — even one byte off fails the constraint. Let's check the derive path.",
      },
      {
        type: "code",
        content: "const [pda, bump] = PublicKey.findProgramAddressSync(\n  [Buffer.from(\"player_state\"), player.key.toBuffer()],\n  program.programId\n);",
      },
      {
        type: "text",
        content:
          "Kernel: the bump must match the one stored on-chain, and the signer must use that exact bump in the cross-program invocation. Re-verify findProgramAddressSync is called with identical seeds in both client and program.",
      },
    ],
  },
  {
    match: ["server action", "next.js", "server actions"],
    blocks: [
      {
        type: "text",
        content:
          "Server Actions are async functions you can call straight from the client. They run on the server, so secrets and DB access stay out of the bundle.",
      },
      {
        type: "code",
        content: "\"use server\"\n\nexport async function createNote(formData) {\n  const title = formData.get(\"title\");\n  await db.note.create({ title });\n  revalidatePath(\"/notes\");\n}",
      },
      {
        type: "text",
        content:
          "They play nicely with useTransition + useOptimistic for instant UI feedback — optimistic update first, reconcile when the action resolves.",
      },
    ],
  },
  {
    match: ["rust", "borrow"],
    blocks: [
      {
        type: "text",
        content:
          "This borrow-checker error fires when you move a value into a closure while still needing it later. Borrow it instead of moving it.",
      },
      {
        type: "code",
        content: "let ids: Vec<u64> = accounts.iter().map(|a| a.key).collect();\n\naccounts.par_iter().for_each(|acct| {\n  process(acct, &ids); // borrow, not move\n});",
      },
      {
        type: "text",
        content:
          "Rule of thumb: collect the data you need into a cheap owned buffer, then hand out shared references — ownership stays in one place and the borrow checker stays quiet.",
      },
    ],
  },
];

export const AI_FALLBACK = {
  blocks: [
    {
      type: "text",
      content:
        "I'm oriented toward the DevForge track material — debugging, architecture, and Rust/Anchor/Solana/Next.js questions. Your request didn't match a known pattern, so let me steer you toward the docs vault and quiz lab for structured help.",
    },
    {
      type: "text",
      content: "Open the Resource Vault for official docs, or run the Quiz Hub to test the concept as you figure it out.",
    },
  ],
};

export function rankForTrack(track) {
  return RANK_TITLES[track] || "DevForge Apprentice";
}

const ACTIVE_USER_KEY = "devforge_active_user";

export function getActiveUser() {
  if (typeof window === "undefined") return MOCK_PROFILE;
  try {
    const raw = window.localStorage.getItem(ACTIVE_USER_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored && stored.name) return stored;
    }
  } catch {
    // fall through to session / mock
  }
  try {
    const sessionRaw = window.localStorage.getItem("devforge_session");
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (session && session.name) {
        return { ...MOCK_PROFILE, ...session };
      }
    }
  } catch {
    // fall through to mock
  }
  return MOCK_PROFILE;
}