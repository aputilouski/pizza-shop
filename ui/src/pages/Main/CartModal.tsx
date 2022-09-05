import React from 'react';
import { Indicator, ActionIcon, Modal, Alert, CloseButton, Card, Button } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons';
import { useCart } from './CartProvider';
import { GET_All_PRODUCTS } from 'gql';
import { useQuery } from '@apollo/client';
import { CartButton } from 'components';

type CartItemCardProps = {
  product: Product;
  increase: () => void;
  decrease: () => void;
  remove: () => void;
  value: number;
  price: Price;
};

const CartItemCard = ({ product, increase, decrease, value, price, remove }: CartItemCardProps) => (
  <Card shadow="sm" radius="sm" withBorder>
    <p className="mb-1">{product.name}</p>
    {product.description && <p className="text-sm mb-2">{product.description}</p>}
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="">{price.value} $</p>
        {price.weight && <p className="text-sm leading-none">{price.weight} g</p>}
      </div>
      <CartButton //
        increase={increase}
        decrease={decrease}
        value={value}
      />
    </div>
    <CloseButton className="absolute right-1 top-1" onClick={remove} />
  </Card>
);

const CartModal = () => {
  const [open, setOpen] = React.useState(false);

  const { items, increase, decrease, remove } = useCart();

  const { data } = useQuery<{ allProducts: Product[] }>(GET_All_PRODUCTS);
  if (!data?.allProducts) return null;

  let total = 0;

  return (
    <>
      <Indicator disabled={items.length === 0} color="red" withBorder size={16} offset={4}>
        <ActionIcon onClick={() => setOpen(true)} color="orange" size="xl" radius="xl" variant="light">
          <IconShoppingCart />
        </ActionIcon>
      </Indicator>
      <Modal //
        title="Cart"
        opened={open}
        onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-2">
          {items.map(item => {
            const product = data?.allProducts.find(p => p.id === item.id);
            if (!product) return null;
            const price = product.prices.find(p => p.variant === item.variant);
            if (!price) return null;
            total += price.value * item.amount;
            return (
              <CartItemCard //
                key={`${item.id}-${item.variant}`}
                product={product}
                increase={() => increase({ id: product.id, variant: item.variant })}
                decrease={() => decrease({ id: product.id, variant: item.variant })}
                remove={() => remove(item)}
                value={item.amount}
                price={price}
              />
            );
          })}
          {items.length === 0 && <Alert color="yellow">No items</Alert>}

          {items.length >= 1 && (
            <div className="mt-3 py-2">
              <p className="text-center mb-1.5 text-lg font-semibold">Total: {Number(total).toFixed(2)} $</p>
              <Button fullWidth>Order</Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CartModal;
