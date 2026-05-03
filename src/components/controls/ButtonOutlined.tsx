import type { ReactNode, MouseEventHandler } from "react";
import StringUtils from "../../utils/StringUtils";
import Button from "./Button";

type ButtonOutlinedProps = {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  props?: any[];
};

export default function ButtonOutlined({
  children,
  className = "",
  onClick = () => {},
  ...props
}: ButtonOutlinedProps) {
  const newClassName = StringUtils.JoinClassName(
    "bg-transparent border-2 border-white text-white",
    className,
  );
  return (
    <Button className={newClassName} onClick={onClick} {...props}>
      {children}
    </Button>
  );
}
