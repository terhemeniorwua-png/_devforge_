export const QUIZ_MODES = [
  { key: "track", label: "By Track" },
  { key: "ecosystem", label: "By Ecosystem" },
];

export const TRACK_OPTIONS = [
  { key: "Frontend", label: "Frontend", hint: "React · Next · Tailwind" },
  { key: "Backend", label: "Backend", hint: "Node · Rust · Postgres" },
  { key: "Fullstack", label: "Fullstack", hint: "Apps end-to-end" },
];

export const ECOSYSTEM_OPTIONS = [
  { key: "Web2", label: "Web2", hint: "REST · SQL · SaaS" },
  { key: "Web3", label: "Web3", hint: "Solana · EVM · Anchor" },
];

export const QUIZ_TIME = 20;

export const QUIZ_QUESTIONS = [
  {
    id: "next-loading",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "In the Next.js App Router, which file defines the loading UI shown while a route segment streams?",
    code: "app/posts/___.jsx",
    options: ["layout.jsx", "loading.jsx", "not-found.jsx", "template.jsx"],
    answer: 1,
    explanation:
      "App Router reserves loading.jsx inside a folder — it becomes the Suspense fallback so a layout can show instantly while page.jsx resolves.",
  },
  {
    id: "use-client",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "Which directive opts a module into Client Component rendering in Next.js?",
    code: "'___'",
    options: ['"use server"', '"use client"', '"use strict"', '"use cache"'],
    answer: 1,
    explanation:
      '"use client" must sit at the top of the file. It marks the module (and its imported tree) as client-rendered, letting it use hooks and event listeners.',
  },
  {
    id: "react-keys",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "When rendering a list in React, what is the most reliable way to predict reconciliation?",
    code: "items.map((item) => <Row key={item.id} />)",
    options: [
      "Use the array index so order never changes",
      "Give each item a stable unique key",
      "Sort items before rendering",
      "Disable keys on small lists",
    ],
    answer: 1,
    explanation:
      "A stable, unique key lets React match elements across renders so state and DOM nodes survive re-orders. Index keys break down when lists change.",
  },
  {
    id: "tailwind-lg",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "Which Tailwind CSS prefix targets viewports at or above the 1024px breakpoint?",
    code: "<div className='___:grid'>",
    options: ["sm:", "md:", "lg:", "xl:"],
    answer: 2,
    explanation:
      "lg: applies at min-width 1024px. Tailwind's default scale runs sm(640), md(768), lg(1024), xl(1280), 2xl(1536).",
  },
  {
    id: "next-cache",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "How do you opt a Next.js fetch out of the default static cache for truly dynamic data?",
    code: "await fetch(url, { cache: '___' })",
    options: [
      "'force-static'",
      "'no-store'",
      "'revalidate'",
      "'immutable'",
    ],
    answer: 1,
    explanation:
      "cache: 'no-store' bypasses the fetch cache for every request — the equivalent of `export const dynamic = 'force-dynamic'` for that data.",
  },
  {
    id: "suspense",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "What does Suspense render while an async component suspends?",
    code: "<Suspense fallback={<Spinner />}>",
    options: [
      "The nearest error boundary",
      "Nothing until data resolves",
      "Its fallback UI",
      "A cached copy of the last value",
    ],
    answer: 2,
    explanation:
      "Suspense shows the fallback while a promise is pending, then transitions to the resolved content — the backbone of streaming SSR.",
  },
  {
    id: "params-dynamic",
    track: "Frontend",
    ecosystem: "Web2",
    prompt:
      "How does a dynamic route segment reach the page component in the App Router?",
    code: "app/blog/[slug]/page.jsx",
    options: [
      "As the second argument of props",
      "Via a global pathname() call",
      "Through the props.params object",
      "It is injected into page.jsx body",
    ],
    answer: 2,
    explanation:
      "Page receives props.params — for [slug] that is { slug: '...' }. params is a Promise in async pages and must be awaited.",
  },
  {
    id: "use-wallet",
    track: "Frontend",
    ecosystem: "Web3",
    prompt:
      "How do you read the connected wallet's public key in a Solana React dApp?",
    code: "import { useWallet } from '@solana/wallet-adapter-react'",
    options: [
      "const wallet = window.solana.publicKey",
      "useWallet() exposes it as wallet.publicKey",
      "walletAdapter.connect() returns it directly",
      "It arrives in route params",
    ],
    answer: 1,
    explanation:
      "useWallet() returns { publicKey, signMessage, ... }. publicKey is null until the user approves a connection.",
  },
  {
    id: "ethers-read",
    track: "Frontend",
    ecosystem: "Web3",
    prompt:
      "Which call reads an ERC-20 balance without spending gas?",
    code: "const bal = await ???",
    options: [
      "contract.balanceOf(wallet).send()",
      "contract.balanceOf(wallet)",
      "provider.estimateGas(balanceOf)",
      "wallet.signTransaction()",
    ],
    answer: 1,
    explanation:
      "view/pure functions called with await don't broadcast — the provider executes them against local state and returns the value.",
  },
  {
    id: "phantom",
    track: "Frontend",
    ecosystem: "Web3",
    prompt:
      "Which wallet provider is the reference client used to connect Solana dApps in the browser?",
    code: "window.___?.connect()",
    options: ["window.ethereum", "window.phantom", "window.metamask", "window.web3"],
    answer: 1,
    explanation:
      "Phantom injects window.phantom and implements the Solana wallet standard; MetaMask/ethereum targets EVM chains.",
  },
  {
    id: "sign-message",
    track: "Frontend",
    ecosystem: "Web3",
    prompt:
      "Why do dApps ask users to sign a message before log-in?",
    code: "wallet.signMessage(message)",
    options: [
      "To pay gas for the session",
      "To prove ownership of the address",
      "To mint a session NFT",
      "To broadcast a transaction",
    ],
    answer: 1,
    explanation:
      "signMessage proves the key controlling an address without spending gas — the classic SIWS (Sign-In With Solana/Ethereum) flow.",
  },
  {
    id: "node-env",
    track: "Backend",
    ecosystem: "Web2",
    prompt:
      "How does Node.js cache process.env at startup?",
    options: [
      "It re-reads the file on every access",
      "It holds a live proxy that never changes",
      "It snapshots env once when the process boots",
      "It only reads the .env file, not real env",
    ],
    answer: 2,
    explanation:
      "process.env is populated when Node starts. Changing the OS env later (or the .env file) does not mutate the already-cached object.",
  },
  {
    id: "having",
    track: "Backend",
    ecosystem: "Web2",
    prompt:
      "Which SQL clause filters rows AFTER GROUP BY has aggregated them?",
    code: "SELECT track, COUNT(*) FROM users\nGROUP BY track\n___ COUNT(*) > 10",
    options: ["WHERE", "HAVING", "FILTER", "LIMIT"],
    answer: 1,
    explanation:
      "WHERE filters pre-aggregation rows; HAVING filters group results — e.g. finding tracks with more than 10 users.",
  },
  {
    id: "pipeline",
    track: "Backend",
    ecosystem: "Web2",
    prompt:
      "What is the purpose of pipeline() from node:stream/promises?",
    options: [
      "To serialize objects into JSON",
      "To connect streams and manage backpressure + errors",
      "To parallelize async HTTP calls",
      "To convert buffers into strings",
    ],
    answer: 1,
    explanation:
      "pipeline streams data through readable→transform→writable while applying backpressure and automatically destroying streams on error.",
  },
  {
    id: "rust-borrow",
    track: "Backend",
    ecosystem: "Web2",
    prompt:
      "A function signature taking &self means the method...",
    code: "fn score(&self) -> u32",
    options: [
      "Moves self out of the caller",
      "Borrows self immutably",
      "Clones self",
      "Takes ownership by value",
    ],
    answer: 1,
    explanation:
      "&self is an immutable borrow — the caller keeps ownership, and multiple simulated &self calls may run at once.",
  },
  {
    id: "rust-release",
    track: "Backend",
    ecosystem: "Web2",
    prompt:
      "Which cargo command builds with optimizations for production?",
    options: [
      "cargo build",
      "cargo build --release",
      "cargo run --dev",
      "cargo test",
    ],
    answer: 1,
    explanation:
      "--release enables opt-level=3, LTO, and codegen units=1 — far faster and smaller binaries than the debug build.",
  },
  {
    id: "pg-isolation",
    track: "Backend",
    ecosystem: "Web2",
    prompt:
      "What is PostgreSQL's default transaction isolation level?",
    options: [
      "Serializable",
      "Repeatable Read",
      "Read Committed",
      "Read Uncommitted",
    ],
    answer: 2,
    explanation:
      "Postgres defaults to READ COMMITTED — each statement sees a fresh snapshot, unlike REPEATABLE READ's single snapshot per transaction.",
  },
  {
    id: "anchor-program",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "What does the Anchor #[program] attribute actually declare?",
    code: "#[program]\npub mod forge { ... }",
    options: [
      "The account structs used by the program",
      "The on-chain instruction handlers & their IDs",
      "The CPI target addresses",
      "The client-side TypeScript bindings",
    ],
    answer: 1,
    explanation:
      "#[program] marks the module of instruction functions. Anchor mints an ID per handler and wires them for dispatch.",
  },
  {
    id: "pda-derivation",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "What makes find_program_address(seeds, program_id) deterministic?",
    options: [
      "A random nonce picked at runtime",
      "Seeds + program_id hashed off the Ed25519 curve",
      "The latest blockhash",
      "The wallet's public key only",
    ],
    answer: 1,
    explanation:
      "PDAs are hashed from (seeds, program_id, bump) so anyone can recompute the address; the bump keeps it off the ed25519 curve so only the program can 'sign'.",
  },
  {
    id: "account-attr",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "In Anchor, what is the #[account] attribute used on a plain struct?",
    code: "#[account]\npub struct Vault { pub balance: u64 }",
    options: [
      "Marks it as the program's IDL entrypoint",
      "Declares an account base with serialization, size & discriminator",
      "Imports external accounts by reference",
      "Names the instruction error fun",
    ],
    answer: 1,
    explanation:
      "#[account] on a data struct generates the account traits: a discriminator, Borsh serialize/deserializer, and INIT_SPACE for sizing.",
  },
  {
    id: "evm-storage",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "Which Solidity data location persists to contract state between transactions?",
    code: "mapping(address => uint) ___ balances;",
    options: ["memory", "storage", "calldata", "stack"],
    answer: 1,
    explanation:
      "storage reads/writes the persistent trie — memory and calldata are ephemeral and freed when the call finishes.",
  },
  {
    id: "public-getter",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "Declaring a state variable public automatically...",
    code: "uint256 public supply;",
    options: [
      "Pays for its own deployment",
      "Generates a read-only getter function",
      "Makes it upgradable",
      "Emits a log on every write",
    ],
    answer: 1,
    explanation:
      "public state variables expose an auto-generated view getter — the compiler adds the free function at the top level.",
  },
  {
    id: "payable",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "What does the payable modifier allow a Solidity function to do?",
    code: "function deposit() external payable",
    options: [
      "Revert on zero-value calls",
      "Receive ETH alongside the call",
      "Change the contract owner",
      "Skip gas estimation",
    ],
    answer: 1,
    explanation:
      "payable lets msg.value be non-zero so callers can send ETH into the contract — mandatory for funds-in functions.",
  },
  {
    id: "anchor-cpi",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "To move SOL out of a PDA-owned account, your Anchor program must sign with...",
    options: [
      "invoke_signed + the PDA seeds & bump",
      "The owner's normal wallet key",
      "A server-side private key",
      "system.rsa_amend",
    ],
    answer: 0,
    explanation:
      "PDAs can't sign natively, so CPI uses invoke_signed(..., &[&[seeds, bump]]) — only the owning program can produce that signature.",
  },
  {
    id: "evm-mapping",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "Which fact about Solidity mappings is true?",
    code: "mapping(address => uint) public balances;",
    options: [
      "They are fully iterable in order",
      "They hold no length and cannot be enumerated",
      "They live in call stack memory",
      "They serialize as JSON arrays",
    ],
    answer: 1,
    explanation:
      "Mappings are hashed storage slots with no iteration or length — contracts track chains of keys (e.g. arrays or via events) to enumerate.",
  },
  {
    id: "constructor",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "When does a contract's constructor code execute?",
    code: "constructor(address admin) { owner = admin; }",
    options: [
      "On every state-changing call",
      "Once, at deployment time",
      "Each time owner() is read",
      "During bytecode verification",
    ],
    answer: 1,
    explanation:
      "Constructors run a single time during CREATE/CREATE2 deployment, and can set immutables and initial storage.",
  },
  {
    id: "init-space",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "The Anchor attribute init creates an account — which fields is it paired with?",
    code: "#[account(init, ___, space = 8 + Vault::INIT_SPACE)]",
    options: ["owner", "payer + seeds", "rent", "close"],
    answer: 1,
    explanation:
      "init needs one or more PDA seeds (to derive the address) plus a payer that rents/funds the new account.",
  },
  {
    id: "require-macro",
    track: "Backend",
    ecosystem: "Web3",
    prompt:
      "Which macro short-circuits a Solana program when an invariant fails?",
    code: "___!(ctx.accounts.vault.is_locked == false, VaultLocked);",
    options: ["assert!", "require!", "panic!", "expect!"],
    answer: 1,
    explanation:
      "require!(cond, ErrorCode) evaluates a condition and throws a specific program error instead of panicking — standard for Anchor guards.",
  },
  {
    id: "secrets",
    track: "Fullstack",
    ecosystem: "Web2",
    prompt:
      "Where must RPC API keys and signing secrets live in a Next.js fullstack app?",
    options: [
      "Inline in client components",
      "In NEXT_PUBLIC_ env vars shipped to the browser",
      "On the server only, via non-public environment variables",
      "In the database of the latest visitor",
    ],
    answer: 2,
    explanation:
      "Anything bundled to the client is public. Secrets belong in server-only env vars read by Route Handlers or Server Actions.",
  },
  {
    id: "cors",
    track: "Fullstack",
    ecosystem: "Web2",
    prompt:
      "A browser fetch to an API on another origin fails with CORS. What resolves it correctly?",
    options: [
      "Disable the browser's security flags",
      "The server sends Access-Control-Allow-Origin for the domain",
      "Use https on both sides",
      "Set the header in HTML meta tags",
    ],
    answer: 1,
    explanation:
      "The server owns the policy: it must echo allowed origins in Access-Control-Allow-Origin (and handle preflights) before the browser will expose the response.",
  },
  {
    id: "websocket",
    track: "Fullstack",
    ecosystem: "Web2",
    prompt:
      "When is a WebSocket the right tool over HTTP fetch?",
    options: [
      "One-shot requests that can be cached",
      "Persistent, low-latency bidirectional streams",
      "Static page prefetching",
      "File downloads with resume",
    ],
    answer: 1,
    explanation:
      "WebSockets keep a single open connection for server→client pushes (chat, market feeds). HTTP shines for request-response and caching.",
  },
  {
    id: "server-fetch",
    track: "Fullstack",
    ecosystem: "Web2",
    prompt:
      "A Server Component fetches from an internal API. What's the smartest pattern?",
    options: [
      "Fetch at every client render",
      "Fetch once server-side and pass serialized props",
      "Duplicate the fetch in every leaf component",
      "Hardcode the payload",
    ],
    answer: 1,
    explanation:
      "Server Components fetch once, dedupe per request, and ship the result — keeping round trips and client bundles small.",
  },
  {
    id: "anchor-fetch",
    track: "Fullstack",
    ecosystem: "Web3",
    prompt:
      "How does an Anchor TS client read a program's stored account state?",
    code: "const vault = await program.account.vault.fetch(address)",
    options: [
      "It sends a signed transaction",
      "It deserializes on-chain bytes using the IDL",
      "It reads localStorage keys",
      "It calls the RPC subscribe() endpoint",
    ],
    answer: 1,
    explanation:
      "program.account.<Type>.fetch queries getAccountInfo and decodes the bytes with the IDL-defined layout — a pure read, no fees.",
  },
  {
    id: "tx-receipt",
    track: "Fullstack",
    ecosystem: "Web3",
    prompt:
      "In ethers.js, what does tx.wait() return?",
    code: "const receipt = await tx.wait()",
    options: [
      "The transaction hash pulse",
      "The mined transaction receipt with logs and status",
      "A live reorg subscription",
      "The signed transaction object",
    ],
    answer: 1,
    explanation:
      "tx.wait() resolves once the tx is mined and returns the receipt — status checks success and .logs surface emitted events.",
  },
  {
    id: "wallet-context",
    track: "Fullstack",
    ecosystem: "Web3",
    prompt:
      "Why do fullstack Web3 apps wrap the tree in wallet adapter providers?",
    options: [
      "To cache static pages",
      "So any component can reach wallet state via context/hooks",
      "To enable SSR of private keys",
      "To block bots with proof-of-work",
    ],
    answer: 1,
    explanation:
      "Providers (WalletAdapterProvider, WagmiConfig) publish connection state through context, letting leaf components call useWallet() / useAccount().",
  },
];