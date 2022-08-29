import React from 'react';
import { Modal, Button, LoadingOverlay, Alert } from '@mantine/core';
import { useSchema } from './product-schema';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useForm, yupResolver } from '@mantine/form';

type ProductEditorProps = {
  type: ProductKey;
  id?: string;
  isCreation: boolean;
  opened: boolean;
  onClose: () => void;
  afterCreation: () => void;
  select: JSX.Element;
};

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductData!) {
    CreateProduct(input: $input) {
      id
    }
  }
`;

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductData!) {
    UpdateProduct(input: $input) {
      id
    }
  }
`;

const ProductEditor = ({ type, id, isCreation, opened, onClose, select, afterCreation }: ProductEditorProps) => {
  const [fields, initialValues, validate] = useSchema(type);

  const form = useForm({ initialValues, validate: yupResolver(validate) });
  const { reset, setValues } = form;

  const {
    loading: fetchingProduct,
    error: fetchingProductError,
    data,
  } = useQuery<{ product: Pick<Product, 'name' | 'description' | 'price'> }>(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !id,
  });

  React.useEffect(() => {
    if (!data) return;
    const { name, description, price } = data.product;
    setValues({ name, description, price });
  }, [data, setValues]);

  const [save, { loading: executingSave, error: saveError, reset: resetSaveData }] = useMutation(isCreation ? CREATE_PRODUCT : UPDATE_PRODUCT, { refetchQueries: ['GetProducts'] });

  React.useEffect(() => {
    if (opened) return;
    reset();
    resetSaveData();
  }, [opened, reset, resetSaveData]);

  const loading = executingSave || fetchingProduct;
  const error = fetchingProductError || saveError;

  return (
    <Modal
      styles={{ modal: opened ? { transform: 'none !important' } : undefined }} // fix for drag and drop
      title="Product Editor"
      size="xl"
      opened={opened}
      onClose={onClose}>
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <form //
        onSubmit={form.onSubmit(values =>
          save({ variables: { input: isCreation ? { ...values, type } : { ...values, id } } }).then(() => {
            onClose();
            if (isCreation) afterCreation();
          })
        )}
        className="flex flex-col gap-2">
        {isCreation && select}

        {fields.map(({ component: Component, props, key }) => (
          <Component key={key} {...props} {...form.getInputProps(key)} />
        ))}

        {error && <Alert color="red">{error.message}</Alert>}

        <div className="text-center mt-8">
          <Button type="submit" disabled={loading}>
            {isCreation ? 'Create' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductEditor;
