import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Briefcase,
  Edit,
} from "lucide-react";
import { User } from "@/types/user";

interface UserProfile {
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  education?: string;
  skills?: string | string[];
}


interface ProfileSectionProps {
  user: User | undefined;
  setIsModalOpen: (open: boolean) => void;
}

export default function ProfileSection({
  user,
  setIsModalOpen,
}: ProfileSectionProps) {
  return (
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
            <p className="text-gray-600">{user?.bio || "No bio set"}</p>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user?.email || "Not set"}</p>
              </div>
            </div>
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
                    ? `${user?.address}, ${user?.city || ""}, ${
                        user?.country || ""
                      }`
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-800">
                  {user?.dateOfBirth
                    ? new Date(user?.dateOfBirth).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-800">{user?.gender || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p className="text-gray-800">{user?.education || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Skills</p>
                <p className="text-gray-800">
                  {Array.isArray(user?.skills)
                    ? user?.skills.join(", ")
                    : user?.skills || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
