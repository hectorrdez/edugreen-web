import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";

type CardProps = {
  children: ReactNode;
  className?: string;
  props?: any[];
};

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  const newClassName = StringUtils.JoinClassName(
    "bg-card rounded-2xl p-8 shadow-sm",
    className,
  );

  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
