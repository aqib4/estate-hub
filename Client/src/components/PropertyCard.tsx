import React from "react";
import Image from "next/image";
import {
  BedIcon,
  ShowerHeadIcon,
  Users,
  EllipsisVertical,
  StarIcon,
} from "lucide-react";

type Property = {
  id: number;
  title: string;
  image: string;
  address: string;
  beds: number;
  baths: number;
  guests: number;
  type: string;
  rating: number;
  reviews: number;
};

function FeaturedPropertyCard({ property }: { property: Property }) {
  const { title, image, address, beds, baths, guests, type, rating, reviews } =
    property;

  return (
    <div className="shadow-xs bg-white rounded-md h-full">
      <div>
        <Image
          src={image || "/property-1.jpg"}
          alt={`Exterior view of ${title}`}
          width={400}
          height={400}
          className="rounded-t-md w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
          />
      </div>
      <div className="p-7">
        <h3 className="font-semibold text-gray-800 text-xl xl:text-2xl mb-4">
          {title}
        </h3>
        <p className="text-gray-400 text-[1.1rem]">{address}</p>

        <div className="flex flex-wrap items-center gap-4 text-gray-700 mt-4">
          <span className="flex items-center gap-2 text-[14px]">
            <BedIcon /> {beds} Beds
          </span>
          <span className="flex items-center gap-2 text-[14px]">
            <ShowerHeadIcon /> {baths} Baths
          </span>
          <span className="flex items-center gap-2 text-[14px]">
            <Users /> {guests} Guests · {type}
          </span>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <StarIcon size={18} className="text-gray-800" />
            <span className="text-gray-900 text-lg font-semibold">
              {rating} ({reviews} Reviews)
            </span>
          </div>
          <EllipsisVertical className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default FeaturedPropertyCard;
