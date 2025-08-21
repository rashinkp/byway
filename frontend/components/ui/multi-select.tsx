"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";

export type MultiSelectOption = { value: string; label: string };

interface MultiSelectProps {
  value: string; // comma-separated values
  onChange: (value: string) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showChips?: boolean;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select options",
  disabled,
  className,
  showChips = true,
}: MultiSelectProps) {
  const selectedValues = React.useMemo(
    () =>
      typeof value === "string" && value
        ? value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [value],
  );

  const toggleValue = (optionValue: string, checked: boolean | "indeterminate") => {
    const current = selectedValues;
    let next = current;
    if (checked) {
      next = Array.from(new Set([...current, optionValue]));
    } else {
      next = current.filter((v) => v !== optionValue);
    }
    onChange(next.join(", "));
  };

  const clearAll = () => onChange("");

  return (
    <div className={cn("space-y-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-between border-[#facc15] dark:border-[#facc15] bg-white dark:bg-[#18181b] text-black dark:text-white"
            disabled={disabled}
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : placeholder}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto bg-white dark:bg-[#18181b] text-black dark:text-white border-[#facc15] dark:border-[#facc15]">
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            return (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={isChecked}
                onCheckedChange={(checked) => toggleValue(option.value, checked)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={false}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={() => {}}
            onClick={clearAll}
          >
            Clear all
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showChips && selectedValues.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((val) => (
            <Badge key={val} variant="secondary" className="flex items-center gap-1">
              {val}
              <button
                type="button"
                className="ml-1"
                onClick={() => toggleValue(val, false)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default MultiSelect;


