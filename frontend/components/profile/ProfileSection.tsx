'use client'
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the user data interface
interface UserData {
  name: string;
  avatar: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  skills: string[];
  role: string;
  education?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the interface for props
interface ProfileSectionProps {
  userData: UserData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

// Zod schema for validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  education: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

// Infer the type from the Zod schema for the form
type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditing,
  setIsEditing,
}) => {
  const [skillsInput, setSkillsInput] = useState<string>(
    userData.skills.join(", ")
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data: ProfileFormData) => {
    const updatedSkills = skillsInput
      ? skillsInput.split(",").map((skill) => skill.trim())
      : [];
    console.log({ ...data, skills: updatedSkills }); // Replace with API call to update data
    setIsEditing(false);
  };

  return (
    <div className="flex-1 p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Profile Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-gray-600 font-medium">Name</label>
              <input
                {...register("name")}
                className="mt-1 p-2 border rounded w-full"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                {...register("email")}
                className="mt-1 p-2 border rounded w-full"
                disabled
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Role</label>
              <input
                value={userData.role}
                className="mt-1 p-2 border rounded w-full"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Education
              </label>
              <input
                {...register("education")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Country</label>
              <input
                {...register("country")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">City</label>
              <input
                {...register("city")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Address</label>
              <input
                {...register("address")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Gender</label>
              <select
                {...register("gender")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 font-medium">Bio</label>
              <textarea
                {...register("bio")}
                className="mt-1 p-2 border rounded w-full min-h-[100px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 font-medium">
                Skills (comma-separated)
              </label>
              <input
                value={skillsInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSkillsInput(e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">Name</label>
              <p className="mt-1 p-2 border rounded w-full">{userData.name}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <p className="mt-1 p-2 border rounded w-full">{userData.email}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Phone Number
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.phoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Role</label>
              <p className="mt-1 p-2 border rounded w-full">{userData.role}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Education
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.education || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Country</label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.country || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">City</label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.city || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Address</label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.address || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Date of Birth
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.dateOfBirth
                  ? new Date(userData.dateOfBirth).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Gender</label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.gender || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Verified
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.isVerified ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Created At
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Updated At
              </label>
              <p className="mt-1 p-2 border rounded w-full">
                {new Date(userData.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 font-medium">Bio</label>
              <p className="mt-1 p-2 border rounded w-full min-h-[100px]">
                {userData.bio}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 font-medium">Skills</label>
              <div className="mt-1 p-2 border rounded w-full">
                {userData.skills.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {userData.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Not provided</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
