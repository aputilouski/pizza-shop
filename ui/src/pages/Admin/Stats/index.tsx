import React from 'react';
import { LoadingOverlay, Select } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { GET_STATS } from 'gql';
import AnimatedNumber from 'animated-number-react';
import { notify } from 'utils';
import moment from 'moment';

const StatsCard = ({ title, value }: { title: string; value: number }) => (
  <div className="flex-1">
    <AnimatedNumber //
      value={value}
      className="text-4xl font-bold block text-center"
      formatValue={(v: number) => v.toFixed()}
      delay={150}
    />
    <p className="font-semibold text-lg text-center mt-3">{title}</p>
  </div>
);

type Stats = {
  completedOrders: number;
  inDeliveryOrders: number;
  inKitchenOrders: number;
  initiatedOrders: number;
  receivedOrders: number;
};

const options = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'This day' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
];

const Page = () => {
  const [filter, setFilter] = React.useState<string | null>('day');
  const [start, setStart] = React.useState<string>();

  React.useEffect(() => {
    const current = moment();
    if (filter) {
      if (filter === 'hour') setStart(current.subtract(1, 'h').toISOString());
      if (filter === 'day') {
        const dayStart = current.startOf('day').add(6, 'h');
        if (current > dayStart) setStart(dayStart.toISOString());
        else setStart(dayStart.subtract(1, 'd').toISOString());
      }
      if (filter === 'week') setStart(moment().startOf('week').add(6, 'h').toISOString());
      if (filter === 'month') setStart(moment().startOf('month').add(6, 'h').toISOString());
    }
  }, [filter]);

  const { loading, data, startPolling, stopPolling } = useQuery<{ stats: Stats }>(GET_STATS, {
    variables: { start },
    onError: e => notify.error(e.message),
    fetchPolicy: 'network-only',
    skip: !start,
  });

  React.useEffect(() => {
    startPolling(1e4);
    return stopPolling;
  }, [startPolling, stopPolling]);

  return (
    <>
      <div className="mb-5 font-semibold text-2xl flex items-center gap-4">
        <p>Statistics:</p>
        <Select //
          data={options}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <hr />

      <div className="relative mt-16">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <div className="flex">
          <StatsCard title="Initiated Orders" value={data?.stats.initiatedOrders || 0} />
          <StatsCard title="Received Orders" value={data?.stats.receivedOrders || 0} />
          <StatsCard title="In kitchen Orders" value={data?.stats.inKitchenOrders || 0} />
          <StatsCard title="In delivery Orders" value={data?.stats.inDeliveryOrders || 0} />
          <StatsCard title="Completed Orders" value={data?.stats.completedOrders || 0} />
        </div>
      </div>
    </>
  );
};

export default Page;
