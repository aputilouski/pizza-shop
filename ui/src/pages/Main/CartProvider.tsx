import React from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';

export const cartItems = makeVar<CartItem[]>([]);
export const userOrders = makeVar<Order[]>([]);

type CartContextType = {
  items: CartItem[];
  getAmount: (productID: string, priceVariant: string) => number;
  increase: (item: Omit<CartItem, 'amount'>) => void;
  decrease: (item: Omit<CartItem, 'amount'>) => void;
  remove: (item: CartItem) => void;
  clear: () => void;
  orders: Order[];
  pushOrder: (order: Order) => void;
  pushOrders: (orders: Order[]) => void;
  updateOrderStatus: (id: string, status: string) => void;
};

const CartContext = React.createContext<CartContextType>({
  items: [],
  getAmount: () => 0,
  increase: () => {},
  decrease: () => {},
  remove: () => {},
  clear: () => {},
  orders: [],
  pushOrder: () => {},
  pushOrders: () => {},
  updateOrderStatus: () => {},
});

export const ProvideCart = ({ children }: { children: React.ReactNode }) => {
  const items = useReactiveVar(cartItems);
  const orders = useReactiveVar(userOrders);

  const context: CartContextType = {
    items,
    getAmount: (id, variant) => {
      const item = items.find(i => i.id === id && i.variant === variant);
      return item ? item.amount : 0;
    },
    increase: ({ id, variant }) => {
      const item = items.find(i => i.id === id && i.variant === variant);
      if (!item) cartItems([...items, { id, variant, amount: 1 }]);
      else {
        item.amount++;
        cartItems([...items]);
      }
    },
    decrease: ({ id, variant }) => {
      const itemIndex = items.findIndex(i => i.id === id && i.variant === variant);
      if (itemIndex === -1) return;
      const item = items[itemIndex];
      if (item.amount === 1) items.splice(itemIndex, 1);
      else item.amount--;
      cartItems([...items]);
    },
    remove: ({ id, variant }) => {
      const itemIndex = items.findIndex(i => i.id === id && i.variant === variant);
      if (itemIndex === -1) return;
      items.splice(itemIndex, 1);
      cartItems([...items]);
    },
    clear: () => cartItems([]),
    orders,
    pushOrder: order => userOrders([order, ...orders]),
    pushOrders: array => userOrders([...array, ...orders]),
    updateOrderStatus: (id, status) => {
      const orderIndex = orders.findIndex(o => o.id === id);
      if (orderIndex < 0) return;
      const order = orders[orderIndex];
      orders[orderIndex] = { ...order, status };
      userOrders([...orders]);
    },
  };
  return <CartContext.Provider value={context}>{children}</CartContext.Provider>;
};

export const useCart = () => React.useContext(CartContext);
