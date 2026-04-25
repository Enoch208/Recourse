import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Integrations } from "@/components/sections/Integrations";
import { UseCases } from "@/components/sections/UseCases";
import { Automation } from "@/components/sections/Automation";
import { ExploreCTA } from "@/components/sections/ExploreCTA";
import { Footer } from "@/components/sections/Footer";
import { SectionDivider } from "@/components/primitives/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <Integrations />
        <UseCases />
        <Automation />
        <SectionDivider />
        <ExploreCTA />
      </main>
      <Footer />
    </>
  );
}
