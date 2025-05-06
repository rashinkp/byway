import React from "react";
import Image from "next/image";
import { FaShareAlt } from "react-icons/fa";

// Define the interface for props
interface SidebarProfileProps {
  name: string;
  avatar: string;
  sidebarLinks: { label: string; href: string }[];
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({
  name,
  avatar,
  sidebarLinks,
}) => {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={avatar}
            alt={`${name}'s avatar`}
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <button className="mt-2 flex items-center mx-auto text-gray-600 hover:text-blue-600">
          <FaShareAlt className="mr-2" />
          Share profile
        </button>
      </div>
      <nav className="mt-4">
        {sidebarLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={`block px-6 py-3 text-gray-700 hover:bg-blue-600 hover:text-white ${
              link.label === "PROFILE" ? "bg-blue-600 text-white" : ""
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SidebarProfile;
