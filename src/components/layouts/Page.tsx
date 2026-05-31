import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";
import Footer from "./Footer";
import Header from "./Header";

type PageProps = {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
};

export default function Page({
  header = <Header />,
  children,
  className = "",
}: PageProps) {
  const newClassName = StringUtils.JoinClassName(
    "min-h-[calc(100vh-16em)] bg-main",
    className,
  );
  return (
    <>
      {header}
      <main className={newClassName}>{children}</main>
      <Footer />
    </>
  );
}
