import Product from "../../../domain/product/entity/product";
import { ListProductUseCase } from "./list.product.usecase";

const product1 = new Product("a", "teste1", 10.5);
const product2 = new Product("a", "teste2", 10.5);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test list product use case", () => {
  it("should list a product", async () => {
      const repository = MockRepository();
      const useCase = new ListProductUseCase(repository);

      const output = await useCase.execute({});

      expect(output.products.length).toBe(2);
      expect(output.products[0].id).toBe(product1.id);
      expect(output.products[1].id).toBe(product2.id);
  });
});