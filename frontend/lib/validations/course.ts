import { z } from "zod";

export const courseEditSchema = z
	.object({
		title: z
			.string()
			.min(1, "Title is required")
			.refine((value) => value.trim().length > 0, {
				message: "Title cannot contain only whitespace",
				path: ["title"],
			}),
		description: z.string().optional().nullable(),
		level: z.enum(["BEGINNER", "MEDIUM", "ADVANCED"]),
		price: z.number().min(0, "Price cannot be negative"),
		duration: z
			.number()
			.min(0, "Duration cannot be negative")
			.optional()
			.nullable(),
		offer: z.number().min(0, "Offer price cannot be negative"),
		status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
			errorMap: () => ({ message: "Status is required" }),
		}),
		thumbnail: z
			.union([z.instanceof(File), z.string().url()])
			.optional()
			.nullable(),
		categoryId: z.string().nonempty("Category is required"),
		prerequisites: z
			.string()
			.max(2000, "Prerequisites cannot exceed 2000 characters")
			.optional()
			.nullable(),
		longDescription: z
			.string()
			.max(5000, "Detailed description cannot exceed 5000 characters")
			.optional()
			.nullable(),
		objectives: z
			.string()
			.max(2000, "Objectives cannot exceed 2000 characters")
			.optional()
			.nullable(),
		targetAudience: z
			.string()
			.max(2000, "Target audience cannot exceed 2000 characters")
			.optional()
			.nullable(),
		adminSharePercentage: z
			.number()
			.min(0, "Admin share must be positive")
			.max(100, "Admin share cannot exceed 100%")
			.default(20),
	})
	.refine(
		(data) => {
			if (data.thumbnail instanceof File) {
				return data.thumbnail.size <= 5 * 1024 * 1024; // 5MB
			}
			return true;
		},
		{
			message: "Thumbnail must be an image file under 5MB",
			path: ["thumbnail"],
		},
	)
	.refine(
		(data) => {
			if (
				data.offer !== undefined &&
				data.offer !== null &&
				data.price !== undefined &&
				data.price !== null
			) {
				return data.offer <= data.price;
			}
			return true;
		},
		{
			message: "Offer price must be less than or equal to actual price",
			path: ["offer"],
		},
	);

export const courseSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(3, "Title must be at least 3 characters")
			.max(100, "Title cannot exceed 100 characters")
			.nonempty("Title is required")
			.refine((value) => value.trim().length > 0, {
				message: "Title cannot contain only whitespace",
				path: ["title"],
			})
			.refine((value) => /^[a-zA-Z0-9\s\-_.,!?()]+$/.test(value), {
				message: "Title contains invalid characters",
				path: ["title"],
			}),
		description: z
			.string()
			.trim()
			.min(10, "Description must be at least 10 characters")
			.max(1000, "Description cannot exceed 1000 characters")
			.optional()
			.nullable()
			.refine((value) => !value || value.trim().length >= 10, {
				message: "Description must be at least 10 characters if provided",
				path: ["description"],
			}),
		level: z
			.enum(["BEGINNER", "MEDIUM", "ADVANCED"], {
				required_error: "Level is required",
				invalid_type_error: "Level must be BEGINNER, MEDIUM, or ADVANCED",
			})
			.refine((val) => val !== undefined, "Level is required"),
		price: z
			.number({
				required_error: "Price is required",
				invalid_type_error: "Price must be a number",
			})
			.min(0, "Price cannot be negative")
			.max(99999.99, "Price cannot exceed $99,999.99")
			.refine((val) => Number.isFinite(val), "Price must be a valid number"),
		thumbnail: z
			.union([
				z.instanceof(File).refine(
					(file) => file.size <= 5 * 1024 * 1024,
					"Thumbnail must be under 5MB"
				).refine(
					(file) => file.type.startsWith('image/'),
					"Thumbnail must be an image file"
				),
				z.string().url("Thumbnail must be a valid URL")
			])
			.optional()
			.nullable(),
		duration: z
			.number({
				invalid_type_error: "Duration must be a number",
			})
			.min(1, "Duration must be at least 1 minute")
			.max(10080, "Duration cannot exceed 1 week (10,080 minutes)")
			.optional()
			.nullable()
			.refine((val) => !val || Number.isInteger(val), {
				message: "Duration must be a whole number",
				path: ["duration"],
			}),
		offer: z
			.number({
				required_error: "Offer price is required",
				invalid_type_error: "Offer price must be a number",
			})
			.min(0, "Offer price cannot be negative")
			.max(99999.99, "Offer price cannot exceed $99,999.99")
			.refine((val) => Number.isFinite(val), "Offer price must be a valid number"),
		categoryId: z
			.string({
				required_error: "Category is required",
				invalid_type_error: "Category must be a string",
			})
			.nonempty("Category is required")
			.refine((val) => val.length >= 1, "Category is required"),
		prerequisites: z
			.string()
			.trim()
			.min(10, "Prerequisites must be at least 10 characters if provided")
			.max(2000, "Prerequisites cannot exceed 2000 characters")
			.optional()
			.nullable()
			.refine((value) => !value || value.trim().length >= 10, {
				message: "Prerequisites must be at least 10 characters if provided",
				path: ["prerequisites"],
			}),
		longDescription: z
			.string()
			.trim()
			.min(50, "Detailed description must be at least 50 characters if provided")
			.max(5000, "Detailed description cannot exceed 5000 characters")
			.optional()
			.nullable()
			.refine((value) => !value || value.trim().length >= 50, {
				message: "Detailed description must be at least 50 characters if provided",
				path: ["longDescription"],
			}),
		objectives: z
			.string()
			.trim()
			.min(20, "Objectives must be at least 20 characters if provided")
			.max(2000, "Objectives cannot exceed 2000 characters")
			.optional()
			.nullable()
			.refine((value) => !value || value.trim().length >= 20, {
				message: "Objectives must be at least 20 characters if provided",
				path: ["objectives"],
			}),
		targetAudience: z
			.string()
			.trim()
			.min(20, "Target audience must be at least 20 characters if provided")
			.max(2000, "Target audience cannot exceed 2000 characters")
			.optional()
			.nullable()
			.refine((value) => !value || value.trim().length >= 20, {
				message: "Target audience must be at least 20 characters if provided",
				path: ["targetAudience"],
			}),
		adminSharePercentage: z
			.number({
				required_error: "Admin share percentage is required",
				invalid_type_error: "Admin share percentage must be a number",
			})
			.min(0.01, "Admin share must be at least 0.01%")
			.max(100, "Admin share cannot exceed 100%")
			.refine((val) => Number.isFinite(val), "Admin share must be a valid number")
			.refine((val) => val > 0, "Admin share must be greater than 0"),
	})
	.refine(
		(data) => {
			if (data.thumbnail instanceof File) {
				return data.thumbnail.size <= 5 * 1024 * 1024; // 5MB
			}
			return true;
		},
		{
			message: "Thumbnail must be an image file under 5MB",
			path: ["thumbnail"],
		},
	)
	.refine(
		(data) => {
			if (
				data.price !== undefined &&
				data.price !== null &&
				data.offer !== undefined &&
				data.offer !== null
			) {
				return data.offer <= data.price;
			}
			return true;
		},
		{
			message: "Offer price must be less than or equal to the regular price",
			path: ["offer"],
		},
	)
	.refine(
		(data) => {
			if (data.price && data.offer) {
				const discountPercentage = ((data.price - data.offer) / data.price) * 100;
				return discountPercentage <= 90; // Max 90% discount
			}
			return true;
		},
		{
			message: "Discount cannot exceed 90% of the original price",
			path: ["offer"],
		},
	)
	.refine(
		(data) => {
			// Ensure at least one description field is provided
			return !!(data.description || data.longDescription);
		},
		{
			message: "At least one description field (description or detailed description) is required",
			path: ["description"],
		},
	);
