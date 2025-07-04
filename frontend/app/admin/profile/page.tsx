"use client";

import ProfileSection from "@/components/profile/ProfileSection";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDetailedUserData } from "@/hooks/user/useDetailedUserData";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function AdminProfilePage() {
	const { data: user, isLoading, error } = useDetailedUserData();
	const [isModalOpen, setIsModalOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<ErrorDisplay
				error={error}
				title="Something went wrong"
				description="An error occurred while loading your profile."
			/>
		);
	}

	if (!user) {
		return (
			<ErrorDisplay
				error={"No user data found"}
				title="No user data found"
				description="Please try logging in again."
			/>
		);
	}

	return (
		<div className="">
			<ProfileSection user={user} setIsModalOpen={setIsModalOpen} />
			<EditProfileForm
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				user={user}
			/>
		</div>
	);
}
