import React from 'react';
import { useSubscription } from '@apollo/client';
import { GET_ORDERS, ORDER_SUBSCRIPTION } from 'gql';
import { notify, ORDER_STATUS } from 'utils';

const SubscriptionManager = ({ children }: { children: JSX.Element }) => {
  const { error } = useSubscription<{ OrderCreatedEdge: { node: Order; cursor: string } }>(ORDER_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (!subscriptionData.data) return;
      const { node, cursor } = subscriptionData.data.OrderCreatedEdge;
      notify.success(`New order #${node.number} received`);
      const cursorPagination: { orders: CursorPagination<Order> } | null = client.cache.readQuery({ query: GET_ORDERS, variables: { status: ORDER_STATUS.INITIATED } });

      // client.refetchQueries({ include: [GET_ORDERS] });
      // return notify.error('Oops. Something went wrong');

      if (!cursorPagination) return;

      client.cache.writeQuery({
        query: GET_ORDERS,
        variables: { status: ORDER_STATUS.INITIATED },
        data: {
          orders: {
            totalCount: cursorPagination.orders.totalCount + 1,
            edges: [{ node, cursor }, ...cursorPagination.orders.edges],
            pageInfo: { ...cursorPagination.orders.pageInfo, startCursor: cursor },
          },
        },
      });
    },
  });

  React.useEffect(() => {
    if (error) {
      console.error(error);
      notify.error(error.message);
    }
  }, [error]);

  return children;
};

export default SubscriptionManager;
