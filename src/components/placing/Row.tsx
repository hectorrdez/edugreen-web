import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";

type RowProps = {
  children: ReactNode;
  className?: string;
  props?: any[];
};

export default function Row({ children, className = "", ...props }: RowProps) {
  const newClassName = StringUtils.JoinClassName("flex flex-row", className);
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
