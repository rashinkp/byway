"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { X, Save, Loader2 } from "lucide-react";
import { Path } from "react-hook-form";
import FileUploadComponent, {
	FileUploadStatus,
} from "@/components/FileUploadComponent";
import Image from "next/image";

export interface FormFieldConfig<T> {
	name: keyof T;
	label: string;
	type: "input" | "textarea" | "select" | "checkbox" | "radio" | "file";
	fieldType?: "text" | "number" | "email" | "password" | "file" | "date";
	placeholder?: string;
	description?: string;
	options?: { value: string; label: string }[];
	maxLength?: number;
	disabled?: boolean;
	accept?: string;
	maxSize?: number;
	fileTypeLabel?: string;
	uploadStatus?: FileUploadStatus;
	uploadProgress?: number;
	min?: number;
	max?: number;
	step?: number;
}

interface FormModalProps<T extends z.ZodType> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: z.infer<T>) => Promise<void>;
	schema: T;
	initialData?: Partial<z.infer<T>>;
	title: string;
	submitText: string;
	fields: FormFieldConfig<z.infer<T>>[];
	description?: string;
	isSubmitting?: boolean;
}

export function FormModal<T extends z.ZodType>({
	open,
	onOpenChange,
	onSubmit,
	schema,
	initialData,
	title,
	submitText,
	fields,
	description,
	isSubmitting: externalSubmitting,
}: FormModalProps<T>) {
	const [internalSubmitting, setInternalSubmitting] = useState(false);
	const isSubmitting = externalSubmitting || internalSubmitting;
	const defaultValues = useMemo(
		() =>
			({
				...Object.fromEntries(
					fields.map((field) => [
						field.name,
						field.type === "input" && field.fieldType === "number"
							? undefined
							: field.type === "input" && field.fieldType === "date"
								? undefined
								: field.type === "input" || field.type === "textarea"
									? ""
									: field.fieldType === "file"
										? undefined
										: undefined,
					]),
				),
			}) as z.infer<T>,
		[fields],
	);
	
	const form = useForm<z.infer<T>>({
		resolver: zodResolver(schema as any),
		defaultValues: initialData
			? { ...defaultValues, ...initialData }
			: defaultValues,
	});

	useEffect(() => {
		if (open) {
			form.reset(
				initialData ? { ...defaultValues, ...initialData } : defaultValues,
			);
		}
	}, [open, initialData, form, defaultValues]);

	const handleSubmit = async (data: z.infer<T>) => {
		try {
			setInternalSubmitting(true);
			await onSubmit(data);
			form.reset();
		} catch (error: unknown) {
			console.error("Error submitting form:", error);
			const errorMessage = error instanceof Error ? error.message : "Failed to submit the form";
			form.setError("root", {
				message: errorMessage,
			});
		} finally {
			setInternalSubmitting(false);
		}
	};

	// Categorize fields
	const inputFields = fields.filter(
		(field) =>
			(field.type === "input" &&
				(field.fieldType === "text" ||
					field.fieldType === "number" ||
					field.fieldType === "date")) ||
			field.type === "select",
	);
	const textareaFields = fields.filter((field) => field.type === "textarea");
	const fileFields = fields.filter(
		(field) => field.type === "input" && field.fieldType === "file",
	);

	// Calculate columns for input fields (left and right, max 5 per column)
	const maxFieldsPerColumn = 5;
	const numInputColumns = Math.min(
		2,
		Math.ceil(inputFields.length / maxFieldsPerColumn),
	);
	const inputColumns: FormFieldConfig<z.infer<T>>[][] = Array.from(
		{ length: numInputColumns },
		() => [],
	);
	inputFields.forEach((field, index) => {
		const columnIndex = index % numInputColumns; // Alternate between left and right
		inputColumns[columnIndex].push(field);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0 bg-white dark:bg-[#18181b] border-none">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle className="text-xl font-bold text-black dark:text-[#facc15]">
						{title}
					</DialogTitle>
					{description && (
						<DialogDescription className="text-gray-500 dark:text-gray-300">
							{description}
						</DialogDescription>
					)}
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-y-auto px-6">
						{form.formState.errors.root && (
							<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl p-4 mb-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-red-600 dark:text-red-400"
											viewBox="0 0 20 20"
											fill="currentColor"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm text-red-700 dark:text-red-300">
											{form.formState.errors.root.message}
										</p>
									</div>
								</div>
							</div>
						)}
						{/* Input fields (text, number, date, select) in columns */}
						{inputFields.length > 0 && (
							<div
								className={`grid grid-cols-1 sm:grid-cols-${numInputColumns} gap-6 mb-6`}
							>
								{inputColumns.map((columnFields, colIndex) => (
									<div key={colIndex} className="space-y-6">
										{columnFields.map((field) => (
											<FormField
												key={String(field.name)}
												control={form.control}
												name={field.name as Path<z.infer<T>>}
												render={({ field: formField }) => (
													<FormItem>
														<FormLabel className="text-sm font-normal text-black dark:text-[#facc15]">
															{field.label}
														</FormLabel>
														<FormControl>
															{field.type === "input" ? (
																<Input
																	type={field.fieldType || "text"}
																	placeholder={field.placeholder}
																	{...formField}
																	value={
																		field.fieldType === "number"
																			? (formField.value ?? "")
																			: field.fieldType === "date" &&
																					formField.value
																				? typeof formField.value === "string"
																					? formField.value.split("T")[0] // Ensure YYYY-MM-DD format for date input
																					: new Date(formField.value)
																							.toISOString()
																							.split("T")[0]
																				: typeof formField.value === "string"
																					? formField.value
																					: ""
																	}
																	onChange={
																		field.fieldType === "number"
																			? (e) =>
																					formField.onChange(
																						e.target.value
																							? Number(e.target.value)
																							: undefined,
																					)
																			: field.fieldType === "date"
																				? (e) =>
																						formField.onChange(
																							e.target.value
																								? new Date(
																										e.target.value,
																									).toISOString()
																								: undefined,
																						)
																				: formField.onChange
																	}
																	className="h-10 border-none bg-[#f9fafb] dark:bg-[#232323] text-black dark:text-white focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] rounded-md"
																	disabled={isSubmitting || field.disabled}
																/>
															) : field.type === "select" && field.options ? (
																<Select
																	value={formField.value as string}
																	onValueChange={formField.onChange}
																	disabled={isSubmitting || field.disabled}
																>
																	<SelectTrigger className="border-[#facc15] dark:border-[#facc15] bg-white dark:bg-[#18181b] text-black dark:text-white focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] rounded-md">
																		<SelectValue
																			placeholder={
																				field.placeholder || "Select an option"
																			}
																		/>
																	</SelectTrigger>
																	<SelectContent className="bg-white dark:bg-[#18181b] text-black dark:text-white border-[#facc15] dark:border-[#facc15]">
																		{field.options.map((option) => (
																			<SelectItem
																				key={option.value}
																				value={option.value}
																				className="hover:bg-[#facc15]/20 dark:hover:bg-[#facc15]/20"
																			>
																				{option.label}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															) : null}
														</FormControl>
														{field.description && (
															<FormDescription className="text-gray-500 dark:text-gray-300">
																{field.description}
															</FormDescription>
														)}
														<FormMessage className="text-red-600 dark:text-red-400" />
													</FormItem>
												)}
											/>
										))}
									</div>
								))}
							</div>
						)}
						{/* Textarea fields (full width) */}
						{textareaFields.length > 0 && (
							<div className="space-y-6 mb-6">
								{textareaFields.map((field) => (
									<FormField
										key={String(field.name)}
										control={form.control}
										name={field.name as Path<z.infer<T>>}
										render={({ field: formField }) => (
											<FormItem>
												<FormLabel className="text-sm font-normal text-black dark:text-[#facc15]">
													{field.label}
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder={field.placeholder}
														{...formField}
														className="min-h-24 resize-y rounded-xl border-none bg-[#f9fafb] dark:bg-[#232323] text-black dark:text-white focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
														disabled={isSubmitting || field.disabled}
													/>
												</FormControl>
												{field.description && (
													<FormDescription className="text-gray-500 dark:text-gray-300">
														{field.description}
													</FormDescription>
												)}
												<FormMessage className="text-red-600 dark:text-red-400" />
											</FormItem>
										)}
									/>
								))}
							</div>
						)}
						{/* File fields (full width) with thumbnail preview */}
						{fileFields.length > 0 && (
							<div className="space-y-6 mb-6">
								{fileFields.map((field) => (
									<FormField
										key={String(field.name)}
										control={form.control}
										name={field.name as Path<z.infer<T>>}
										render={({ field: formField }) => (
											<FormItem>
												<FormLabel className="text-sm font-normal text-black dark:text-[#facc15]">
													{field.label}
												</FormLabel>
												{typeof formField.value === "string" &&
													formField.value && (
														<div className="mb-4">
															<Image
																src={formField.value}
																alt={`${field.label} preview`}
																className="w-32 h-32 object-cover rounded-md border-[#facc15] dark:border-[#facc15]"
																width={128}
																height={128}
															/>
														</div>
													)}
												<FormControl>
													<FileUploadComponent
														label={field.label}
														accept={field.accept || "*/*"}
														maxSize={field.maxSize || 10 * 1024 * 1024}
														fileTypeLabel={field.fileTypeLabel || "file"}
														onFileChange={(file, error) => {
															formField.onChange(file || formField.value);
															if (error) {
																form.setError(field.name as Path<z.infer<T>>, {
																	message: error,
																});
															} else {
																form.clearErrors(
																	field.name as Path<z.infer<T>>,
																);
															}
														}}
														error={form.formState.errors[
															field.name
														]?.message?.toString()}
														uploadStatus={
															field.uploadStatus || FileUploadStatus.IDLE
														}
														uploadProgress={field.uploadProgress || 0}
													/>
												</FormControl>
												{field.description && (
													<FormDescription className="text-gray-500 dark:text-gray-300">
														{field.description}
													</FormDescription>
												)}
												{field.type !== "input" ||
												field.fieldType !== "file" ? (
													<FormMessage className="text-red-600 dark:text-red-400" />
												) : null}
											</FormItem>
										)}
									/>
								))}
							</div>
						)}
						<DialogFooter className="pt-6 pb-6 bg-white dark:bg-[#18181b] border-t border-[#facc15] dark:border-[#facc15] sticky bottom-0 px-6">
							<Button
								type="button"
								variant="link"
								onClick={() => onOpenChange(false)}
								disabled={isSubmitting}
							>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										{submitText}
									</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
