import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import CaraKerja from "@/components/landing/CaraKerja";
import Profesi from "@/components/landing/Profesi";
import Timeline from "@/components/landing/Timeline";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

     
        <About />
   
       <CaraKerja />
       <Profesi />


      <Footer />

    </>
  );
}