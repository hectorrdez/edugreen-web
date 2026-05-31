import { IconSearch, IconX } from "@tabler/icons-react";
import type { ComponentPropsWithoutRef } from "react";
import StringUtils from "../../utils/StringUtils";

type SearchBarProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "onChange" | "value"
> & {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
  ...props
}: SearchBarProps) {
  const wrapperClass = StringUtils.JoinClassName(
    "flex items-center gap-2 bg-white border border-gray-200 rounded-button px-3 min-h-input transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
    className,
  );

  return (
    <div className={wrapperClass}>
      <IconSearch size={18} className="text-gray-400 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          aria-label="Limpiar búsqueda"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
