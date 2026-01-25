export default function InvertedColumn({
  children,
  className = null,
  ...props
}) {
  const newClassName = ["flex flex-col-reverse", className].join(" ").trim();
  return (
    <div className={newClassName} {...props}>
      {children}
    </div>
  );
}
