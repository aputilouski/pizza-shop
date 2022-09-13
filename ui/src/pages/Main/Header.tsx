import { Link } from 'react-router-dom';
import { Image } from '@mantine/core';
import CartModal from './CartModal';
import { ProvideCart } from './CartProvider';
import OrderStatusModal from './OrderStatusModal';

const Header = () => (
  <div className="flex justify-between items-center py-2 sticky top-0 bg-white/90 z-50">
    <Link to="/" className="no-underline">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12">
          <Image src="/logo.jpg" alt="Pizza logo" />
        </div>
        <h1 className="text-orange-600 text-3xl">Pizza Shop</h1>
      </div>
    </Link>
    <ProvideCart>
      <div className="flex gap-2.5">
        <OrderStatusModal />
        <CartModal />
      </div>
    </ProvideCart>
  </div>
);

export default Header;
