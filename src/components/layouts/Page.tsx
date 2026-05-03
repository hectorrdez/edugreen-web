import type { ReactNode } from "react";
import StringUtils from "../../utils/StringUtils";
import Footer from "./Footer";
import Header from "./Header";

type PageProps = {
  children: ReactNode;
  customHeader?: boolean;
  className?: string;
};

export default function Page({
  customHeader = false,
  children,
  className = "",
}: PageProps) {
  const newClassName = StringUtils.JoinClassName(
    "min-h-[calc(100vh-16em)] bg-main",
    className,
  );
  return (
    <>
      {!customHeader && <Header />}
      <main className={newClassName}>{children}</main>
      <Footer />
    </>
  );
}
