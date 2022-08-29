import React from 'react';
import { TextInput, Textarea, NumberInput } from '@mantine/core';
import { EditableList, EditableImageList } from 'components';
import { PRODUCT } from 'utils';
import * as Yup from 'yup';

type Field<T, P> = {
  key: string;
  value: any;
  component: T;
  props: P;
  validate: Yup.AnySchema;
};

const name: Field<typeof TextInput, React.ComponentProps<typeof TextInput>> = {
  key: 'name',
  value: '',
  component: TextInput,
  props: {
    label: 'Name:',
    placeholder: 'Name',
  },
  validate: Yup.string().required('Required'),
};

const description: Field<typeof Textarea, React.ComponentProps<typeof Textarea>> = {
  key: 'description',
  value: '',
  component: Textarea,
  props: {
    label: 'Description:',
    placeholder: 'Description',
    autosize: true,
    maxRows: 5,
    minRows: 3,
  },
  validate: Yup.string().required('Required'),
};

const price: Field<typeof NumberInput, React.ComponentProps<typeof NumberInput>> = {
  key: 'price',
  value: 0,
  component: NumberInput,
  props: {
    label: 'Price:',
    placeholder: 'Price',
    decimalSeparator: ',',
    step: 0.1,
    precision: 2,
  },
  validate: Yup.number().min(0, 'Price must be greater than 0').required('Required'),
};

// const prices = {
//   key: 'prices',
//   value: [{ key: 'sm', value: 0, weight: 0 }],
//   // component: null,
//   // props: {}
//   // validate:
// };

// const weight: Field<typeof EditableList, React.ComponentProps<typeof EditableList>> = {
//   key: 'weight',
//   value: [],
//   component: EditableList,
//   props: {
//     label: 'Weight Options',
//   },
// };

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

export const useSchema = (type: string): [Field<any, any>[], { [key: string]: any }, Yup.AnyObjectSchema] => {
  const fields = schema[type];

  const initialState = React.useMemo(() => {
    const keyValue = fields.map(f => [f.key, f.value]);
    return keyValue.reduce<{ [key: string]: string }>((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }, [fields]);

  const validate = React.useMemo(() => Yup.object(fields.reduce((obj, field) => ({ ...obj, [field.key]: field.validate }), {})), [fields]);

  return [fields, initialState, validate];
};
