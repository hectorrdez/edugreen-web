export default function OutlinedButton({
  children,
  className = null,
  ...props
}) {
  const newClassName = [
    "bg-transparent border-2 border-[#212422] text-[#212422] font-semibold cursor-pointer rounded-lg px-4 py-2 min-w-[44px] min-h-[44px] hover:bg-[#212422] hover:text-white transition-colors duration-300",
    className,
  ]
    .join(" ")
    .trim();
  return (
    <button className={newClassName} {...props}>
      {children}
    </button>
  );
}
