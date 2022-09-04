import { gql, useQuery } from '@apollo/client';
import ProductSection from './ProductSection';
import { PRODUCT } from 'utils';
import { Alert } from '@mantine/core';
import { ProvidePreview } from './PreviewProvider';
import { ProvideCart } from './CartProvider';

const GET_All_PRODUCTS = gql`
  query GetAllProducts {
    allProducts {
      id
      type
      name
      description
      prices {
        variant
        value
        weight
      }
      images
    }
  }
`;

const MainPage = () => {
  const { loading, error, data } = useQuery<{ allProducts: Product[] }>(GET_All_PRODUCTS);

  return (
    <div>
      <p className="font-bold text-4xl text-center mb-3">Menu</p>

      {error && <Alert color="red">{error.message}</Alert>}

      <ProvidePreview>
        <ProvideCart>
          {data &&
            PRODUCT.TYPE.map(type => {
              return (
                <ProductSection //
                  key={type}
                  title={PRODUCT.LABEL[type]}
                  items={data?.allProducts.filter(p => p.type === type)}
                />
              );
            })}
        </ProvideCart>
      </ProvidePreview>
    </div>
  );
};

export default MainPage;
