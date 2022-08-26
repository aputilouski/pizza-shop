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
  price: number;
  updatedAt: string;
  createdAt: string;
};

type ProductKey = Product.type;

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
