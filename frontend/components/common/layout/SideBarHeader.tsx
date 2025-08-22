import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";


export function SidebarHeader({
	collapsed,
	toggleCollapse,
	title,
	subtitle,
	mobileMenuOpen,
	setMobileMenuOpen,
}: {
	collapsed: boolean;
	toggleCollapse?: () => void;
	title: string;
	subtitle: string;
	mobileMenuOpen?: boolean;
	setMobileMenuOpen?: (open: boolean) => void;
}) {
	return (
		<div
			className={`p-4 lg:p-6 border-b border-gray-800 flex ${
				collapsed ? "justify-center" : "justify-between"
			} items-center bg-[#18181b]`}
		>
			{/* Mobile Menu Toggle - Only visible on mobile when collapsed */}
			{setMobileMenuOpen && collapsed && (
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="lg:hidden text-white hover:text-[#facc15] hover:bg-[#facc15]/10 flex-shrink-0"
					aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
				>
					{mobileMenuOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</Button>
			)}

			{!collapsed && (
				<div className="min-w-0 flex-1">
					<h1 className="text-lg lg:text-xl font-bold text-white tracking-tight truncate">
						{title}
					</h1>
					<p className="text-xs lg:text-sm text-[#facc15] mt-1 truncate">{subtitle}</p>
				</div>
			)}

			{toggleCollapse && (
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleCollapse}
					className="hidden lg:flex text-white hover:text-[#facc15] hover:bg-[#facc15]/10 flex-shrink-0"
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
