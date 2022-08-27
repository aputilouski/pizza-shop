import React from 'react';
import { Modal, Button, LoadingOverlay, Alert } from '@mantine/core';
import { useSchema } from './product-schema';
import { gql, useMutation } from '@apollo/client';
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
  mutation ($input: newProduct!) {
    addProduct(input: $input) {
      id
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation ($input: newProduct!) {
    addProduct(input: $input) {
      id
    }
  }
`;

const ProductEditor = ({ type, id, isCreation, opened, onClose, select, afterCreation }: ProductEditorProps) => {
  const [fields, initialValues, validate] = useSchema(type);

  const form = useForm({ initialValues, validate: yupResolver(validate) });

  const { reset } = form;
  React.useEffect(() => {
    if (!opened) reset();
  }, [opened, reset]);

  const [save, { loading, error }] = useMutation(isCreation ? CREATE_PRODUCT : UPDATE_PRODUCT, {
    refetchQueries: ['GetProducts'],
  });

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
          save({ variables: { input: { ...values, type } } }).then(() => {
            onClose();
            if (isCreation) afterCreation();
          })
        )}
        className="flex flex-col gap-2">
        {select}

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
