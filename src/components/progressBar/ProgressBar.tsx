import { useEffect, useRef, useState } from "react";
import StringUtils from "../../utils/StringUtils";

type ProgressBarProps = {
  min: number;
  max: number;
  currentProgress: number;
  className?: string;
};

export default function ProgressBar({
  min,
  max,
  currentProgress,
  className = "",
  ...props
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(currentProgress, min), max);
  const targetPercentage =
    max === min ? 0 : ((clampedProgress - min) / (max - min)) * 100;

  const [displayWidth, setDisplayWidth] = useState(0);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      // Primera carga: parte de 0 y anima hasta el valor real
      isMounted.current = true;
      const frame = requestAnimationFrame(() => setDisplayWidth(targetPercentage));
      return () => cancelAnimationFrame(frame);
    }
    // Cambio de valor posterior: la transición CSS anima desde el valor actual
    setDisplayWidth(targetPercentage);
  }, [targetPercentage]);

  const newClassName = StringUtils.JoinClassName(
    "w-full h-2.5 bg-gray-100 rounded-full overflow-hidden",
    className,
  );

  return (
    <div className={newClassName} {...props}>
      <div
        className="h-full bg-primary rounded-full"
        style={{
          width: `${displayWidth}%`,
          transition: "width 700ms ease-out",
        }}
      />
    </div>
  );
}
