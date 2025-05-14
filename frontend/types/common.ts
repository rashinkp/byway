import { JSX } from "react";

export type SortOption<T> = {
  value: Extract<keyof T, string> | `-${string}`;
  label: string;
};

export type Stat<T> = {
  title: string;
  value: number;
  color?: string;
};

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (item: T) => JSX.Element | null;
};

export type Action<T> = {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | ((item: T) => "default" | "outline" | "destructive");
  confirmationMessage?: (item: T) => string;
  Icon?: React.ComponentType<{ className?: string }>;
  hidden?: (item: T) => boolean; // Add optional hidden property
};
