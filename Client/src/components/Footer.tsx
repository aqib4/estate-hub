import React from "react";
import {
    Facebook,
  HomeIcon,
  Instagram,
  Linkedin,
  LocateIcon,
  Mail,
  PhoneCallIcon,
  PhoneForwardedIcon,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function Footer() {
  const exploreLinks = [
    "Apartments",
    "Flat",
    "Single Room",
    "Bed & Breakfast",
    "Condo",
    "House",
    "Studio",
  ];

  const companyLinks = ["Blogs & Press", "Listings"];

  const linkClass =
    "text-gray-800 text-[1.1rem] font-bold hover:text-red-600 flex items-center gap-2";

  return (
    <footer className="bg-gray-100">
      {/* Top Footer */}
      <div className="p-4 md:p-10 lg:p-16 flex flex-col md:flex-row gap-10 justify-between">
        {/* Logo + About */}
        <div className="flex flex-col gap-2 max-w-md">
          <Link href="/landing">
            <span className="font-quicksand text-xl lg:text-2xl font-bold flex items-center gap-2">
              <HomeIcon /> Estate <span className="text-red-500">hub</span>
            </span>
          </Link>
          <p className="font-quicksand font-medium text-gray-950 text-md md:text-lg">
            Estate Hub is a powerful booking platform that lets you run a
            residential or commercial rental business online with no hassle.
          </p>
          <Link href={"/About"} className="text-gray-600 text-4xl font-quicksand font-semibold flex items-center">
            Read More <ChevronRight size={38} className="mt-1"/>
          </Link>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-semibold text-gray-800 text-lg md:text-xl xl:text-2xl">
            Explore
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {exploreLinks.map((item) => (
              <li key={item}>
                <Link href="/landing" className={linkClass}>
                  <ChevronRight size={18} /> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-gray-800 text-lg md:text-xl xl:text-2xl">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {companyLinks.map((item) => (
              <li key={item}>
                <Link href="/landing" className={linkClass}>
                  <ChevronRight size={18} /> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 text-lg md:text-xl xl:text-2xl">
            Contact Us
          </h3>
          <address className="not-italic mt-4 flex flex-col gap-3 text-gray-700 text-[1.1rem] font-medium">
            <div className="flex items-center gap-3">
              <LocateIcon size={20} /> 142 Bay Rd, Miami Beach, FL 33139
            </div>
            <hr />
            <div className="flex items-center gap-3">
              <PhoneCallIcon size={20} /> 800 987 6543
            </div>
            <hr />
            <div className="flex items-center gap-3">
              <PhoneForwardedIcon size={20} /> 876 654 2362
            </div>
            <hr />
            <div className="flex items-center gap-3 font-bold">
              <Mail size={20} /> Estate-hub@email.com
            </div>
            <hr />
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className=" border-gray-300 py-4 text-center text-gray-600 text-lg flex flex-col lg:flex-row justify-between items-center gap-4 px-4 md:px-10 lg:px-16">
       <span>
       Estate-Hub - All rights reserved - Designed and Developed by Aqib

       </span>
       <ul className="flex items-center justify-between gap-6">
        <li>
            <Facebook size={25}/>
        </li>
        <li>
            <Instagram size={25}/>
        </li>
        <li>
            <Twitter size={25}/>
        </li>
        <li>
            <X size={25}/>
        </li>
        <li>
            <Linkedin size={25}/>
        </li>
        <li>
            <Youtube size={25}/>
        </li>
       
       </ul>
      </div>
    </footer>
  );
}

export default Footer;
