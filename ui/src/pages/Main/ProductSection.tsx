import ProductCard from './ProductCard';

type MenuSectionProps = {
  title: string;
  items?: Product[];
};

const ProductSection = ({ title, items = [] }: MenuSectionProps) => {
  return (
    <>
      <h4 className="text-2xl border-solid border-0 border-b">{title}</h4>
      <div className="grid grid-cols-4 gap-4 mt-6 mb-12">
        {items.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
};

export default ProductSection;
