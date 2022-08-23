import React from 'react';
import { Modal, Button } from '@mantine/core';
import { useSchema } from './product-schema';
import { PRODCUCT_KEY } from 'utils';
import { EditableList } from 'components';

type ProductEditorProps = {
  type: PRODCUCT_KEY;
  id?: string;
  isCreation: boolean;
  opened: boolean;
  onClose: () => void;
};

const ProductEditor = ({ type, id, isCreation, opened, onClose }: ProductEditorProps) => {
  const [fields, initialSchema] = useSchema(type);
  const [values, setValues] = React.useState(initialSchema);

  console.log(values);

  return (
    <Modal
      styles={{ modal: opened ? { transform: 'none !important' } : undefined }} // fix for drag and drop
      title="Product Editor"
      size="xl"
      opened={opened}
      onClose={onClose}>
      {/* <LoadingOverlay visible={visible} overlayBlur={2} /> */}

      <div className="flex flex-col gap-2">
        {fields.map(({ component: Component, props, key }) => (
          <Component //
            key={key}
            {...props}
            value={values[key]}
            onUpdate={(value: string) => setValues(values => ({ ...values, [key]: value }))}
          />
        ))}

        <div className="text-center mt-8">
          <Button>{isCreation ? 'Create' : 'Save'}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductEditor;
