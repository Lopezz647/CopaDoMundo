"use client";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhyJoin from "@/components/landing/WhyJoin";
import HowItWorks from "@/components/landing/HowItWorks";
import ScoringSystem from "@/components/landing/ScoringSystem"; // <-- ADICIONE ESTA LINHA
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <WhyJoin />
        <HowItWorks />  
        <ScoringSystem />       
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
