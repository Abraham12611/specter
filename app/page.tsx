import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import HeroSection from "@/components/HeroSection";
import TechSection from "@/components/TechSection";
import GallerySection from "@/components/GallerySection";
import SpecsSection from "@/components/SpecsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TechSection />
      <GallerySection />
      <SpecsSection />
    </main>
  );
}
