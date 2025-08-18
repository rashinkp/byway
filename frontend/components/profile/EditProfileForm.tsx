"use client";
import { z } from "zod";
import {  FormModal } from "@/components/ui/FormModal";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import {  getProfilePresignedUrl, uploadFileToS3 } from "@/api/file";
import { EditProfileFormProps } from "@/types/user";
import { formFields, profileSchema } from "@/lib/validations/user";


export default function EditProfileForm({
	open,
	onOpenChange,
	user,
}: EditProfileFormProps) {
	const { mutateAsync: updateUserAsync, isLoading: isUpdating } = useUpdateUser();

	const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
		if (isUpdating) return; // Prevent double submission
		let avatarUrl: string | undefined;

		// If avatar is a File, upload to S3
		if (data.avatar instanceof File) {
			try {
				const { uploadUrl, fileUrl } = await getProfilePresignedUrl(
					data.avatar.name,
					data.avatar.type,
					user?.id || '',
				);
				await uploadFileToS3(data.avatar, uploadUrl);
				avatarUrl = fileUrl; // Set the S3 URL
			} catch {
				throw new Error("Failed to upload profile picture");
			}
		} else {
			// If avatar is a string (URL or empty), use it directly
			avatarUrl = typeof data.avatar === "string" ? data.avatar : undefined;
		}

		const transformedData = {
			...data,
			avatar: avatarUrl, // Ensure avatar is string | undefined
			skills:
				typeof data.skills === "string" && data.skills
					? data.skills
							.split(",")
							.map((s: string) => s.trim())
							.join(", ")
					: undefined,
		};

		try {
			// Wait for the update to complete
			await updateUserAsync(transformedData);
			// Close the modal only after successful update
			onOpenChange(false);
		} catch {
			// Error is already handled in the mutation's onError callback
		}
	};

	// Prepare initial form data from user object
	const initialData = user
		? {
				name: user.name || "",
				avatar: user.avatar || "",
				bio: user?.bio || "",
				education: user?.education || "",
				skills: Array.isArray(user?.skills)
					? user.skills.join(", ")
					: user?.skills || "",
				phoneNumber: user?.phoneNumber || "",
				country: user?.country || "",
				city: user?.city || "",
				address: user?.address || "",
				dateOfBirth: user?.dateOfBirth
					? new Date(user.dateOfBirth).toISOString().split("T")[0]
					: undefined,
				gender: user?.gender || undefined,
			}
		: undefined;

	return (
		<FormModal
			open={open}
			onOpenChange={isUpdating ? () => {} : onOpenChange}
			onSubmit={handleSubmit}
			schema={profileSchema}
			initialData={initialData}
			title="Edit Profile"
			submitText="Save Changes"
			fields={formFields}
			description="Update your profile information below."
			isSubmitting={isUpdating}
		/>
	);
}
