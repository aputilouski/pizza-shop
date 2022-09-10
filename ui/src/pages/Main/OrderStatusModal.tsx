import React from 'react';
import { ActionIcon, Modal, Transition, Card } from '@mantine/core';
import { IconTruckDelivery } from '@tabler/icons';
import { useCart } from './CartProvider';
import { notify, ORDER_STATUS, PRICE_LABEL } from 'utils';
import { useSubscription, useLazyQuery } from '@apollo/client';
import { ORDER_STATUS_SUBSCRIPTION, GET_USER_ORDERS } from 'gql';

const OrderCard = ({ order }: { order: Order }) => (
  <Card shadow="sm" radius="sm" withBorder className="overflow-visible">
    <div className="border-0 border-b border-solid mb-3.5 pb-2">
      <b>#{order.number}</b> {ORDER_STATUS.LABEL[order.status as keyof typeof ORDER_STATUS.LABEL]}
    </div>

    <div className="flex gap-3">
      <div className="flex-1 flex flex-col">
        {order.items.map((item, index) => (
          <div key={index} className="mb-1 text-sm">
            {item.name} ({PRICE_LABEL[item.variant as keyof typeof PRICE_LABEL]}) ${item.price} x{item.amount}
          </div>
        ))}
      </div>
      <div className="flex-1">
        <p className="mb-1 text-sm">
          {order.address.city}, {order.address.addr}, entrance: {order.address.entrance}, floor: {order.address.floor}, flat: {order.address.flat}
        </p>
        <p className="mb-1 text-sm">Phone: {order.address.phone}</p>
        {order.address.note && <p>Note: {order.address.note}</p>}
        <p className="mt-2.5 font-bold">Total: {order.total} $</p>
      </div>
    </div>
  </Card>
);

const OrderStatusModal = () => {
  const [open, setOpen] = React.useState(false);

  const { orders, updateOrderStatus, pushOrders } = useCart();

  const [getUserOrders] = useLazyQuery<{ getUserOrders: Order[] }>(GET_USER_ORDERS, {
    onCompleted: data => pushOrders(data.getUserOrders),
  });

  React.useEffect(() => {
    const str = localStorage.getItem('orders');
    if (!str) return;
    const idArray: string[] = JSON.parse(str);
    if (idArray.length === 0) return;
    getUserOrders({ variables: { id: idArray } });
  }, [getUserOrders]);

  React.useEffect(() => {
    const array = orders.map(o => o.id);
    localStorage.setItem('orders', JSON.stringify(array));
  }, [orders]);

  const { error } = useSubscription<{ OrderStatusChanged: { id: string; status: string } }>(ORDER_STATUS_SUBSCRIPTION, {
    variables: { id: orders.map(o => o.id) },
    onSubscriptionData: options => {
      const data = options.subscriptionData.data;
      if (!data) return;
      const { id, status } = data.OrderStatusChanged;
      updateOrderStatus(id, status);
    },
  });

  React.useEffect(() => {
    if (error) notify.error(error.message);
  }, [error]);

  return (
    <>
      <div className="fixed w-full max-w-screen-xl bottom-16 h-0 my-2">
        <Transition mounted={orders.length !== 0} transition="fade" duration={150} timingFunction="ease-out">
          {styles => (
            <ActionIcon //
              style={styles}
              onClick={() => setOpen(true)}
              className="ml-auto mr-0"
              variant="filled"
              size={60}
              radius="xl"
              color="orange">
              <IconTruckDelivery size={36} />
            </ActionIcon>
          )}
        </Transition>
      </div>
      <Modal //
        size="xl"
        title="Orders"
        opened={open}
        onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-2">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default OrderStatusModal;
