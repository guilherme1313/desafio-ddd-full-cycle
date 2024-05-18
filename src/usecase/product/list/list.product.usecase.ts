import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";

export class ListProductUseCase{
    constructor(private readonly productRepository: ProductRepositoryInterface){}

    async execute(input: InputListProductDto): Promise<OutputListProductDto>{
        const dataProducts = await this.productRepository.findAll();

        const products = dataProducts.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price
          } as Product));

        return {
            products
        }
    }
}
