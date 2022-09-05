import { Link } from 'react-router-dom';
import { Image } from '@mantine/core';
import CartModal from './CartModal';
import { ProvideCart } from './CartProvider';

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
    <ProvideCart>
      <CartModal />
    </ProvideCart>
  </div>
);

export default Header;
