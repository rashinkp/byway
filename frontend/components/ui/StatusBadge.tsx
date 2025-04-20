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
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
        ${className}
      `}
    >
      {isActive ? activeText : inactiveText}
    </span>
  );
}
