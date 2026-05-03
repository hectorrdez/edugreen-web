import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";

type RowInvertedProps = {
  children: ReactNode;
  className?: string;
  props?: any[];
};

export default function RowInverted({
  children,
  className = "",
  ...props
}: RowInvertedProps) {
  const newClassName = StringUtils.JoinClassName("", className);
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
