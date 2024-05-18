import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { UpdateProductUseCase } from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

const product = new Product("123", "teste", 10.5);

const input = {
    id: product.id,
    name: "teste123",
    price: 11.99
};

describe("Test update product use case", () => {
 let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
     const productRepository = new ProductRepository();
     const useCase = new UpdateProductUseCase(productRepository);

     await productRepository.create(product);

     const output = await useCase.execute(input); 

     expect(output).toEqual(input);
  });
});