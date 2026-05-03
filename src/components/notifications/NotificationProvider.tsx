import { createContext, useCallback, useState, type ReactNode } from "react";
import Notification from "./Notification";
import type {
  NotificationItem,
  NotificationPosition,
  NotifyOptions,
} from "./types";

type NotificationContextType = {
  notify: (options: NotifyOptions) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

const POSITION_CLASSES: Record<NotificationPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = useCallback((options: NotifyOptions) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [
      ...prev,
      {
        id,
        variant: options.variant,
        title: options.title,
        message: options.message,
        duration: options.duration ?? 4000,
        position: options.position ?? "top-right",
      },
    ]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const grouped = notifications.reduce<
    Partial<Record<NotificationPosition, NotificationItem[]>>
  >((acc, n) => {
    if (!acc[n.position]) acc[n.position] = [];
    acc[n.position]!.push(n);
    return acc;
  }, {});

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {(
        Object.entries(grouped) as [NotificationPosition, NotificationItem[]][]
      ).map(([position, items]) => (
        <div
          key={position}
          className={`fixed z-[100] flex flex-col gap-2 pointer-events-none ${POSITION_CLASSES[position]}`}
        >
          {items.map((item) => (
            <Notification key={item.id} {...item} onDismiss={dismiss} />
          ))}
        </div>
      ))}
    </NotificationContext.Provider>
  );
}
