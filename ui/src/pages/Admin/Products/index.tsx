import React from 'react';
import { Button, Select, Table, Pagination, LoadingOverlay, ActionIcon } from '@mantine/core';
import { ErrorAlert } from 'components';
import ProductEditor from './ProductEditor';
import { PRODUCT } from 'utils';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';
import { IconEdit, IconTrash } from '@tabler/icons';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      totalCount
      edges {
        node {
          id
          name
          updatedAt
          createdAt
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const ProductManagment = () => {
  const { loading, error, data } = useQuery<{ products: CursorPagination<Pick<Product, 'id' | 'name' | 'updatedAt' | 'createdAt'>> }>(GET_PRODUCTS);

  console.log(data);
  const [type, setType] = React.useState<ProductKey>(PRODUCT.KEYS[0]);
  const [editor, setEditor] = React.useState<{ id?: string; opened: boolean }>({ opened: false });

  const selectData = React.useMemo(() => PRODUCT.KEYS.map(key => ({ value: key, label: PRODUCT.LABEL[key] })), []);

  const select = React.useMemo(
    () => (
      <Select //
        value={type}
        data={selectData}
        onChange={type => (type ? setType(type as ProductKey) : undefined)}
      />
    ),
    [selectData, type]
  );

  return (
    <>
      <ProductEditor //
        type={type}
        id={editor.id}
        isCreation={!editor.id}
        opened={editor.opened}
        onClose={() => setEditor({ id: undefined, opened: false })}
        select={select}
      />

      <div className="flex gap-2 mb-10">
        {select}
        <Button onClick={() => setEditor({ opened: true })}>Create</Button>
      </div>

      {error && <ErrorAlert message={error.message} />}

      <div className="relative">
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Name</th>
              <th className="w-60">Updated At</th>
              <th className="w-60">Created At</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.edges.map((edge, index) => (
              <tr key={edge.node.id} className="h-10">
                <td>{index + 1}</td>
                <td className="max-w-0 truncate">{edge.node.name}</td>
                <td>{moment(edge.node.updatedAt).format('DD/MM/YYYY hh:mm')}</td>
                <td>{moment(edge.node.createdAt).format('DD/MM/YYYY hh:mm')}</td>
                <td>
                  <Actions />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="my-10 flex justify-center">
          <Pagination radius="xl" total={10} />
        </div>
      </div>
    </>
  );
};

const Actions = () => (
  <div className="flex gap-2">
    <ActionIcon color="dark" variant="subtle" size={24}>
      <IconEdit size={16} />
    </ActionIcon>

    <ActionIcon color="dark" variant="subtle" size={24}>
      <IconTrash size={16} />
    </ActionIcon>
  </div>
);

export default ProductManagment;
