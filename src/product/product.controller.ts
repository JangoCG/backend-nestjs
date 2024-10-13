import { Controller, Post } from "@nestjs/common";
import { ProductGateway } from "./product.gateway";

@Controller("products")
export class ProductController {
  constructor(private readonly productGateway: ProductGateway) {}

  @Post()
  public createProduct() {
    console.log("In a real app this would create a product");
    this.productGateway.handleProductUpdated();
    return { message: "product updated" };
  }
}
