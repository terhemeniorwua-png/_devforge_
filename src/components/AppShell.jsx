"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HIDE_CHROME = ["/join", "/dashboard", "/instructor/dashboard"];
const HIDE_CHROME_PREFIXES = ["/admin"];

export default function AppShell({ children }) {
  const pathname = usePathname();

  const hideChrome =
    HIDE_CHROME.includes(pathname) ||
    HIDE_CHROME_PREFIXES.some((p) => pathname.startsWith(p));

  if (hideChrome) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}