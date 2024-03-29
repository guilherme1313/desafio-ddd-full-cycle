import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";
import ProductCreatedEvent from "../customer-created.event";

export default class EnviaConsoleLog1Handler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: ProductCreatedEvent): void {
    console.log(`Esse é o primeiro console.log do evento: CustomerCreated`); 
  }
}
