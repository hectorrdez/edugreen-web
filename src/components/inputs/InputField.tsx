import { IconEye, IconEyeOff } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";
import StringUtils from "../../utils/StringUtils";
import Column from "../placing/Column";
import Input from "./Input";

type InputFieldProps = {
  children: string;
  id: string;
  placeholder: string;
  type: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  props?: any[];
};

export default function InputField({
  children,
  id,
  placeholder,
  type,
  icon,
  value,
  onChange,
  className = "",
  labelClassName = "",
  inputClassName = "",
  iconClassName = "",
  ...props
}: InputFieldProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const newClassName = StringUtils.JoinClassName("gap-1.5", className);
  const newLabelClassName = StringUtils.JoinClassName(
    "text-sm font-medium",
    labelClassName,
  );
  const newInputClassName = StringUtils.JoinClassName(
    isPassword ? "pl-10 pr-12 rounded-lg w-full" : "pl-10 rounded-lg w-full",
    inputClassName,
  );
  const newIconClassName = StringUtils.JoinClassName(
    "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
    iconClassName,
  );

  return (
    <Column className={newClassName} {...props}>
      <label htmlFor={id} className={newLabelClassName}>
        {children}
      </label>
      <div className="relative group">
        <span className={newIconClassName}>{icon}</span>
        <Input
          className={newInputClassName}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          id={id}
          value={value}
          onChange={onChange}
        >
          {placeholder}
        </Input>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer w-8.25 h-8.25 hidden group-focus-within:flex justify-center items-center"
            tabIndex={-1}
          >
            {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        )}
      </div>
    </Column>
  );
}
