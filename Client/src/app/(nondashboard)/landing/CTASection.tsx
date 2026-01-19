import LandingCTACard from "@/components/landingPage/LandingCTACard";
import React from "react";

function CTASection() {
  return (
    <section
      className="w-full h-[600px] flex flex-col items-start justify-center  px-5 lg:px-32  rounded-lg"
      style={{
        backgroundImage: "url('/bg-cta.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "bottom-center",
        backgroundRepeat: "no-repeat",
      }}
    >
       <LandingCTACard/>

    </section>
  );
}

export default CTASection;
