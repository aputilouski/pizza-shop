import { Image, Button, Card, Select } from '@mantine/core';

const ProductCard = () => {
  return (
    <Card shadow="sm" radius="sm" withBorder>
      <Image //
        radius="md"
        src="/pizza.png"
        alt="Pizza name"
      />

      <p className="text-center font-semibold text-lg">4 Сезона</p>
      <p className="text-sm">Томаты, опята, соус ранч, пепперони, креветки, ананас, сыр моцарелла, фета</p>
      <Select
        defaultValue="md"
        data={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
      />
      <div className="flex justify-between items-center">
        <div>
          <p className="">20$</p>
          <p className="text-sm">550g</p>
        </div>
        <Button>Add to cart</Button>
      </div>
    </Card>
  );
};

export default ProductCard;
