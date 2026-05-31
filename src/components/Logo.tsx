import { IconLeafFilled } from "@tabler/icons-react";
import StringUtils from "../utils/StringUtils";
import Row from "./placing/Row";

type LogoProps = {
  className?: string;
  size?: number;
  props?: any[];
};

export default function Logo({
  className = "text-primary",
  size = 14,
  ...props
}: LogoProps) {
  const newClassName = StringUtils.JoinClassName(className);
  return (
    <span className={newClassName} {...props}>
      {" "}
      <IconLeafFilled size={size} />
    </span>
  );
}

type LogoWithTextProps = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  props?: any[];
};

export function LogoWithText({
  className = "",
  textClassName = "",
  iconClassName,
  ...props
}: LogoWithTextProps) {
  const newRowClassName = StringUtils.JoinClassName(
    "items-center gap-1",
    className,
  );
  const newTextClassName = StringUtils.JoinClassName(
    "text-xl font-semibold",
    textClassName,
  );
  return (
    <Row className={newRowClassName} {...props}>
      <Logo className={iconClassName} size={20} />
      <span className={newTextClassName}>EduGreen</span>
    </Row>
  );
}

export function LogoWithTextColored({
  className = "",
  textClassName = "",
  iconClassName,
  ...props
}: LogoWithTextProps) {
  const newRowClassName = StringUtils.JoinClassName(
    "items-center gap-1",
    className,
  );
  const newTextClassName = StringUtils.JoinClassName(
    "text-xl font-semibold",
    textClassName,
  );
  return (
    <Row className={newRowClassName} {...props}>
      <Logo className={iconClassName} size={20} />
      <span className={newTextClassName}>
        <span>Edu</span>
        <span>Green</span>
      </span>
    </Row>
  );
}
