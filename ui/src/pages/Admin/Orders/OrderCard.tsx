import { Card, Select } from '@mantine/core';
import { PRICE_LABEL, ORDER_STATUS } from 'utils';
import moment from 'moment';

const OrderCard = ({ order, setStatus }: { order: Order; setStatus: (status: string) => void }) => (
  <Card shadow="sm" radius="sm" withBorder className="overflow-visible">
    <div className="border-0 border-b border-solid mb-3.5 pb-2 flex justify-between items-center">
      <div>
        <b>#{order.number}</b>
        <Select //
          className="inline-block ml-2.5"
          size="xs"
          value={order.status}
          data={ORDER_STATUS.KEYS.map(key => ({ value: key, label: ORDER_STATUS.LABEL[key] }))}
          onChange={status => status && setStatus(status)}
        />
      </div>
      <p>{moment(order.createdAt).format('DD/MM/YYYY hh:mm')}</p>
    </div>

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
