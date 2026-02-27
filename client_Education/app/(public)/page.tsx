import { HeroSection } from "@/components/sections/hero";
import { HighlightsSection } from "@/components/sections/highlights";
import { CoursesPreviewSection } from "@/components/sections/courses-preview";
import { StatsSection } from "@/components/sections/stats";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { CTASection } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <StatsSection />
      <CoursesPreviewSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
