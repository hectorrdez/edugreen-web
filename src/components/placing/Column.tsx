import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";

type ColumnProps = {
  children: ReactNode;
  className?: string;
  props?: any[];
};

export default function Column({
  children,
  className = "",
  ...props
}: ColumnProps) {
  const newClassName = StringUtils.JoinClassName("flex flex-col", className);

  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
