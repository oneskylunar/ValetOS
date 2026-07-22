import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ScrollVideoSection from "./components/ScrollVideoSection";
import WhyValetOSSection from "./components/WhyValetOSSection";
import WhatWeOfferSection from "./components/WhatWeOfferSection";
import WorkflowSection from "./components/WorkflowSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ScrollVideoSection />
      <WhyValetOSSection />
      <WhatWeOfferSection />
      <WorkflowSection />
      <ContactSection />
      <Footer />
    </>
  );
}
