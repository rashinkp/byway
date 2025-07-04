import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

interface AnalyticsCardProps {
	imageUrl: string;
	profileImage?: string;
	profileName?: string;
	profileRole?: string;
	title: string;
	description: string;
	subtitle?: string;
	rating?: number;
	reviewCount?: number;
	footer?: React.ReactNode;
	className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
	imageUrl,
	profileImage,
	profileName,
	profileRole,
	title,
	description,
	subtitle,
	rating,
	reviewCount,
	footer,
	className,
}) => {
	return (
		<div
			className={
				"rounded-xl shadow-lg cursor-pointer overflow-hidden mx-auto hover:shadow-xl transition-shadow duration-300 " +
				(className || "")
			}
			style={{
				background: "var(--tertiary)",
				color: "var(--foreground)",
				maxWidth: "20rem",
				minWidth: "20rem",
				borderRadius: "1rem",
			}}
		>
			{/* Hero Image */}
			<div className="relative h-48 overflow-hidden">
				<Image
					src={imageUrl}
					alt={title}
					className="w-full h-full object-cover"
					width={320}
					height={192}
				/>
			</div>
			{/* Content */}
			<div className="p-6 flex flex-col">
				{/* Profile Section (optional) */}
				{profileImage && profileName && (
					<div className="flex items-center gap-2 mb-3">
						<Image
							src={profileImage}
							alt={profileName}
							className="w-9 h-9 rounded-full object-cover"
							style={{ border: "2px solid var(--primary)" }}
							width={36}
							height={36}
						/>
						<div>
							<h3
								className="font-medium text-sm"
								style={{ color: "var(--primary-foreground)" }}
							>
								{profileName}
							</h3>
							{profileRole && (
								<p
									className="text-xs"
									style={{ color: "var(--primary-foreground)" }}
								>
									{profileRole}
								</p>
							)}
						</div>
					</div>
				)}
				{/* Title */}
				<h2
					className="text-xl font-bold mb-1 line-clamp-1"
					style={{ color: "var(--foreground)" }}
				>
					{title}
				</h2>
				{subtitle && (
					<div
						className="text-sm text-muted-foreground mb-1 line-clamp-1"
						style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
					>
						{subtitle}
					</div>
				)}
				{/* Description */}
				<p
					className="text-sm mb-1 leading-relaxed line-clamp-2"
					style={{ color: "var(--primary-600)" }}
				>
					{description}
				</p>
				{/* Rating (optional) */}
				{(rating !== undefined || reviewCount !== undefined) && (
					<div className="flex items-center gap-2 mt-1">
						<span
							className="text-2xl font-bold"
							style={{ color: "var(--primary-foreground)" }}
						>
							{rating?.toFixed(1) || "0.0"}
						</span>
						<Star
							className="w-5 h-5"
							style={{ fill: "var(--warning)", color: "var(--warning)" }}
						/>
						<span
							className="text-sm"
							style={{ color: "var(--primary-foreground)" }}
						>
							({reviewCount || 0} reviews)
						</span>
					</div>
				)}
				{footer && <div className="mt-4">{footer}</div>}
			</div>
		</div>
	);
};

export default AnalyticsCard;
