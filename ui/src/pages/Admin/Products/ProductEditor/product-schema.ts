import { TextInput, Textarea, Select } from '@mantine/core';
import { PRODUCT } from 'utils';

type Field<T, P> = {
  key: string;
  component: T;
  props: P;
};

const name: Field<typeof TextInput, React.ComponentProps<typeof TextInput>> = {
  key: 'name',
  component: TextInput,
  props: {
    label: 'Name:',
    placeholder: 'Name',
    required: true,
  },
};

const description: Field<typeof Textarea, React.ComponentProps<typeof Textarea>> = {
  key: 'description',
  component: Textarea,
  props: {
    label: 'Description:',
    placeholder: 'Description',
    autosize: true,
    maxRows: 5,
    minRows: 3,
    required: true,
  },
};

const price: Field<typeof TextInput, React.ComponentProps<typeof TextInput>> = {
  key: 'price',
  component: TextInput,
  props: {
    label: 'Price:',
    placeholder: 'Price',
    required: true,
  },
};

const schema = {
  [PRODUCT.PIZZA]: [
    name,
    description,
    // images: {},
    price,
    // weight: {
    //   component: Select,
    //   props: {
    //     label: 'Weight:',
    //     data: [
    //       { value: 'sm', label: 'Small ()' },
    //       { value: 'md', label: 'Medium (550g)' },
    //       { value: 'lg', label: 'Large ()' },
    //     ],
    //   },
    // },
  ],
  [PRODUCT.STARTERS]: [name, description, price],
  [PRODUCT.CHICKEN]: [name, description, price],
  [PRODUCT.DESSERTS]: [name, description, price],
  [PRODUCT.DRINKS]: [name, description, price],
};

export const getSchema = (type: string): Field<any, any>[] => schema[type];
