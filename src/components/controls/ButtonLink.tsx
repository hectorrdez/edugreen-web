import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  to?: string;
  target?: string;
  props?: any[];
};

export default function ButtonLink({
  children,
  className = "",
  to = "/",
  target = "_self",
  ...props
}: ButtonLinkProps) {
  return (
    <Link to={to} className="w-fit" target="_self" {...props}>
      <Button className={className}>{children}</Button>
    </Link>
  );
}
