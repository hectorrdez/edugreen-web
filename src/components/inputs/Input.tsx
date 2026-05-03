import type { ComponentPropsWithoutRef } from "react";
import StringUtils from "../../utils/StringUtils";

type InputVariant = "default" | "dark";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "onChange"> & {
  children?: string;
  variant?: InputVariant;
  onChange?: (value: string) => void;
};

const variants: Record<InputVariant, string> = {
  default:
    "bg-input text-gray-900 border border-gray-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
  dark:
    "bg-transparent text-footer border border-[#374151] placeholder:text-footer-secondary hover:border-[#6b7280] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
};

export default function Input({
  children,
  className = "",
  type = "text",
  variant = "default",
  onChange,
  ...props
}: InputProps) {
  const newClassName = StringUtils.JoinClassName(
    "min-w-input min-h-input rounded-button px-3 transition-colors",
    variants[variant],
    className,
  );

  return (
    <input
      placeholder={children}
      type={type}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className={newClassName}
      {...props}
    />
  );
}
