import { ProductCard } from 'components';

type MenuSectionProps = { title: string };

const MenuSection = ({ title }: MenuSectionProps) => {
  return (
    <>
      <h4 className="text-2xl border-solid border-0 border-b">{title}</h4>
      <div className="grid grid-cols-4 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </>
  );
};

export default MenuSection;
