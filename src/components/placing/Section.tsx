import type { ReactNode } from "react";
import Column from "./Column";
import StringUtils from "../../utils/StringUtils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  props?: any[];
};
export default function Section({
  children,
  className,
  containerClassName,
  ...props
}: SectionProps) {
  const newSectionClassName = StringUtils.JoinClassName(
    "flex justify-center items-center",
    className,
  );
  const newSectionContentClassName = StringUtils.JoinClassName(
    "max-w-7xl w-full",
    containerClassName,
  );

  return (
    <section className={newSectionClassName}>
      <Column className={newSectionContentClassName} {...props}>
        {children}
      </Column>
    </section>
  );
}
