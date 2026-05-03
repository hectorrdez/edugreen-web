import { useContext } from "react";
import { NotificationContext } from "./NotificationProvider";

export function useNotification() {
  return useContext(NotificationContext);
}
