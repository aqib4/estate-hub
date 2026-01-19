'use client'
import React from 'react'
import FeaturedPropertyCard from "@/components/PropertyCard";
import {motion} from "framer-motion"

const itemsVariants={
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, y: 0,
    transition:{
      duration: 0.8,
    }
   },
}

function FeaturedProperties() {

    const properties = [
        {
          id: 1,
          title: "Beautiful Cave",
          image: "/property-1.jpg",
          address: "56 Forest View Dr, San Francisco, CA 9182",
          beds: 2,
          baths: 2,
          guests: 2,
          type: "Bed & Breakfast",
          rating: 4.5,
          reviews: 22,
        },
        {
          id: 2,
          title: "Modern Loft",
          image: "/property-2.jpg",
          address: "99 Sunset Blvd, Los Angeles, CA 90210",
          beds: 3,
          baths: 2,
          guests: 4,
          type: "Entire Apartment",
          rating: 4.8,
          reviews: 35,
        },
        {
          id: 3,
          title: "Cozy Cabin",
          image: "/property-3.jpg",
          address: "12 Mountain Rd, Denver, CO 80202",
          beds: 1,
          baths: 1,
          guests: 2,
          type: "Cabin Stay",
          rating: 4.3,
          reviews: 15,
        },
        {
          id: 4,
          title: "Luxury Villa",
          image: "/property-3.jpg",
          address: "500 Ocean View Ave, Miami, FL 33139",
          beds: 5,
          baths: 4,
          guests: 8,
          type: "Private Villa",
          rating: 4.9,
          reviews: 42,
        },
        {
          id: 5,
          title: "Urban Studio",
          image: "/property-2.jpg",
          address: "210 Downtown St, New York, NY 10001",
          beds: 1,
          baths: 1,
          guests: 2,
          type: "Studio Apartment",
          rating: 4.2,
          reviews: 18,
        },
        {
          id: 6,
          title: "Beachside Cottage",
          image: "/property-1.jpg",
          address: "77 Shoreline Rd, Santa Monica, CA 90401",
          beds: 2,
          baths: 2,
          guests: 4,
          type: "Cottage",
          rating: 4.7,
          reviews: 27,
        },
      ];
     
  return (
    <section className="py-[5rem] px-4 bg-[#F7F8F9] w-full">
        <h2 className="quicksand text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold text-black text-center">
          Our Features Homes
        </h2>
        <p className="font-quicksand text-gray-500 text-lg md:text-xl lg:text-2xl text-center mt-4">
          Hand-picked selection of quality places
        </p>
        {/* listings */}
        <div className="mt-8  md:px-12 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
          {properties.map((property) => (
            <motion.div 
            initial="hidden"
            variants={itemsVariants}
            whileInView="visible"
            viewport={{once:true}}
            key={property.id}
            className='max-w-4xl mx-auto' 
            >
                          <FeaturedPropertyCard  property={property} />
            </motion.div>
          ))}
         </div>
      </section>
  )
}

export default FeaturedProperties