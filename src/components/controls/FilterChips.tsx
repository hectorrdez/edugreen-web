import StringUtils from "../../utils/StringUtils";

export type FilterOption<T extends string = string> = {
  label: string;
  value: T;
};

type FilterChipsProps<T extends string> = {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export default function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: FilterChipsProps<T>) {
  return (
    <div
      className={StringUtils.JoinClassName("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={StringUtils.JoinClassName(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 cursor-pointer min-h-[44px] min-w-[44px]",
              active
                ? "bg-primary border-primary text-black"
                : "bg-white border-gray-200 text-secondary hover:border-primary hover:text-primary-dark",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
