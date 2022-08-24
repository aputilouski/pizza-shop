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
};

type ProductKey = Product.type;
