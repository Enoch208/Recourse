import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { UseCases } from "@/components/sections/UseCases";
import { Automation } from "@/components/sections/Automation";
import { SampleLetter } from "@/components/sections/SampleLetter";
import { Footer } from "@/components/sections/Footer";
import { SectionDivider } from "@/components/primitives/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <UseCases />
        <Automation />
        <SectionDivider />
        <SampleLetter />
      </main>
      <Footer />
    </>
  );
}
