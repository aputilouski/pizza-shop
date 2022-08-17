import { Link } from 'react-router-dom';
import { Indicator, ActionIcon, Image } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons';

const Header = () => (
  <div className="flex justify-between items-center py-2.5">
    <Link to="/">
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16">
          <Image src="/logo.jpg" alt="Pizza logo" />
        </div>
        <h1 className="m-0">Pizza Shop</h1>
      </div>
    </Link>

    <Indicator color="red" withBorder size={16} offset={4}>
      <ActionIcon color="orange" size="xl" radius="xl" variant="light">
        <IconShoppingCart />
      </ActionIcon>
    </Indicator>
  </div>
);

export default Header;
