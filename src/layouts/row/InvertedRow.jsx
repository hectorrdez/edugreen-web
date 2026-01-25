export default function InvertedRow({ children, className = null, ...props }) {
  const newClassName = ["flex flex-row-reverse", className].join(" ").trim();
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
