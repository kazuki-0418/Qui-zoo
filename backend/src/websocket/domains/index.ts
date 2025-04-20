import { Server } from "socket.io";
import { registerNotificationHandlers } from "./notifications";

export function registerDomainHandlers(io: Server) {
  registerNotificationHandlers(io);
}
