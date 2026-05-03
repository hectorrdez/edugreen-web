export type NotificationVariant = "success" | "error" | "warning" | "info";

export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NotificationItem = {
  id: string;
  variant: NotificationVariant;
  title?: string;
  message: string;
  duration: number;
  position: NotificationPosition;
};

export type NotifyOptions = {
  variant: NotificationVariant;
  title?: string;
  message: string;
  duration?: number;
  position?: NotificationPosition;
};
