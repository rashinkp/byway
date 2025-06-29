interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
}

export function StatusBadge({
  isActive,
  activeText = "Active",
  inactiveText = "Inactive",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border
        ${isActive 
          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
          : "bg-rose-50 text-rose-700 border-rose-200"
        }
        ${className}
      `}
    >
      {isActive ? activeText : inactiveText}
    </span>
  );
}
