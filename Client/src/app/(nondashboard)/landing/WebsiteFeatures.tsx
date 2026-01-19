'use client';
import React from "react";
import WebsiteFeaturesCard from "@/components/landingPage/WebsiteFeaturesCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.3 },
  },
};

const itemsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function WebsiteFeatures() {
  const rentalCards = [
    {
      id: 1,
      imageURL: "/landing-search1.png",
      title: "Trustworthy and Verified Listings",
      description:
        "Discover the best rental options with user reviews and ratings.",
      buttonText: "Explore",
    },
    {
      id: 2,
      imageURL: "/landing-search2.png",
      title: "Browse Rental Listings with Ease",
      description:
        "Get access to user reviews and ratings for a better understanding of rental options.",
      buttonText: "Search",
    },
    {
      id: 3,
      imageURL: "/landing-search3.png",
      title: "Simplify Your Rental Search with Advanced",
      description:
        "Find trustworthy and verified rental listings to ensure a hassle-free experience.",
      buttonText: "Discover",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-[10rem] px-4 bg-[#F7F8F9] w-full "
    >
      <motion.h2
        variants={itemsVariants}
        className="quicksand text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold text-black text-center"
      >
        Quickly find your dream home <br /> using our advanced search filters
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className=" xl:max-w-8xl mx-auto mt-10 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
      >
        {rentalCards.map((card) => (
          <motion.div key={card.id} variants={itemsVariants} >
            <WebsiteFeaturesCard card={card} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default WebsiteFeatures;
