import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductGateway } from "./product.gateway";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [ProductGateway],
})
export class ProductModule {}
