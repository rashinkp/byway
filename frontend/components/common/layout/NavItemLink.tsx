import { Button } from "@/components/ui/button";
import { NavItem } from "@/types/nav";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Link from "next/link";


export function NavItemLink({
	item,
	collapsed,
	isActive,
	onClick,
}: {
	item: NavItem;
	collapsed: boolean;
	isActive: boolean;
	onClick: () => void;
}) {
	const IconComponent = item.icon;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link href={item.href} onClick={onClick}>
					<Button
						variant="ghost"
						className={`w-full ${
							collapsed ? "justify-center px-3" : "justify-start px-4"
						} 
            ${
							isActive
								? "bg-[#facc15] text-black hover:bg-[#facc15]/90 hover:text-black"
								: "text-white hover:bg-[#facc15]/10 hover:text-[#facc15]"
						}
            transition-all duration-200 py-3 h-auto my-1 rounded-lg`}
					>
						<IconComponent className={`${collapsed ? "h-5 w-5" : "h-5 w-5"}`} />
						{!collapsed && (
							<span className="ml-3 font-medium">{item.label}</span>
						)}
					</Button>
				</Link>
			</TooltipTrigger>
			{collapsed && (
				<TooltipContent
					side="right"
					className="bg-[#18181b] text-white border-[#facc15] px-3 py-1.5 rounded-md"
				>
					{item.label}
				</TooltipContent>
			)}
		</Tooltip>
	);
}
