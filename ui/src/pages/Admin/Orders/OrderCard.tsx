import { Card } from '@mantine/core';
import { PRICE_LABEL } from 'utils';

const OrderCard = ({ order }: { order: Order }) => (
  <Card shadow="sm" radius="sm" withBorder>
    <p className="border-0 border-b border-solid mb-3 pb-0.5">
      #{order.number} ({order.status})
    </p>

    <div className="flex gap-3">
      <div className="flex-1 flex flex-col">
        {order.items.map((item, index) => (
          <div key={index} className="mb-1">
            {item.name} ({PRICE_LABEL[item.variant as keyof typeof PRICE_LABEL]}) ${item.price} x{item.amount}
          </div>
        ))}
      </div>
      <div className="flex-1">
        <p className="mb-1">
          {order.address.city}, {order.address.addr}, entrance: {order.address.entrance}, floor: {order.address.floor}, flat: {order.address.flat}
        </p>
        <p className="mb-1">Phone: {order.address.phone}</p>
        {order.address.note && <p>Note: {order.address.note}</p>}
        <p className="mt-3 font-bold">Total: {order.total} $</p>
      </div>
    </div>
  </Card>
);

export default OrderCard;
