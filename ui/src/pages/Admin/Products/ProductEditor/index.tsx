import React from 'react';
import { Modal, Button, LoadingOverlay, Alert } from '@mantine/core';
import { useSchema } from './product-schema';
import { useMutation, useQuery } from '@apollo/client';
import { useForm, yupResolver } from '@mantine/form';
import { CREATE_PRODUCT, GET_PRODUCT, UPDATE_PRODUCT } from 'gql';

type ProductEditorProps = {
  type: ProductKey;
  id?: string;
  isCreation: boolean;
  opened: boolean;
  onClose: () => void;
  afterCreation: () => void;
  select: JSX.Element;
};

const ProductEditor = ({ type, id, isCreation, opened, onClose, select, afterCreation }: ProductEditorProps) => {
  const [fields, initialValues, validate] = useSchema(type);

  const form = useForm({ initialValues, validate: yupResolver(validate) });
  const { setValues } = form;

  const {
    loading: fetchingProduct,
    error: fetchingProductError,
    data,
  } = useQuery<{ product: Pick<Product, 'name' | 'description' | 'prices' | 'images'> }>(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !id,
  });

  // set loaded product
  React.useEffect(() => {
    if (!data) return;
    const { name, description, prices, images } = data.product;
    setValues({
      name,
      description,
      prices: prices.map(({ variant, value, weight }) => ({ variant, value, weight })),
      images,
    });
  }, [data, setValues]);

  const [save, { loading: executingSave, error: saveError, data: saveData, reset: resetSaveData }] = useMutation(isCreation ? CREATE_PRODUCT : UPDATE_PRODUCT, { refetchQueries: ['GetProducts'] });

  // close editor after save
  React.useEffect(() => {
    if (!saveData) return;
    onClose();
    if (isCreation) afterCreation();
  }, [afterCreation, isCreation, onClose, saveData]);

  // update initialValues on type change
  React.useEffect(() => {
    setValues(initialValues);
  }, [type, initialValues, setValues]);

  // reset form if closed
  React.useEffect(() => {
    if (opened) return;
    setValues(initialValues);
    resetSaveData();
  }, [initialValues, opened, resetSaveData, setValues]);

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
        onSubmit={form.onSubmit(values => save({ variables: { input: isCreation ? { ...values, type } : { ...values, id } } }))}
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
