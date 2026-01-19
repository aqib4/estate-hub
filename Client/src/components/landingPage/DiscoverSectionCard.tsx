import React from "react";
import Image from "next/image";

type cardProps = {
  imageSrc: string;
  title: string;
  description: string;
};

function DiscoverSectionCard({ card }: { card: cardProps }) {
  const { imageSrc, title, description } = card;
  return (
    <div className="  shadow-xs rounded-2xl bg-white p-6 flex flex-col items-center ">
      <Image
        src={imageSrc}
        alt={title}
        width={64}
        height={64}
        className={"w-16 h-16"}
      />
      <h3 className="font-semibold text-gray-800 text-center text-lg md:text-xl xl:text-2xl mb-3">
        {title}
      </h3>

      <p className="text-gray-600 text-center text-sm md:text-base flex-grow">
        {description}
      </p>
    </div>
  );
}

export default DiscoverSectionCard;
