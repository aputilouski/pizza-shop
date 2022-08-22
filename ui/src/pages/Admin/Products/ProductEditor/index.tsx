import React from 'react';
import { Modal, Button } from '@mantine/core';
import { getSchema } from './product-schema';
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
  console.log(id, isCreation, opened);

  const schema = getSchema(type);

  return (
    <Modal
      styles={{ modal: opened ? { transform: 'none !important' } : undefined }} // fix for drag and drop
      title="Product Editor"
      size="xl"
      opened={opened}
      onClose={onClose}>
      {/* <LoadingOverlay visible={visible} overlayBlur={2} /> */}

      <div className="flex flex-col gap-2">
        {schema.map(({ component: Component, props, key }) => (
          <Component key={key} {...props} />
        ))}

        {/* <TextInput //
        placeholder="Name"
        label="Name"
        required
      />
      <Textarea //
        className="mt-2"
        placeholder="Description"
        label="Description"
        autosize
      />
      <Group grow className="mt-2">
        <TextInput //
          placeholder="Price"
          label="Price"
        />
        <TextInput //
          placeholder="Weight"
          label="Weight"
        />
      </Group> */}

        <EditableList
          title="Weight"
          value={[
            { key: 'test', value: 'Test' },
            { key: 'test2', value: 'Test2' },
            { key: 'test3', value: 'Test3' },
          ]}
          onChange={items => console.log(items)}
        />

        <div className="text-center mt-8">
          <Button>{isCreation ? 'Create' : 'Save'}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductEditor;
