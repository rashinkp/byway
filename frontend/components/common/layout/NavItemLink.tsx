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
								? "bg-[var(--color-primary-light)] text-[var(--color-surface)] hover:bg-[var(--color-primary-light)]/80 hover:text-[var(--color-surface)]"
								: "text-[var(--color-surface)] hover:bg-[var(--color-primary-light)]/10 hover:text-[var(--color-surface)]"
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
					className="bg-[var(--color-primary-dark)] text-[var(--color-surface)] border-[var(--color-primary-light)] px-3 py-1.5 rounded-md"
				>
					{item.label}
				</TooltipContent>
			)}
		</Tooltip>
	);
}
