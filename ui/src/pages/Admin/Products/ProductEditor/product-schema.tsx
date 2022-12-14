import React from 'react';
import { TextInput, Textarea } from '@mantine/core';
import { EditableImageList } from 'components';
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
  validate: Yup.string(),
};

const pizzaPrices: Field<typeof Prices, React.ComponentProps<typeof Prices>> = {
  key: 'prices',
  value: [
    { variant: 'sm', value: 10, weight: 100 },
    { variant: 'md', value: 10, weight: 100 },
    { variant: 'lg', value: 10, weight: 100 },
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
    .min(1, 'Minimum 1 price required'),
};

const prices: Field<typeof Prices, React.ComponentProps<typeof Prices>> = {
  key: 'prices',
  value: [{ variant: 'default', value: 10, weight: 100 }],
  component: Prices,
  props: {
    variants: ['default'],
    generatePrice: variant => ({ variant, value: 0, weight: 100 }),
  },
  validate: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.number().min(0.1, 'Price must be greater than 0.1').required('Price value is required'),
      })
    )
    .min(1, 'Minimum 1 price required'),
};

const drinkPrices: Field<typeof Prices, React.ComponentProps<typeof Prices>> = {
  key: 'prices',
  value: [{ variant: 'default', value: 10 }],
  component: Prices,
  props: {
    variants: ['default'],
    generatePrice: variant => ({ variant, value: 0 }),
  },
  validate: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.number().min(0.1, 'Price must be greater than 0.1').required('Price value is required'),
      })
    )
    .min(1, 'Minimum 1 price required'),
};

const images: Field<typeof EditableImageList, React.ComponentProps<typeof EditableImageList>> = {
  key: 'images',
  value: [],
  component: EditableImageList,
  props: {},
  validate: Yup.array().min(1, 'Minimum 1 image required'),
};

const schema = {
  [PRODUCT.PIZZA]: [name, description, pizzaPrices, images],
  [PRODUCT.STARTERS]: [name, description, prices, images],
  [PRODUCT.CHICKEN]: [name, description, prices, images],
  [PRODUCT.DESSERTS]: [name, description, prices, images],
  [PRODUCT.DRINKS]: [name, description, drinkPrices, images],
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
