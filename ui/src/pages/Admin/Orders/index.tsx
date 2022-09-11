import React from 'react';
import { useQuery, useMutation, useSubscription, ApolloError, ApolloCache, MutationUpdaterFunction, OperationVariables, DefaultContext } from '@apollo/client';
import { GET_ORDERS, ORDER_SUBSCRIPTION, UPDATE_ORDER_STATUS } from 'gql';
import { Overlay, Button } from '@mantine/core';
import { ErrorAlert } from 'components';
import OrderCard from './OrderCard';
import { notify, ORDER_STATUS } from 'utils';

const ShowSuccessMessage = () => notify.success('Status has been successfully changed');
const ShowErrorMessage = (e: ApolloError) => notify.error(e.message);

const OrderManagement = () => {
  const [status, setStatus] = React.useState<string>(ORDER_STATUS.KEYS[0]);

  const { loading, error, data, fetchMore } = useQuery<{ orders: CursorPagination<Order> }>(GET_ORDERS, {
    variables: { first: 6, status },
    notifyOnNetworkStatusChange: true,
  });

  const [updateStatus] = useMutation<{ UpdateOrderStatus: { id: string; status: string } }>(UPDATE_ORDER_STATUS);

  useSubscription<{ OrderCreatedEdge: { node: Order; cursor: string } }>(ORDER_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (!subscriptionData.data) return;
      const { node, cursor } = subscriptionData.data.OrderCreatedEdge;
      notify.success(`New order #${node.number} received`);
      const cursorPagination: { orders: CursorPagination<Order> } | null = client.cache.readQuery({ query: GET_ORDERS, variables: { status: ORDER_STATUS.INITIATED } });
      if (!cursorPagination) {
        client.refetchQueries({ include: [GET_ORDERS] });
        return notify.error('Oops. Something went wrong');
      }
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

  // React.useEffect(() => {
  //   subscribeToMore<{ OrderCreatedEdge: { node: Order; cursor: string } }>({
  //     document: ORDER_SUBSCRIPTION,
  //     updateQuery: (prev, { subscriptionData }) => {
  //       const { node, cursor } = subscriptionData.data.OrderCreatedEdge;
  //       return {
  //         ...prev,
  //         orders: {
  //           totalCount: prev.orders.totalCount + 1,
  //           edges: [{ node, cursor }, ...prev.orders.edges],
  //           pageInfo: { ...prev.orders.pageInfo, startCursor: cursor },
  //         },
  //       };
  //     },
  //     onError: error => notify.error(error.message),
  //   });
  // }, [subscribeToMore]);

  const UpdateOrderStatus: MutationUpdaterFunction<{ UpdateOrderStatus: { id: string; status: string } }, OperationVariables, DefaultContext, ApolloCache<any>> = (cache, { data }) => {
    if (!data) return;
    const values = data.UpdateOrderStatus;

    let currentOrderEdge: Edge<Order> | undefined = undefined;

    const currentOrders: { orders: CursorPagination<Order> } | null = cache.readQuery({ query: GET_ORDERS, variables: { status } });
    if (currentOrders) {
      currentOrderEdge = currentOrders.orders.edges.find(edge => edge.node.id === values.id);
      if (!currentOrderEdge) return;
      const edges = currentOrders.orders.edges.filter(edge => edge.node.id !== currentOrderEdge?.node.id);
      const data = {
        orders: {
          totalCount: currentOrders.orders.totalCount - 1,
          edges,
          pageInfo: {
            ...currentOrders.orders.pageInfo,
            startCursor: edges[0].cursor,
            endCursor: edges[edges.length - 1].cursor,
          },
        },
      };
      cache.writeQuery({ query: GET_ORDERS, variables: { status }, data });
      const nextOrders: { orders: CursorPagination<Order> } | null = cache.readQuery({ query: GET_ORDERS, variables: { status: values.status } });

      if (nextOrders) {
        const edges = [
          {
            ...currentOrderEdge,
            node: { ...currentOrderEdge.node, status: values.status },
          },
          ...nextOrders.orders.edges,
        ];
        const data = {
          orders: {
            totalCount: nextOrders.orders.totalCount + 1,
            edges,
            pageInfo: {
              ...nextOrders.orders.pageInfo,
              startCursor: edges[0].cursor,
              endCursor: edges[edges.length - 1].cursor,
            },
          },
        };
        cache.writeQuery({ query: GET_ORDERS, variables: { status: values.status }, data });
      }
    }
  };

  return (
    <div className="relative">
      {loading && !data && <Overlay opacity={0.4} color="white" />}
      <p className="mb-4 font-semibold text-2xl">Order management</p>

      <div className="flex gap-2 mb-2.5">
        {ORDER_STATUS.KEYS.map(key => (
          <Button //
            key={key}
            onClick={() => setStatus(key)}
            disabled={status === key}>
            {ORDER_STATUS.LABEL[key]}
          </Button>
        ))}
      </div>

      {error && <ErrorAlert message={error.message} />}
      <div className="flex flex-col gap-2">
        {data?.orders.edges.map(edge => (
          <OrderCard //
            key={edge.cursor}
            order={edge.node}
            setStatus={value => {
              if (value === status) return;
              updateStatus({
                variables: { id: edge.node.id, status: value },
                onCompleted: ShowSuccessMessage,
                onError: ShowErrorMessage,
                update: UpdateOrderStatus,
              });
            }}
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
