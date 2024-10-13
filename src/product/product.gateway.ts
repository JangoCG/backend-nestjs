import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    // TODO: Should not be star for everything
    origin: "*",
    methods: ["GET", "POST"],
  },
})
export class ProductGateway {
  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdated() {
    this.server.emit("productUpdated");
  }
}
