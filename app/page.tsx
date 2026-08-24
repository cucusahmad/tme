import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import CaraKerja from "@/components/landing/CaraKerja";
import Profesi from "@/components/landing/Profesi";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      <Navbar />
      <Hero />
      <About />
      <CaraKerja />
      <Profesi />
      <Footer />
    </main>
  );
}
