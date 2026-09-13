import Hero from "@/components/landing/Hero";
import CourseCatalog from "@/components/landing/CourseCatalog";
import Features from "@/components/landing/Features";
import FeatureMatrix from "@/components/landing/FeatureMatrix";
import StatsBanner from "@/components/landing/StatsBanner";
import CtaBanner from "@/components/landing/CtaBanner";

export default function Page() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <CourseCatalog />
      <Features />
      <FeatureMatrix />
      <StatsBanner />
      <CtaBanner />
    </main>
  );
}