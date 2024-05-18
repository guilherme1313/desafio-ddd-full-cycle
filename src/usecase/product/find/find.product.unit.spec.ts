import Product from "../../../domain/product/entity/product";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";
import { FindProductUseCase } from "./find.product.usecase";

const product = new Product("123", "teste", 10.5);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test find product use case", () => {
 it("should find a product", async () => {
    const productRepository = MockRepository();
    const useCase = new FindProductUseCase(productRepository);

    const input: InputFindProductDto = {
        id: "123"
    };

    const output: OutputFindProductDto = {
        id: "123",
        name: "teste",
        price: 10.5
    };

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
 });

 it("should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
        throw new Error("Product not found");
    });

    const useCase = new FindProductUseCase(productRepository);

    const input: InputFindProductDto = {
        id: "123"
    };

    expect(() => {
      return useCase.execute(input);
    }).rejects.toThrow(new Error("Product not found"));
 });
});