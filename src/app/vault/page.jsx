import DocsStore from "@/components/store/DocsStore";

export const metadata = {
  title: "Resource Vault — DevForge Docs & Video Library",
  description:
    "Looping code reels and sandboxed official documentation for React, Next.js, Rust, Solana, Anchor, Solidity, and more. Browse the DevForge Resource Vault.",
};

export default function StorePage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <DocsStore />
    </main>
  );
}