import type { ReactNode } from "react";
import { useCountAnimation } from "../../hooks/useCountAnimation";
import StringUtils from "../../utils/StringUtils";
import Column from "../placing/Column";
import Row from "../placing/Row";
import ProgressBar from "./ProgressBar";

type ProgressBarLabeledProps = {
  showMinLabel?: boolean;
  showMaxLabel?: boolean;
  min?: number;
  max?: number;
  children: ReactNode;
  currentProgress: number;
  currentProgressType?: "percentage" | "proportion";
  className?: string;
};

export default function ProgressBarLabeled({
  showMinLabel = false,
  showMaxLabel = false,
  min = 0,
  max = 100,
  children,
  currentProgress = 0,
  currentProgressType = "percentage",
  className,
  ...props
}: ProgressBarLabeledProps) {
  const clampedProgress = Math.min(Math.max(currentProgress, min), max);
  const newClassName = StringUtils.JoinClassName("gap-0", className);
  const displayedInt = useCountAnimation(clampedProgress);

  return (
    <Column className={newClassName} {...props}>
      <Row className="justify-between items-baseline">
        <span className="text-xs font-semibold">{children}</span>
        <span className="text-xs font-semibold text-gray-400 tabular-nums">
          {currentProgressType == "proportion" && `${displayedInt} / ${max}`}
          {currentProgressType == "percentage" &&
            `${Math.round((currentProgress / max) * 100)}%`}
        </span>
      </Row>
      <ProgressBar min={min} max={max} currentProgress={currentProgress} />
      {(showMinLabel || showMaxLabel) && (
        <Row className="justify-between">
          {showMinLabel && (
            <span className="text-xs text-muted-foreground">{min}</span>
          )}
          {showMaxLabel && (
            <span className="text-xs text-muted-foreground">{max}</span>
          )}
        </Row>
      )}
    </Column>
  );
}
