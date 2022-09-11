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
  description?: string;
  prices: Array<Price>;
  images: string[];
  updatedAt: string;
  createdAt: string;
};

type Price = ProductPrice & { weight?: PizzaPrice.weight };

type ProductKey = Product.type;

type SizeKey = 'sm' | 'md' | 'lg';

type ProductPrice = {
  variant: string;
  value: number;
};

type ProductPriceWithWeight = ProductPrice & {
  variant: SizeKey;
  weight: number;
};

type CartItem = {
  id: string; // Product id
  variant: string; // Price variant
  amount: number;
};

type Order = {
  id: string; // Product id
  number: number;
  status: string;
  address: {
    city: string;
    addr: string;
    entrance: string;
    floor: string;
    flat: string;
    phone: string;
    note: string;
  };
  items: {
    name: string;
    amount: number;
    variant: string;
    price: string;
  }[];
  total: string;
  createdAt: string;
};

type Edge<T> = {
  node: T;
  cursor: string;
};

type CursorPagination<T> = {
  totalCount: number;
  edges: Edge<T>[];
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
