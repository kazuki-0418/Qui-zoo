import admin from "firebase-admin";
import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

// ソケット拡張型を定義
interface AuthenticatedSocket extends Socket {
  userId: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
}

/**
 * WebSocketミドルウェアの適用
 * @param {Server} io - Socket.ioサーバーインスタンス
 */
export function applyMiddleware(io: Server): void {
  // 認証ミドルウェア
  io.use(async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        (socket as AuthenticatedSocket).userId = guestId;
        (socket as AuthenticatedSocket).user = {
          id: guestId,
          email: null,
          name: socket.handshake.auth.name || "Guest",
        };

        console.log(`Guest user connected: ${guestId}`);
        return next();
      }

      // 認証済みユーザー処理（既存のコード）
      const decodedToken = await admin.auth().verifyIdToken(token);
      (socket as AuthenticatedSocket).userId = decodedToken.uid;
      (socket as AuthenticatedSocket).user = {
        id: decodedToken.uid,
        email: decodedToken.email || null,
        name: decodedToken.name || null,
      };

      next();
    } catch (error) {
      console.error(
        "Authentication error:",
        error instanceof Error ? error.message : String(error),
      );
      next(new Error("Authentication failed"));
    }
  });

  // ロギングミドルウェア
  io.use((socket: Socket, next: (err?: ExtendedError) => void) => {
    const address = socket.handshake.address;
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`[${new Date().toISOString()}] New connection: ${socket.id} from ${address}`);

    // 切断時のログ
    socket.on("disconnect", (reason: string) => {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`[${new Date().toISOString()}] Disconnected: ${socket.id} - ${reason}`);
    });

    next();
  });
}
