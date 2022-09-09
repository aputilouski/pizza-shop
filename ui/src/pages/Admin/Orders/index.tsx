import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_ORDERS, ORDER_SUBSCRIPTION, UPDATE_ORDER_STATUS } from 'gql';
import { Overlay, Button } from '@mantine/core';
import { ErrorAlert } from 'components';
import OrderCard from './OrderCard';
import { notify } from 'utils';

const OrderManagement = () => {
  const { loading, error, data, fetchMore, subscribeToMore } = useQuery<{ orders: CursorPagination<Order> }>(GET_ORDERS, {
    variables: { first: 6 },
    notifyOnNetworkStatusChange: true,
  });

  const [updateStatus] = useMutation<{ UpdateOrderStatus: { id: string; status: string } }>(UPDATE_ORDER_STATUS);

  React.useEffect(() => {
    subscribeToMore<{ OrderCreatedEdge: { node: Order; cursor: string } }>({
      document: ORDER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        const { node, cursor } = subscriptionData.data.OrderCreatedEdge;
        return {
          ...prev,
          orders: {
            totalCount: prev.orders.totalCount + 1,
            edges: [{ node, cursor }, ...prev.orders.edges],
            pageInfo: { ...prev.orders.pageInfo, startCursor: cursor },
          },
        };
      },
      onError: error => notify.error(error.message),
    });
  }, [subscribeToMore]);

  return (
    <div className="relative">
      {loading && !data && <Overlay opacity={0.4} color="white" />}
      <p className="mb-4 font-semibold text-2xl">Order management</p>
      {error && <ErrorAlert message={error.message} />}
      <div className="flex flex-col gap-2">
        {data?.orders.edges.map(edge => (
          <OrderCard //
            key={edge.cursor}
            order={edge.node}
            setStatus={status =>
              updateStatus({
                variables: { id: edge.node.id, status },
                onCompleted: () => notify.success('Status has been successfully changed'),
                onError: e => notify.error(e.message),
                update: (cache, { data }) => {
                  if (!data) return;
                  const { id, status } = data.UpdateOrderStatus;
                  cache.writeFragment({
                    id: `Order:${id}`,
                    fragment: gql`
                      fragment MyOrder on Order {
                        status
                      }
                    `,
                    data: { status },
                  });
                },
              })
            }
          />
        ))}
      </div>

      <div className="text-center my-4">
        <Button //
          disabled={loading || data?.orders.edges.length === data?.orders.totalCount}
          onClick={() => fetchMore({ variables: { after: data?.orders.pageInfo.endCursor } })}>
          Load More
        </Button>
      </div>
    </div>
  );
};

export default OrderManagement;
