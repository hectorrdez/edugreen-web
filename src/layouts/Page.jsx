export default function Page({
  header = <></>,
  footer = <></>,
  className = null,
  children,
  ...props
}) {
  const newClassName = ["flex flex-col min-h-screen", className]
    .join(" ")
    .trim();
  return (
    <>
      {header}
      <main className={newClassName} {...props}>
        {children}
      </main>
      {footer}
    </>
  );
}
