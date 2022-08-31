import React from 'react';
import { TextInput, Textarea } from '@mantine/core';
import { EditableList, EditableImageList } from 'components';
import { PRODUCT } from 'utils';
import * as Yup from 'yup';
import Prices from './Prices';

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

const prices: Field<typeof Prices, React.ComponentProps<typeof Prices>> = {
  key: 'prices',
  value: [
    { variant: 'sm', value: 0, weight: 0 },
    { variant: 'md', value: 0, weight: 0 },
    { variant: 'lg', value: 0, weight: 0 },
  ],
  component: Prices,
  props: {
    variants: ['sm', 'md', 'lg'],
    generatePrice: variant => ({ variant, value: 0, weight: 0 }),
  },
  validate: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.number().min(0.1, 'Price must be greater than 0.1').required('Price value is required'),
        weight: Yup.number().min(0, 'Price must be greater than 0').required('Weight is required'),
      })
    )
    .min(1, 'Minimum 1 price required')
    .required('Required'),
};

const schema = {
  [PRODUCT.PIZZA]: [
    name,
    description,
    // images: {},
    prices,
  ],
  [PRODUCT.STARTERS]: [name, description],
  [PRODUCT.CHICKEN]: [name, description],
  [PRODUCT.DESSERTS]: [name, description],
  [PRODUCT.DRINKS]: [name, description],
};

export const useSchema = (type: string): [Field<any, any>[], { [key: string]: any }, Yup.AnyObjectSchema] => {
  const fields: Field<any, any>[] = schema[type];

  const initialState = React.useMemo(() => {
    const keyValue = fields.map(f => [f.key, f.value]);
    return keyValue.reduce<{ [key: string]: any }>((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }, [fields]);

  const validate = React.useMemo(() => Yup.object(fields.reduce((obj, field) => ({ ...obj, [field.key]: field.validate }), {})), [fields]);

  return [fields, initialState, validate];
};
