import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import { CreateProductUseCase } from "./create.product.usecase";
import { InputCreateProductDto } from "./create.product.dto";

describe("Test create product use case", () => {
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

  it("should create a product", async () => {
     const productRepository = new ProductRepository();
     const useCase = new CreateProductUseCase(productRepository);

     const input: InputCreateProductDto = {
        name: 'teste',
        price: 10.5
     };

     const output = await useCase.execute(input); 

        expect(output).toEqual({
            id: expect.any(String),
            name: 'teste',
            price: 10.5
        });
  });
});