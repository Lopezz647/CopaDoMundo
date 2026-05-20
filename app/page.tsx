import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhyJoin from "@/components/landing/WhyJoin";
import HowItWorks from "@/components/landing/HowItWorks";
import ScoringSystem from "@/components/landing/ScoringSystem"; // <-- ADICIONE ESTA LINHA
import PricingCards from "@/components/landing/PricingCards";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <div className="bg-background min-h-screen font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
