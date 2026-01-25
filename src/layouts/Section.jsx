export default function Section({
  children,
  className = null,
  contentClassName = null,
  ...props
}) {
  const newClassName = ["", className].join(" ").trim();
  const newClassNameContent = [
    "container max-w-7xl mx-auto px-4 py-8",
    contentClassName,
  ]
    .join(" ")
    .trim();
  return (
    <section className={newClassName} {...props}>
      <div className={newClassNameContent}>{children}</div>
    </section>
  );
}
