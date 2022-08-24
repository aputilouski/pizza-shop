import React from 'react';
import { Button, Select, Table, Pagination, LoadingOverlay } from '@mantine/core';
import { ErrorAlert } from 'components';
import ProductEditor from './ProductEditor';
import { PRODUCT } from 'utils';
import { gql, useQuery } from '@apollo/client';

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
    }
  }
`;

const ProductManagment = () => {
  const { loading, error, data } = useQuery<{ products: Pick<Product, 'id' | 'name' | 'price'>[] }>(GET_PRODUCTS);

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

      <div className="flex gap-2 mb-8">
        {select}

        <Button onClick={() => setEditor({ opened: true })}>Create</Button>
      </div>

      {error && <ErrorAlert message={error.message} />}

      <div className="relative">
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="my-8 flex justify-center">
          <Pagination radius="xl" total={10} />
        </div>
      </div>
    </>
  );
};

export default ProductManagment;
