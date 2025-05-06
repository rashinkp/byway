import React from "react";
import Image from "next/image";
import { FaShareAlt } from "react-icons/fa";

// Define the props type for reusability across roles
const ProfileCard = ({
  name = "John Doe",
  avatar = "/default-avatar.png",
  email = "john.doe@example.com",
  phoneNumber = "",
  bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  skills = [],
  role = "USER", // Can be USER, INSTRUCTOR, or ADMIN
  sidebarLinks = [
    { label: "PROFILE", href: "#" },
    { label: "MY COURSES", href: "#" },
    { label: "TEACHERS", href: "#" },
    { label: "MESSAGE", href: "#" },
    { label: "MY REVIEWS", href: "#" },
    { label: "CERTIFICATES", href: "#" },
  ],
}) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        {/* Profile Section */}
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
        {/* Navigation Links */}
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">
                User Name
              </label>
              <p className="mt-1 p-2 border rounded w-full">{name}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <p className="mt-1 p-2 border rounded w-full">{email}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Phone Number
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {phoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Role</label>
              <p className="mt-1 p-2 border rounded w-full">{role}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-gray-600 font-medium">Bio</label>
            <p className="mt-1 p-2 border rounded w-full min-h-[100px]">
              {bio}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <label className="block text-gray-600 font-medium">Skills</label>
            <div className="mt-1 p-2 border rounded w-full">
              {skills.length > 0 ? (
                <ul className="list-disc pl-5">
                  {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
