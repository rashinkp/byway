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
			className={`p-6 border-b border-gray-800 flex ${
				collapsed ? "justify-center" : "justify-between"
			} items-center bg-[#18181b]`}
		>
			{!collapsed && (
				<div>
					<h1 className="text-xl font-bold text-white tracking-tight">
						{title}
					</h1>
					<p className="text-sm text-[#facc15] mt-1">{subtitle}</p>
				</div>
			)}

			{toggleCollapse && (
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleCollapse}
					className="hidden lg:flex text-white hover:text-[#facc15] hover:bg-[#facc15]/10"
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
