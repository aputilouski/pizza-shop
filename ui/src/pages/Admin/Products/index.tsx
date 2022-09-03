import React from 'react';
import { Button, Select, Table, Pagination, Overlay, ActionIcon, Text } from '@mantine/core';
import { ErrorAlert } from 'components';
import ProductEditor from './ProductEditor';
import { notify, PRODUCT } from 'utils';
import { gql, useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { IconEdit, IconTrash } from '@tabler/icons';
import { openConfirmModal } from '@mantine/modals';

const GET_PRODUCTS = gql`
  query GetProducts($limit: Int, $offset: Int, $type: ProductType) {
    products(limit: $limit, offset: $offset, type: $type) {
      rows {
        id
        name
        updatedAt
        createdAt
      }
      count
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    DeleteProduct(id: $id) {
      id
    }
  }
`;

const limit = 10;

const ProductManagment = () => {
  const [type, setType] = React.useState<ProductKey>(PRODUCT.TYPE[0]);
  const [page, setPage] = React.useState(1);
  const [editor, setEditor] = React.useState<{ id?: string; opened: boolean }>({ opened: false });

  const { loading, error, data } = useQuery<{ products: OffsetPagination<Pick<Product, 'id' | 'name' | 'updatedAt' | 'createdAt'>> }>(GET_PRODUCTS, {
    variables: { limit, offset: (page - 1) * limit, type },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });

  const [deleteProduct, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_PRODUCT, { refetchQueries: ['GetProducts'] });

  React.useEffect(() => {
    if (deleteError?.message) notify.error(deleteError.message);
  }, [deleteError]);

  const selectData = React.useMemo(() => PRODUCT.TYPE.map(key => ({ value: key, label: PRODUCT.LABEL[key] })), []);
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

  const onDelete = React.useCallback(
    (id: string) =>
      openConfirmModal({
        title: 'Please confirm your action',
        children: <Text size="sm">Do you really want to delete this item?</Text>,
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: () => deleteProduct({ variables: { id } }),
      }),
    [deleteProduct]
  );

  const onEdit = React.useCallback((id: string) => setEditor({ id, opened: true }), []);

  return (
    <>
      <ProductEditor //
        type={type}
        id={editor.id}
        isCreation={!editor.id}
        afterCreation={() => setPage(1)}
        opened={editor.opened}
        onClose={() => setEditor({ id: undefined, opened: false })}
        select={select}
      />

      <div className="flex gap-2 mb-10">
        {select}
        <Button onClick={() => setEditor({ opened: true })}>Create</Button>
      </div>

      {error && <ErrorAlert message={error.message} />}

      <div className="relative py-1">
        {(loading || deleteLoading) && <Overlay opacity={0.4} color="white" />}

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
            {data?.products.rows.map((product, index) => (
              <tr key={product.id} className="h-10">
                <td>{index + 1}</td>
                <td className="max-w-0 truncate">{product.name}</td>
                <td>{moment(product.updatedAt).format('DD/MM/YYYY hh:mm')}</td>
                <td>{moment(product.createdAt).format('DD/MM/YYYY hh:mm')}</td>
                <td>
                  <Actions //
                    onDelete={() => onDelete(product.id)}
                    onEdit={() => onEdit(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="my-10 flex justify-center">
          <Pagination //
            radius="xl"
            page={page}
            onChange={setPage}
            total={Math.ceil((data?.products.count ?? 1) / limit)}
          />
        </div>
      </div>
    </>
  );
};

const Actions = ({ onDelete, onEdit }: { onDelete: () => void; onEdit: () => void }) => (
  <div className="flex gap-2">
    <ActionIcon color="dark" variant="subtle" size={24} onClick={onEdit}>
      <IconEdit size={16} />
    </ActionIcon>

    <ActionIcon color="dark" variant="subtle" size={24} onClick={onDelete}>
      <IconTrash size={16} />
    </ActionIcon>
  </div>
);

export default ProductManagment;
