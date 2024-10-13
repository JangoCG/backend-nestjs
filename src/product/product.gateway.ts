import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";

@WebSocketGateway({
  cors: {
    // TODO: Should not be star for everything
    origin: "*",
    methods: ["GET", "POST"],
  },
})
export class ProductGateway {
  constructor(private authService: AuthService) {}
  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdated() {
    this.server.emit("productUpdated");
  }

  handleConnection(client: Socket) {
    console.log("client connected");
    try {
      this.authService.verifyToken(client.handshake.auth.Authentication.value);
    } catch (e) {
      console.log("error sending product updated", e);
      throw new WsException("Unauthorized");
    }
  }
}
