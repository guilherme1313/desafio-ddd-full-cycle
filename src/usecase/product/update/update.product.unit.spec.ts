import Product from "../../../domain/product/entity/product";
import { UpdateProductUseCase } from "./update.product.usecase";

const product = new Product("123", "teste", 10.5);

const input = {
    id: product.id,
    name: "teste123",
    price: 11.99
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test update product use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const output = await useCase.execute(input); 

        expect(output).toEqual(input);
    });
});