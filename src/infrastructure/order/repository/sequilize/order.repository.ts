import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    try {
      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: {
            id: entity.id,
          },
        }
      );

      await OrderItemModel.destroy({
        where: {
          order_id: entity.id,
        },
      });

      await OrderItemModel.bulkCreate(entity.items.map(item => ({
        id: item.id,
        order_id: entity.id,
        product_id: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      })));

    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  }
  

  async find(id: string): Promise<Order>{
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    let orderItem: OrderItem[] = [];

   orderModel.items.map((item) => {
    orderItem.push(
      new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        2
      )
    ); 
   });

    const order = new Order(id, orderModel.customer_id, orderItem);
    return order;
  };

  async findAll(): Promise<Order[]>{
    let orderModel;
    try {
      orderModel = await OrderModel.findAll({
        include: [{ model: OrderItemModel }],
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const order = orderModel.map((order) => {
     const itens = order.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
      });
      return new Order(order.id, order.customer_id, itens)
    });

    return order;
  };
}
