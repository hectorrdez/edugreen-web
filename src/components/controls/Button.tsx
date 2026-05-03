import StringUtils from "../../utils/StringUtils";
import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;

export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const newClassName = StringUtils.JoinClassName(
    "cursor-pointer bg-button-primary text-button-primary min-w-button min-h-button flex justify-center items-center font-semibold rounded-button py-2 px-4",
    className,
  );

  return (
    <button className={newClassName} type={type} {...props}>
      {children}
    </button>
  );
}
