import { CallToAction } from "@/components/custom/CallToAction";
import { EventHighlights } from "@/components/custom/EventsHighlights";
import { Footer } from "@/components/custom/Footer";
import { Hero } from "@/components/custom/Hero";
import { HowItWorks } from "@/components/custom/HowItWorks";

export default function Home() {
  return (
    <div>
      <Hero />
      <EventHighlights />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
}
