import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { PoweredBy } from "@/components/sections/PoweredBy";
import { Integrations } from "@/components/sections/Integrations";
import { UseCases } from "@/components/sections/UseCases";
import { Automation } from "@/components/sections/Automation";
import { SampleLetter } from "@/components/sections/SampleLetter";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <PoweredBy />
        <Integrations />
        <UseCases />
        <Automation />
        <SampleLetter />
      </main>
      <Footer />
    </>
  );
}
