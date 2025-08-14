import { getIO } from "../socket";

type NotificationPayload<T = any> = {
  id: string;
  type: "transaction" | "goal" | "debt";
  action: "added" | "updated" | "deleted";
  data: T;
  timestamp: string;
};

export function notifyUser<T>(
  userId: string,
  payload: Omit<NotificationPayload<T>, "timestamp">
) {
  const notification: NotificationPayload<T> = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  getIO().to(userId).emit("notification", notification);
}