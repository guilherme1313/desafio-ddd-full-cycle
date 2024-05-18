import { InputCreateProductDto } from "./create.product.dto";
import { CreateProductUseCase } from "./create.product.usecase";

const input: InputCreateProductDto = {
    name: 'teste',
    price: 10.5
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(input); 

        expect(output).toEqual({
            id: expect.any(String),
            name: 'teste',
            price: 10.5
        });
    });


    it("should thrown an error when name is missing", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);
    
        input.name = "";
    
        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            new Error("Name is required")
        );
    });

    it("should thrown an error when price is less than zero", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);
        
        input.name = "teste";
        input.price = -1;
    
        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            new Error("Price must be greater than zero")
        );
    });
});