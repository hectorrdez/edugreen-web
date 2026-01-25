export default function Button({ children, className = null, ...props }) {
  const newClassName = ["bg-[#212422]", className].join(" ").trim();
  return (
    <button className={newClassName} {...props}>
      {children}
    </button>
  );
}
