export default function Column({ children, className = null, ...props }) {
  const newClassName = ["flex flex-col", className].join(" ").trim();
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
