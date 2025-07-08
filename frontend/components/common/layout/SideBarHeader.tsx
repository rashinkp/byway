import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";


export function SidebarHeader({
	collapsed,
	toggleCollapse,
	title,
	subtitle,
}: {
	collapsed: boolean;
	toggleCollapse?: () => void;
	title: string;
	subtitle: string;
}) {
	return (
		<div
			className={`p-6 border-b border-[var(--color-primary-light)]/20 flex ${
				collapsed ? "justify-center" : "justify-between"
			} items-center`}
		>
			{!collapsed && (
				<div>
					<h1 className="text-xl font-bold text-[var(--color-surface)] tracking-tight">
						{title}
					</h1>
					<p className="text-sm text-[var(--color-muted/80)] mt-1">{subtitle}</p>
				</div>
			)}

			{toggleCollapse && (
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleCollapse}
					className="hidden lg:flex text-[var(--color-surface)] hover:text-[var(--color-surface)] hover:bg-[var(--color-primary-light)]/10"
				>
					{collapsed ? (
						<ChevronRight className="h-5 w-5" />
					) : (
						<ChevronLeft className="h-5 w-5" />
					)}
				</Button>
			)}
		</div>
	);
}
