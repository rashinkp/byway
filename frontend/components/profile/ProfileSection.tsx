import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";

// Define the user data interface
interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  skills: string[];
  education?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the interface for props
interface ProfileSectionProps {
  userData: UserData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  error?: string;
}

// Zod schema for validation
const profileSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: "Name must be at least 1 character long if provided",
    }),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message:
        "Phone number must be a valid international number (e.g., +1234567890)",
    }),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  education: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", ""]).optional(), // Allow empty string for "Select Gender"
});

// Infer the type from the Zod schema for the form
type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditing,
  setIsEditing,
  error,
}) => {
  const [skillsInput, setSkillsInput] = useState<string>(
    userData.skills.join(", ")
  );
  const {
    mutate: updateUserData,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...userData,
      gender: userData.gender || "", // Ensure gender defaults to empty string if undefined
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const updatedSkills = skillsInput
      ? skillsInput.split(",").map((skill) => skill.trim())
      : userData.skills; // Fallback to original skills if unchanged

    // Only include fields that have changed or are explicitly provided
    const updateData: { [key: string]: any } = {
      skills: updatedSkills.join(", "),
    };

    // Add fields to updateData only if they are provided or changed
    if (data.name !== userData.name) updateData.name = data.name || undefined;
    if (data.phoneNumber !== userData.phoneNumber)
      updateData.phoneNumber = data.phoneNumber || undefined;
    if (data.bio !== userData.bio) updateData.bio = data.bio || undefined;
    if (data.education !== userData.education)
      updateData.education = data.education || undefined;
    if (data.country !== userData.country)
      updateData.country = data.country || undefined;
    if (data.city !== userData.city) updateData.city = data.city || undefined;
    if (data.address !== userData.address)
      updateData.address = data.address || undefined;
    if (data.dateOfBirth !== userData.dateOfBirth)
      updateData.dateOfBirth = data.dateOfBirth || undefined;
    if (data.gender !== (userData.gender || ""))
      updateData.gender = data.gender || undefined;

    updateUserData(updateData);
  };

  if (error === "ACCESS_DENIED") {
    return (
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
          <p className="text-red-500">
            Your account has been deleted and cannot be accessed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Profile Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {updateError && (
          <p className="text-red-500 mb-4">{updateError.message}</p>
        )}

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
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                {...register("email")}
                className="mt-1 p-2 border rounded w-full bg-gray-100"
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                className="mt-1 p-2 border rounded w-full"
                placeholder="e.g., +1234567890"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Education
              </label>
              <input
                {...register("education")}
                className="mt-1 p-2 border rounded w-full"
              />
              {errors.education && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Country</label>
              <input
                {...register("country")}
                className="mt-1 p-2 border rounded w-full"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">City</label>
              <input
                {...register("city")}
                className="mt-1 p-2 border rounded w-full"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Address</label>
              <input
                {...register("address")}
                className="mt-1 p-2 border rounded w-full"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
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
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
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
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 font-medium">Bio</label>
              <textarea
                {...register("bio")}
                className="mt-1 p-2 border rounded w-full min-h-[100px]"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bio.message}
                </p>
              )}
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
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.skills.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">Name</label>
              <p className="mt-1 p-2 border rounded w-full">
                {userData.name || "Not provided"}
              </p>
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
                {userData.bio || "Not provided"}
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
