import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";

type ColumnInvertedProps = {
  children: ReactNode;
  className?: string;
  props?: any[];
};

export default function ColumnInverted({
  children,
  className = "",
  ...props
}: ColumnInvertedProps) {
  const newClassName = StringUtils.JoinClassName(
    "flex flex-col-reverse",
    className,
  );
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
