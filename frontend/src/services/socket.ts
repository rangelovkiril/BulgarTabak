import { Socket, io } from "socket.io-client";
import { getToken } from "./auth";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    this.socket = io(SOCKET_URL, {
      auth: {
        token: getToken(),
      },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();
