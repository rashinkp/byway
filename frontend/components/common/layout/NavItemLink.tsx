import { Button } from "@/components/ui/button";
import { NavItem } from "@/types/nav";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Link from "next/link";

interface NavItemLinkProps {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

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
                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
          className="bg-zinc-800 text-white border-zinc-700 px-3 py-1.5 rounded-md"
        >
          {item.label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
