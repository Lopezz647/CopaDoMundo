import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
// Adicione outros imports se tiver copiado mais seções

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
