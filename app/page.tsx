import Faq from "@/components/HomePage/Faq";
import Features from "@/components/HomePage/Features";
import Footer from "@/components/HomePage/Footer";
import Hero from "@/components/HomePage/Hero";

import Pricing from "@/components/HomePage/Pricing";
import Testimonials from "@/components/HomePage/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Faq />
      <Testimonials />
      <Pricing />
      <Footer />
    </>
  );
}
