import React from 'react';
import { Checkbox, Text } from '@mantine/core';
import { NumberInput } from '@mantine/core';
import { PRICE_LABEL } from 'utils';

type Price = ProductPrice & Pick<PizzaPrice, 'weight'>;

type PricesProps = {
  label?: string;
  className?: string;
  variants: string[];
  value?: Array<Price>;
  onChange?: (prices: Array<Price>) => void;
  generatePrice: (variant: string) => Price;
  error?: string;
};

const Prices = ({ label = 'Prices:', className, variants, value = [], onChange: setPrices = () => {}, generatePrice, error }: PricesProps) => {
  const prices: { [key: string]: Price | undefined } = variants.reduce((obj, variant) => ({ ...obj, [variant]: value.find(p => p.variant === variant) }), {});

  const onCheck = React.useCallback(
    (variant: string, checked: boolean, prices: Price[]) => {
      if (checked) setPrices(prices.filter(p => p.variant !== variant));
      else {
        setPrices([...prices, generatePrice(variant)]);
      }
    },
    [generatePrice, setPrices]
  );

  const onChange = React.useCallback(
    (value: number | undefined, variant: string, field: keyof Omit<Price, 'variant'>, prices: Price[]) => {
      const priceIndex = prices.findIndex(price => price.variant === variant);
      if (priceIndex < 0) return;
      const price = prices[priceIndex];
      price[field] = value || 0;
      setPrices([...prices]);
    },
    [setPrices]
  );

  return (
    <div className={className}>
      <Text size="sm" className="inline-block">
        {label}
      </Text>
      <div className="border border-solid p-2.5 rounded border-gray-300 ">
        {variants.map(variant => {
          const price = prices[variant];
          let label = PRICE_LABEL[variant as keyof typeof PRICE_LABEL];
          const checked = Boolean(price);
          return (
            <div //
              key={variant}
              className="flex items-center gap-5 py-1">
              <Checkbox //
                className="h-9 w-32"
                label={label}
                checked={checked}
                onChange={() => onCheck(variant, checked, value)}
              />
              {price && (
                <>
                  <NumberInput //
                    classNames={{ root: 'flex items-center gap-2', wrapper: 'w-32' }}
                    label="Price:"
                    value={price.value}
                    onChange={v => onChange(v, variant, 'value', value)}
                    decimalSeparator={','}
                    step={0.1}
                    precision={2}
                    min={0}
                    error={!price.value}
                  />
                  {'weight' in price && (
                    <NumberInput //
                      classNames={{ root: 'flex items-center gap-2', wrapper: 'w-32' }}
                      label="Weight(g):"
                      value={price.weight}
                      onChange={v => onChange(v || 0, variant, 'weight', value)}
                      min={0}
                      error={!price.weight}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <Text size="xs" color="red" className="mt-1.5">
          {error}
        </Text>
      )}
    </div>
  );
};

export default Prices;
