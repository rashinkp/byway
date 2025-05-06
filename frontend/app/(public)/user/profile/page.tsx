"use client";

import { useState } from "react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Briefcase,
  Edit,
} from "lucide-react";
import { FormFieldConfig, FormModal } from "@/components/ui/FormModal";
import { useUserData } from "@/hooks/user/useUserData";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { cn } from "@/utils/cn";

// Zod schema for profile validation
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  education: z
    .string()
    .max(200, "Education must be less than 200 characters")
    .optional(),
  skills: z
    .string()
    .max(200, "Skills must be less than 200 characters")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone number")
    .optional(),
  country: z
    .string()
    .max(100, "Country must be less than 100 characters")
    .optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

// Form field configurations
const formFields: FormFieldConfig<z.infer<typeof profileSchema>>[] = [
  {
    name: "name",
    label: "Full Name",
    type: "input",
    fieldType: "text",
    placeholder: "Enter your full name",
    description: "Your full name as you want it displayed",
  },
  {
    name: "avatar",
    label: "Profile Picture URL",
    type: "input",
    fieldType: "text",
    placeholder: "Enter image URL",
    description: "URL to your profile picture",
  },
  {
    name: "bio",
    label: "Bio",
    type: "textarea",
    placeholder: "Tell us about yourself",
    description: "A brief description about yourself (max 500 characters)",
  },
  {
    name: "education",
    label: "Education",
    type: "input",
    fieldType: "text",
    placeholder: "Your educational background",
    description: "Your highest degree or current education",
  },
  {
    name: "skills",
    label: "Skills",
    type: "input",
    fieldType: "text",
    placeholder: "Comma-separated skills",
    description: "List your professional skills",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "input",
    fieldType: "text",
    placeholder: "+1234567890",
    description: "Your contact phone number",
  },
  {
    name: "country",
    label: "Country",
    type: "input",
    fieldType: "text",
    placeholder: "Your country",
  },
  {
    name: "city",
    label: "City",
    type: "input",
    fieldType: "text",
    placeholder: "Your city",
  },
  {
    name: "address",
    label: "Address",
    type: "input",
    fieldType: "text",
    placeholder: "Your address",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "input",
    fieldType: "text",
    placeholder: "YYYY-MM-DD",
    description: "Your date of birth in YYYY-MM-DD format",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
      { value: "OTHER", label: "Other" },
    ],
    placeholder: "Select gender",
  },
];

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUserData();
  const { mutate, isLoading: isUpdating } = useUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">{error.message}</div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "professional", label: "Professional", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">User Dashboard</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "flex items-center w-full px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors",
                activeSection === item.id && "bg-blue-50 text-blue-600"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">
              User Profile
            </CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-8">
              <Avatar className="h-24 w-24 mr-6">
                <AvatarImage src={user?.avatar} alt="Profile" />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user?.name}
                </h2>
                <p className="text-gray-600">{user?.bio}</p>
              </div>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-800">
                        {user?.dateOfBirth || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-gray-800">
                        {user?.gender || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "contact" && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-gray-800">
                        {user?.phoneNumber || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">
                        {user?.address
                          ? `${user.address}, ${user.city || ""}, ${
                              user.country || ""
                            }`
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "professional" && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Education</p>
                      <p className="text-gray-800">
                        {user?.education || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Skills</p>
                      <p className="text-gray-800">
                        {user?.skills || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      {/* Edit Profile Modal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        schema={profileSchema}
        initialData={user ? {...user, skills: user.skills?.join(', ')} : undefined}
        title="Edit Profile"
        submitText="Save Changes"
        fields={formFields}
        description="Update your profile information below."
        isSubmitting={isUpdating}
      />
    </div>
  );
}
