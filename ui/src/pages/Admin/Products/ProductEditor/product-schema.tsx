import React from 'react';
import { TextInput, Textarea } from '@mantine/core';
import { EditableList, EditableImageList } from 'components';
import { PRODUCT } from 'utils';

type Field<T, P> = {
  key: string;
  value: any;
  component: T;
  props: P;
};

type FieldType<P> = P & { onUpdate?: (value: string) => void };

const TextInputField: React.FC<FieldType<React.ComponentProps<typeof TextInput>>> = (
  { onUpdate, ...props } //
) => <TextInput {...props} onChange={onUpdate ? e => onUpdate(e.target.value) : undefined} />;

const name: Field<typeof TextInputField, React.ComponentProps<typeof TextInputField>> = {
  key: 'name',
  value: '',
  component: TextInputField,
  props: {
    label: 'Name:',
    placeholder: 'Name',
    required: true,
  },
};

const TextAreaField: React.FC<FieldType<React.ComponentProps<typeof Textarea>>> = (
  { onUpdate, ...props } //
) => <Textarea {...props} onChange={onUpdate ? e => onUpdate(e.target.value) : undefined} />;

const description: Field<typeof TextAreaField, React.ComponentProps<typeof TextAreaField>> = {
  key: 'description',
  value: '',
  component: TextAreaField,
  props: {
    label: 'Description:',
    placeholder: 'Description',
    autosize: true,
    maxRows: 5,
    minRows: 3,
    required: true,
  },
};

const price: Field<typeof TextInputField, React.ComponentProps<typeof TextInputField>> = {
  key: 'price',
  value: '',
  component: TextInputField,
  props: {
    label: 'Price:',
    placeholder: 'Price',
    required: true,
  },
};

const weight: Field<typeof EditableList, React.ComponentProps<typeof EditableList>> = {
  key: 'weight',
  value: [],
  component: EditableList,
  props: {
    label: 'Weight Options',
  },
};

const schema = {
  [PRODUCT.PIZZA]: [
    name,
    description,
    // images: {},
    price,
    // weight,
  ],
  [PRODUCT.STARTERS]: [name, description, price],
  [PRODUCT.CHICKEN]: [name, description, price],
  [PRODUCT.DESSERTS]: [name, description, price],
  [PRODUCT.DRINKS]: [name, description, price],
};

export const useSchema = (type: string): [Field<any, any>[], { [key: string]: string }] => {
  const fields = schema[type];

  const initialState = React.useMemo(() => {
    const keyValue = fields.map(f => [f.key, f.value]);
    return keyValue.reduce<{ [key: string]: string }>((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }, [fields]);

  return [fields, initialState];
};
