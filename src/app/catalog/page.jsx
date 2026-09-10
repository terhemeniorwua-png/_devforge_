import CourseCatalog from "@/components/landing/CourseCatalog";

export const metadata = {
  title: "Course Catalog — DevForge Tracks",
  description:
    "Browse DevForge engineering tracks across Frontend, Backend, and Fullstack — spanning Web2 APIs to on-chain Web3 smart contracts. Every module runs in your browser.",
};

export default function CatalogPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <CourseCatalog />
    </main>
  );
}