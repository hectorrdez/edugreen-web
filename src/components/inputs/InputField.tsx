import type { ReactNode } from "react";
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
  const newClassName = StringUtils.JoinClassName("gap-1.5", className);
  const newLabelClassName = StringUtils.JoinClassName(
    "text-sm font-medium",
    labelClassName,
  );
  const newInputClassName = StringUtils.JoinClassName(
    "pl-10 rounded-lg w-full",
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
      <div className="relative">
        <span className={newIconClassName}>{icon}</span>
        <Input
          className={newInputClassName}
          type={type}
          id={id}
          value={value}
          onChange={onChange}
        >
          {placeholder}
        </Input>
      </div>
    </Column>
  );
}
