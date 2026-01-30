import { Link } from "react-router-dom";

export default function LinkButton({
  to,
  children,
  className = null,
  ...props
}) {
  const newClassName = [
    "rounded-lg px-4 py-2 min-w-[44px] min-h-[44px] font-semibold text-white bg-[#212422] cursor-pointer",
    className,
  ]
    .join(" ")
    .trim();
  return (
    <Link to={to} className={newClassName} {...props}>
      {children}
    </Link>
  );
}
