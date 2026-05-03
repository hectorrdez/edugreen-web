import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import type { NotificationItem, NotificationVariant } from "./types";

type NotificationProps = NotificationItem & {
  onDismiss: (id: string) => void;
};

type VariantStyle = {
  border: string;
  iconColor: string;
  bar: string;
  Icon: React.ElementType;
};

const VARIANT_STYLES: Record<NotificationVariant, VariantStyle> = {
  success: {
    border: "border-l-green-500",
    iconColor: "text-green-500",
    bar: "bg-green-500",
    Icon: IconCircleCheck,
  },
  error: {
    border: "border-l-red-500",
    iconColor: "text-red-500",
    bar: "bg-red-500",
    Icon: IconCircleX,
  },
  warning: {
    border: "border-l-amber-500",
    iconColor: "text-amber-500",
    bar: "bg-amber-500",
    Icon: IconAlertTriangle,
  },
  info: {
    border: "border-l-blue-500",
    iconColor: "text-blue-500",
    bar: "bg-blue-500",
    Icon: IconInfoCircle,
  },
};

export default function Notification({
  id,
  variant,
  title,
  message,
  duration,
  onDismiss,
}: NotificationProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 300);
  }, [id, onDismiss]);

  // Animate in after first paint
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss, duration]);

  // Progress bar
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
    }, 16);
    return () => clearInterval(interval);
  }, [duration]);

  const { border, iconColor, bar, Icon } = VARIANT_STYLES[variant];
  const isVisible = visible && !exiting;

  return (
    <div
      className={`pointer-events-auto w-80 bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${border} transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-2 scale-95"
      }`}
    >
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <Icon size={20} className={`${iconColor} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm text-gray-900 leading-snug">
              {title}
            </p>
          )}
          <p className="text-sm text-gray-500 leading-snug">{message}</p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5"
          aria-label="Cerrar notificación"
        >
          <IconX size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div
          className={`h-full ${bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
