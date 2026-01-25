export default function Row({ children, className = null, ...props }) {
  const newClassName = ["flex flex-row", className].join(" ").trim();
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
