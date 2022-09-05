import { Button, ActionIcon } from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons';

type ProductCardButtonProps = {
  increase: () => void;
  decrease: () => void;
  value: number;
};

const CartButton = ({ increase, decrease, value }: ProductCardButtonProps) => {
  if (value === 0) return <Button onClick={increase}>Add to cart</Button>;
  else
    return (
      <div className="flex gap-2 items-center">
        <ActionIcon size={32} variant="default" onClick={decrease}>
          <IconMinus size={16} />
        </ActionIcon>

        <p>{value}</p>

        <ActionIcon size={32} variant="default" onClick={increase}>
          <IconPlus size={16} />
        </ActionIcon>
      </div>
    );
};

export default CartButton;
