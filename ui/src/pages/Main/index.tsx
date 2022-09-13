import { useQuery } from '@apollo/client';
import ProductSection from './ProductSection';
import { PRODUCT } from 'utils';
import { Alert, Overlay } from '@mantine/core';
import { ProvidePreview } from './PreviewProvider';
import { GET_All_PRODUCTS } from 'gql';

const MainPage = () => {
  const { loading, error, data } = useQuery<{ allProducts: Product[] }>(GET_All_PRODUCTS);

  return (
    <div className="relative">
      {loading && <Overlay opacity={0.4} color="white" />}

      <p className="font-bold text-4xl text-center mt-12 mb-5">Menu</p>

      {error && <Alert color="red">{error.message}</Alert>}

      <ProvidePreview>
        {data &&
          PRODUCT.TYPE.map(type => (
            <ProductSection //
              key={type}
              title={PRODUCT.LABEL[type]}
              items={data?.allProducts.filter(p => p.type === type)}
            />
          ))}
      </ProvidePreview>
    </div>
  );
};

export default MainPage;
