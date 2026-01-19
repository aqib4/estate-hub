import React from "react";
import Image from "next/image";

type CardProps = {
  imageURL: string;
  title: string;
  description: string;
  buttonText: string;
};



function WebsiteFeaturesCard({ card }: { card: CardProps }) {
  const { imageURL, title, description, buttonText } = card;

  return (
    <div
     
      className="  shadow-xs rounded-2xl bg-white p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 h-full"
    >
      <Image
        src={imageURL}
        alt={title}
        width={400}
        height={400}
        className="w-full h-full object-contain mb-6"
      />

      <h3 className="font-semibold text-gray-800 text-center text-lg md:text-xl xl:text-2xl mb-3">
        {title}
      </h3>

      <p className="text-gray-600 text-center text-sm md:text-base flex-grow">
        {description}
      </p>

      <button className="bg-gray-900 text-white rounded-md mt-6 px-6 py-2 font-quicksand text-base md:text-lg font-medium hover:bg-gray-700 transition-colors duration-300">
        {buttonText}
      </button>
    </div>
  );
}

export default WebsiteFeaturesCard;
