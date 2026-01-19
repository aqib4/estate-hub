import React from "react";

function LandingCTACard() {
  return (
    <div className=" flex flex-col gap-5  bg-slate-100/80 rounded-lg p-10 lg:p-14  px-6">
      <h1 className="font-quicksand text-xl lg:text-2xl xl:text-5xl font-bold text-black ">
        Modern Apartment
      </h1>
      <span className="font-quicksand text-gray-600 text-lg md:text-2xl lg:text-4xl ">
        $79 at Night
      </span>
      <p className="font-quicksand text-gray-600 text-lg md:text-xl lg:text-2xl  max-w-[560px]">
        Find your dream rental with ease. Explore verified listings, compare
        options, and book confidently — your perfect home awaits today.
      </p>

      <button
      className="bg-red-400 w-40 text-white rounded-md py-3 font-quicksand text-base md:text-lg font-medium hover:bg-gray-700 transition-colors duration-300">
        Book Now
      </button>
    </div>
  );
}

export default LandingCTACard;
