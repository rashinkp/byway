import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
	status: string;
	type?: "order" | "payment";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
	status,
	type = "order",
}) => {
	interface StatusConfig {
		icon: React.ComponentType<{ className?: string }>;
		color: string;
		bg: string;
		text: string;
	}

	const getStatusConfig = (): StatusConfig => {
		if (type === "payment") {
			switch (status) {
				case "COMPLETED":
					return {
						icon: CheckCircle,
						color: "text-[var(--color-primary-light)]",
						bg: "bg-[var(--color-primary-light)]/10",
						text: "Paid",
					};
				case "PENDING":
					return {
						icon: Clock,
						color: "text-[var(--color-warning)]",
						bg: "bg-[var(--color-warning)]/10",
						text: "Pending",
					};
				case "FAILED":
					return {
						icon: XCircle,
						color: "text-[var(--color-danger)]",
						bg: "bg-[var(--color-danger)]/10",
						text: "Failed",
					};
				case "REFUNDED":
					return {
						icon: AlertCircle,
						color: "text-[var(--color-accent)]",
						bg: "bg-[var(--color-accent)]/10",
						text: "Refunded",
					};
				default:
					return {
						icon: AlertCircle,
						color: "text-[var(--color-muted)]",
						bg: "bg-[var(--color-surface)]",
						text: status,
					};
			}
		} else {
			switch (status) {
				case "COMPLETED":
					return {
						icon: CheckCircle,
						color: "text-[var(--color-primary-light)]",
						bg: "bg-[var(--color-primary-light)]/10",
						text: "Completed",
					};
				case "PENDING":
					return {
						icon: Clock,
						color: "text-[var(--color-warning)]",
						bg: "bg-[var(--color-warning)]/10",
						text: "Pending",
					};
				case "CONFIRMED":
					return {
						icon: CheckCircle,
						color: "text-[var(--color-primary-dark)]",
						bg: "bg-[var(--color-primary-dark)]/10",
						text: "Confirmed",
					};
				case "FAILED":
					return {
						icon: XCircle,
						color: "text-[var(--color-danger)]",
						bg: "bg-[var(--color-danger)]/10",
						text: "Failed",
					};
				case "CANCELLED":
					return {
						icon: XCircle,
						color: "text-[var(--color-muted)]",
						bg: "bg-[var(--color-surface)]",
						text: "Cancelled",
					};
				default:
					return {
						icon: AlertCircle,
						color: "text-[var(--color-muted)]",
						bg: "bg-[var(--color-surface)]",
						text: status,
					};
			}
		}
	};

	const { icon: Icon, color, bg, text } = getStatusConfig();

	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color} ${bg}`}
		>
			<Icon className="w-3 h-3" />
			{text}
		</span>
	);
};
