import { ArchitectZone } from "@/components/sections/ArchitectZone";
import { Catalog } from "@/components/sections/Catalog";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { Decors } from "@/components/sections/Decors";
import { FactoryDirect } from "@/components/sections/FactoryDirect";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Catalog />
      <FactoryDirect />
      <Gallery />
      <Decors />
      <ArchitectZone />
      <Process />
      <Contact />
      <Certificates />
    </>
  );
}
