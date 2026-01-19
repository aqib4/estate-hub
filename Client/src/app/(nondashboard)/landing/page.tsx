import React from "react";
import WebsiteFeatures from "./WebsiteFeatures";
import HeroSection from "./HeroSection";
import FeaturedProperties from "./FeaturedProperties";
import DiscoverSection from "./DiscoverSection";
import CTASection from "./CTASection";

function Page() {
  

  
  return (
    <>
      {/* Hero section */}
       <HeroSection />

       {/* Website Features Section */}
       <WebsiteFeatures />

      {/* featured properties */}
      <FeaturedProperties/>

      {/* Discover Section */}
      <DiscoverSection /> 

      {/* CTA Section */}
      <CTASection/>
    </>
  );
}

export default Page;
