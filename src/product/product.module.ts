import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductGateway } from "./product.gateway";

@Module({
  controllers: [ProductController],
  providers: [ProductGateway],
})
export class ProductModule {}
