import type { ComponentPropsWithoutRef } from "react";
import Button from "./Button";
import StringUtils from "../../utils/StringUtils";

type ButtonSecondaryProps = ComponentPropsWithoutRef<"button">;

export default function ButtonSecondary({
  children,
  className = "",
  type = "button",
  onClick = () => {},
  ...props
}: ButtonSecondaryProps) {
  const newClassName = StringUtils.JoinClassName(
    "bg-button-secondary border-1 border-button-secondary",
    className,
  );

  return (
    <Button className={newClassName} onClick={onClick} type={type} {...props}>
      {children}
    </Button>
  );
}
