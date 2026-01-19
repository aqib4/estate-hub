
'use client'
import React from "react";
import { motion } from "framer-motion";
import DiscoverSectionCard from "@/components/landingPage/DiscoverSectionCard";

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

function DiscoverSection() {
  const discoverItems = [
    {
      imageSrc: "/landing-icon-wand.png",
      title: "Search for Properties",
      description:
        "Browse through our extensive collection of rental properties in your area.",
    },
    {
      imageSrc: "/landing-icon-calendar.png",
      title: "Book Your Rental",
      description:
        "Browse through our extensive collection of rental properties in your area.",
    },
    {
      imageSrc: "/landing-icon-heart.png",
      title: "Search for Properties",
      description:
        "Browse through our extensive collection of rental properties in your area.",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-[5rem] px-4 bg-[#F7F8F9] w-full "
    >
      <motion.h2
        variants={itemsVariants}
        className="quicksand text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold text-black text-center"
      >
        Discover
      </motion.h2>
      <p className="font-quicksand text-gray-600 text-lg md:text-xl lg:text-2xl text-center">
        Find Your Dream Rental Property today{" "}
      </p>

      <motion.div
        variants={containerVariants}
        className=" xl:max-w-8xl mx-auto mt-10 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "
      >
        {discoverItems.map((card,index) => (
          <motion.div key={index} variants={itemsVariants}>
            <DiscoverSectionCard card={card} />
          </motion.div> 
        ))}
      </motion.div>
    </motion.section>
  );
}

export default DiscoverSection;
