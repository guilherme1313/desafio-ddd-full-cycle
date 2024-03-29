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

  async update(entity: Order): Promise<void>{
    await OrderModel.update(
      {
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
        where: {
          id: entity.id,
        },
      }
    );

    await Promise.all(
      entity.items.map(async (item) => {
        await OrderItemModel.update(
          {
            product_id: item.productId,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      })
    );
  };

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

    const orderItem = new OrderItem(
      orderModel.items[0].id,
      orderModel.items[0].name,
      orderModel.items[0].price,
      orderModel.items[0].product_id,
      2
    );

    const order = new Order(id, orderModel.customer_id, [orderItem]);
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

    let orderItem: OrderItem[] = [];

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
