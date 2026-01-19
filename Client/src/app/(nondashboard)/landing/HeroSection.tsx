'use client'
import React from 'react'
import {motion} from "framer-motion"

const containerVariants={
    hidden:{opacity:0,y:35},
    visible:{opacity:1,y:0,
             transition:{duration:0.8,staggerChildren:0.3}
            },
    }


function HeroSection() {
  return (
    <section
    className="h-screen flex flex-col items-center justify-center p-4"
    style={{
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/landing-splash.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    }}
  >
   <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{once:true}}
    variants={containerVariants}
    className='text-center'
   >
   <span
      className="font-quicksand text-red-300 text-lg md:text-2xl lg:text-4xl "
      style={{
        WebkitTextStroke: "1px white", // stroke thickness + color
        WebkitTextFillColor: "transparent", // optional: make inside transparent
      }}
    >
      Discover Your Dream Home with Us
    </span>
    <h1 className="font-quicksand text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-white ">
      Find Your Perfect <br /> Property Today
    </h1>
    <div className="mt-6 lg:mt-10 flex justify-center w-full text-lg md:text-xl ">
      <input
        type="search"
        placeholder="Search by city, neighbourhood, or address"
        className="w-[16rem] lg:w-[30rem] xl:w-[36rem] p-3 xl:p-5 rounded-l-md"
      />
      <button className="bg-red-400 text-white px-4 py-2 rounded-r-md hover:bg-red-500">
        Search
      </button>
    </div>
   </motion.div>
  </section>
  )
}

export default HeroSection