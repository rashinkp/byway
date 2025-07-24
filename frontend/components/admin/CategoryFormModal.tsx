"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryFormData } from "@/types/category";

const categoryFormSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
	description: z.string().optional(),
});

interface CategoryFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: CategoryFormData) => void;
	initialData?: {
		name: string;
		description?: string;
	};
	title: string;
	submitText: string;
}

export default function CategoryFormModal({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	title,
	submitText,
}: CategoryFormModalProps) {
	const form = useForm<CategoryFormData>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			name: initialData?.name || "",
			description: initialData?.description || "",
		},
	});

	React.useEffect(() => {
		if (open && initialData) {
			form.reset({
				name: initialData.name,
				description: initialData.description || "",
			});
		} else if (open && !initialData) {
			form.reset({
				name: "",
				description: "",
			});
		}
	}, [open, initialData, form]);

	const handleSubmit = (data: CategoryFormData) => {
		onSubmit(data);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] bg-white/80 dark:bg-[#232323] border border-gray-200 dark:border-gray-700">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-black dark:text-white">{title}</DialogTitle>
					<DialogDescription className="text-gray-700 dark:text-gray-300">
						{initialData
							? "Update the category information below."
							: "Add a new category by filling out the form below."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter category name" {...field} className="bg-white/80 dark:bg-[#18181b] text-black dark:text-white border border-gray-200 dark:border-gray-700" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700 dark:text-gray-300">Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter category description (optional)"
											className="resize-none bg-white/80 dark:bg-[#18181b] text-black dark:text-white border border-gray-200 dark:border-gray-700"
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								onClick={() => onOpenChange(false)}
								className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								Cancel
							</Button>
							<Button type="submit" className="bg-[#facc15] hover:bg-yellow-400 text-black dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b] font-semibold">
								{submitText}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
