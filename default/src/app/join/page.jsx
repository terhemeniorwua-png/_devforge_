import AuthClient from "@/components/auth/AuthClient";

export const metadata = {
  title: "Sign In or Create Account — DevForge",
  description:
    "Sign in to your DevForge account or forge a new one. Fork a track across Frontend, Backend, and Fullstack — Web2 and Web3.",
};

export default function JoinPage() {
  return <AuthClient />;
}