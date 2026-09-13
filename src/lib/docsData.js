export const ECOSYSTEM_FILTERS = [
  { key: "all", label: "All Ecosystems" },
  { key: "web2", label: "Web2" },
  { key: "web3", label: "Web3" },
];

export const DOC_RESOURCES = [
  {
    id: "solana-docs",
    title: "Solana Developer Docs",
    domain: "Backend",
    ecosystem: "web3",
    description:
      "Official architecture reference for the Solana network — RPC, clusters, SPL tokens, program deployment, and on-chain account model.",
    video: "/videos/solana.mp4",
    poster: "/videos/solana.jpg",
    url: "https://solana.com/docs",
    tags: ["Solana", "Rust", "RPC"],
  },
  {
    id: "anchor-docs",
    title: "Anchor Lang Program Guide",
    domain: "Backend",
    ecosystem: "web3",
    description:
      "The Anchor framework handbook: #[program] macros, account resolution, seeds, CPIs, and tests for Solana on-chain programs.",
    video: "/videos/anchor.mp4",
    poster: "/videos/anchor.jpg",
    url: "https://www.anchor-lang.com/docs",
    tags: ["Anchor", "Rust", "PDA"],
  },
  {
    id: "nextjs-docs",
    title: "Next.js App Router Docs",
    domain: "Fullstack",
    ecosystem: "web2",
    description:
      "File-system routing, Server Components, caching, Route Handlers, and middleware for production-grade Next.js applications.",
    video: "/videos/nextjs.mp4",
    poster: "/videos/nextjs.jpg",
    url: "https://nextjs.org/docs",
    tags: ["NextJS", "AppRouter", "RSC"],
  },
  {
    id: "react-docs",
    title: "React Reference Docs",
    domain: "Frontend",
    ecosystem: "web2",
    description:
      "The React 19 API surface — hooks, Components, APIs, and the declarative mental model behind every DevForge UI track.",
    video: "/videos/react.mp4",
    poster: "/videos/react.jpg",
    url: "https://react.dev/reference",
    tags: ["React", "Hooks", "Suspense"],
  },
  {
    id: "tailwind-docs",
    title: "Tailwind CSS Docs",
    domain: "Frontend",
    ecosystem: "web2",
    description:
      "Utility-first styling reference: configuration, responsive prefixes, theming, and the JIT pipeline that powers dark-mode UIs.",
    video: "/videos/tailwind.mp4",
    poster: "/videos/tailwind.jpg",
    url: "https://tailwindcss.com/docs",
    tags: ["Tailwind", "CSS", "PostCSS"],
  },
  {
    id: "rust-book",
    title: "The Rust Book",
    domain: "Backend",
    ecosystem: "web2",
    description:
      "Ownership, lifetimes, traits, and async/await — the canonical Rust reference for systems engineers shipping safe concurrency.",
    video: "/videos/rust.mp4",
    poster: "/videos/rust.jpg",
    url: "https://doc.rust-lang.org/book/",
    tags: ["Rust", "Ownership", "Cargo"],
  },
  {
    id: "nodejs-docs",
    title: "Node.js API Documentation",
    domain: "Backend",
    ecosystem: "web2",
    description:
      "Core modules, streams, HTTP2, WebSockets, and the event loop contract behind resilient JavaScript services.",
    video: "/videos/node.mp4",
    poster: "/videos/node.jpg",
    url: "https://nodejs.org/docs/latest/api/",
    tags: ["NodeJS", "http2", "Streams"],
  },
  {
    id: "postgres-docs",
    title: "PostgreSQL Documentation",
    domain: "Backend",
    ecosystem: "web2",
    description:
      "SQL reference, indexes, partitioning, transactions, and replication guides for the storage layer of Web2 backends.",
    video: "/videos/postgres.mp4",
    poster: "/videos/postgres.jpg",
    url: "https://www.postgresql.org/docs/",
    tags: ["Postgres", "SQL", "Data"],
  },
  {
    id: "solidity-docs",
    title: "Solidity Documentation",
    domain: "Fullstack",
    ecosystem: "web3",
    description:
      "The Solidity language spec — types, storage layout, the EVM ABI, and security patterns for audited smart contracts.",
    video: "/videos/solidity.mp4",
    poster: "/videos/solidity.jpg",
    url: "https://docs.soliditylang.org",
    tags: ["Solidity", "ABI", "EVM"],
  },
  {
    id: "ethereum-docs",
    title: "Ethereum Developer Docs",
    domain: "Fullstack",
    ecosystem: "web3",
    description:
      "Ethereum's developer hub — accounts, transactions, gas, smart contracts, and the tools to ship decentralized apps.",
    video: "/videos/ethereum.mp4",
    poster: "/videos/ethereum.jpg",
    url: "https://ethereum.org/en/developers/docs/",
    tags: ["Ethereum", "SmartContracts", "EVM"],
  },
];