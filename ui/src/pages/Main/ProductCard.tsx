import React from 'react';
import { Image, Card, Select } from '@mantine/core';
import { PRICE_LABEL } from 'utils';
import { usePreview } from './PreviewProvider';
import { useCart } from './CartProvider';
import { CartButton } from 'components';

const ProductCard = ({ product }: { product: Product }) => {
  const [variant, setVariant] = React.useState(product.prices[0].variant);
  const price = product.prices.find(p => p.variant === variant);

  const preview = usePreview();
  const cart = useCart();

  if (!price) return null;
  return (
    <Card shadow="sm" radius="sm" withBorder className="flex flex-col gap-2">
      <div //
        onClick={() => preview(product.images)}
        className="cursor-pointer">
        <Image //
          radius="md"
          src={product.images[0]}
          alt={product.name}
        />
      </div>

      <div>
        <p className="mb-1 text-center font-semibold text-lg">{product.name}</p>
        {product.description && <p className="text-xs text-gray-600 text-center">{product.description}</p>}
      </div>
      <div className="mt-auto mb-0">
        {product.prices.length > 1 && (
          <Select //
            size="xs"
            value={variant}
            data={product.prices.map(p => ({ value: p.variant, label: PRICE_LABEL[p.variant as keyof typeof PRICE_LABEL] }))}
            onChange={v => v && setVariant(v)}
          />
        )}
        <div className="mt-3 px-0.5 flex justify-between items-center">
          <div>
            <p className="font-semibold">{price?.value} $</p>
            {price.weight && <p className="text-xs">{price.weight} g</p>}
          </div>
          <CartButton //
            increase={() => cart.increase({ id: product.id, variant: price.variant })}
            decrease={() => cart.decrease({ id: product.id, variant: price.variant })}
            value={cart.getAmount(product.id, price.variant)}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
