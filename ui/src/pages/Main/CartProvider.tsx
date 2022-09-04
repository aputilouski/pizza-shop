import React from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';

export const cartItems = makeVar<CartItem[]>([]);

type CartContextType = {
  items: CartItem[];
  getAmount: (productID: string, priceVariant: string) => number;
  increase: (item: Omit<CartItem, 'amount'>) => void;
  decrease: (item: Omit<CartItem, 'amount'>) => void;
};

const CartContext = React.createContext<CartContextType>({
  items: [],
  getAmount: () => 0,
  increase: () => {},
  decrease: () => {},
});

export const ProvideCart = ({ children }: { children: React.ReactNode }) => {
  const items = useReactiveVar(cartItems);

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
  };
  return <CartContext.Provider value={context}>{children}</CartContext.Provider>;
};

export const useCart = () => React.useContext(CartContext);
