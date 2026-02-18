import { io } from "socket.io-client";

const SOCKET_URL = "http://143.110.244.163:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
