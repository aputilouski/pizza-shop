/// <reference types="react-scripts" />

interface Window {
  browserHistory: any;
}

type User = {
  id: string;
  name: string;
  username: string;
};

type Product = {
  id: string;
  type: 'pizza' | 'starters' | 'chicken' | 'desserts' | 'drinks';
  name: string;
  description: string;
  prices: Array<Price>;
  images: string[];
  updatedAt: string;
  createdAt: string;
};

type Price = ProductPrice & Pick<PizzaPrice, 'weight'>;

type ProductKey = Product.type;

type SizeKey = 'sm' | 'md' | 'lg';

type ProductPrice = {
  variant: string;
  value: number;
};

type PizzaPrice = ProductPrice & {
  variant: SizeKey;
  weight: number;
};

type CursorPagination<T> = {
  totalCount: number;
  edges: {
    node: T;
    cursor: string;
  }[];
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type OffsetPagination<T> = {
  count: number;
  rows: T[];
};
