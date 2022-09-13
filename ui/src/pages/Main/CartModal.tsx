import React from 'react';
import { Indicator, ActionIcon, Modal, Alert, CloseButton, Card, Button, TextInput, Textarea, LoadingOverlay, Notification, Transition } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons';
import { useCart } from './CartProvider';
import { GET_All_PRODUCTS, CREATE_ORDER } from 'gql';
import { useQuery, useMutation } from '@apollo/client';
import { CartButton } from 'components';
import { useForm, yupResolver } from '@mantine/form';
import * as Yup from 'yup';
import { IconCheck } from '@tabler/icons';

type CartItemCardProps = {
  product: Product;
  increase: () => void;
  decrease: () => void;
  remove: () => void;
  value: number;
  price: Price;
};

const CartItemCard = ({ product, increase, decrease, value, price, remove }: CartItemCardProps) => (
  <Card shadow="sm" radius="sm" withBorder>
    <p className="mb-1 font-semibold">{product.name}</p>
    {product.description && <p className="text-sm mb-2">{product.description}</p>}
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="">{price.value} $</p>
        {price.weight && <p className="text-sm leading-none">{price.weight} g</p>}
      </div>
      <CartButton //
        increase={increase}
        decrease={decrease}
        value={value}
      />
    </div>
    <CloseButton className="absolute right-1 top-1" onClick={remove} />
  </Card>
);

const NumberField = Yup.number()
  .nullable()
  .min(1, 'Must be greater than or equal to 1')
  .transform((_, val) => (val === '' ? null : _))
  .typeError('Must be a number');

const validate = yupResolver(
  Yup.object({
    city: Yup.string().required('City field is required'),
    addr: Yup.string().required('Street, house field is required'),
    entrance: NumberField,
    floor: NumberField,
    flat: NumberField,
    phone: Yup.string().matches(/^(17|29|33|44)[0-9]{7}$/, 'Phone number is not valid'),
  })
);

const CartModal = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(1);
  const [total, setTotal] = React.useState('0');

  const form = useForm({
    initialValues: { city: '', addr: '', entrance: '', floor: '', flat: '', phone: '', note: '' },
    validate,
  });
  const { clearErrors, reset: resetForm } = form;

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      clearErrors();
    }
  }, [open, clearErrors]);

  const { items, increase, decrease, remove, clear, pushOrder } = useCart();

  const [send, { loading, error }] = useMutation<{ CreateOrder: Order }>(CREATE_ORDER);

  const { data } = useQuery<{ allProducts: Product[] }>(GET_All_PRODUCTS);

  // calculate total
  React.useEffect(() => {
    let total = 0;
    items.forEach(item => {
      const product = data?.allProducts.find(p => p.id === item.id);
      if (!product) return;
      const price = product.prices.find(p => p.variant === item.variant);
      if (!price) return;
      total += price.value * item.amount;
    });
    setTotal(Number(total).toFixed(2));
  }, [items, data?.allProducts]);

  if (!data?.allProducts) return null;

  const onSubmit = form.onSubmit(address =>
    send({
      variables: { input: { address, items } },
      onCompleted: data => {
        pushOrder(data.CreateOrder);
        clear();
        resetForm();
        setStep(3);
      },
    })
  );

  return (
    <>
      <Transition mounted transition="fade" duration={150} timingFunction="ease-out">
        {styles => (
          <Indicator disabled={items.length === 0} color="red" withBorder size={16} offset={4}>
            <ActionIcon //
              style={styles}
              onClick={() => setOpen(true)}
              variant="filled"
              size="xl"
              radius="xl"
              color="orange">
              <IconShoppingCart />
            </ActionIcon>
          </Indicator>
        )}
      </Transition>

      <Modal //
        title={step === 1 ? 'Cart' : 'Checkout'}
        opened={open}
        onClose={() => setOpen(false)}>
        <LoadingOverlay visible={loading} overlayBlur={2} />

        {error && (
          <Alert color="red" className="mb-4">
            {error.message}
          </Alert>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2">
            {items.map(item => {
              const product = data?.allProducts.find(p => p.id === item.id);
              if (!product) return null;
              const price = product.prices.find(p => p.variant === item.variant);
              if (!price) return null;
              return (
                <CartItemCard //
                  key={`${item.id}-${item.variant}`}
                  product={product}
                  increase={() => increase({ id: product.id, variant: item.variant })}
                  decrease={() => decrease({ id: product.id, variant: item.variant })}
                  remove={() => remove(item)}
                  value={item.amount}
                  price={price}
                />
              );
            })}
            {items.length === 0 && <Alert color="yellow">No items</Alert>}

            {items.length >= 1 && (
              <div className="mt-3 py-2">
                <p className="text-center mb-2 text-lg font-semibold">Total: {total} $</p>
                <Button fullWidth onClick={() => setStep(2)}>
                  Order
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <form className="flex flex-col gap-2" onSubmit={onSubmit}>
            <TextInput name="city" placeholder="City" {...form.getInputProps('city')} autoFocus />
            <TextInput name="addr" placeholder="Street, house" {...form.getInputProps('addr')} />
            <div className="flex gap-2">
              <TextInput name="entrance" placeholder="Entrance" {...form.getInputProps('entrance')} />
              <TextInput name="floor" placeholder="Floor" {...form.getInputProps('floor')} />
              <TextInput name="flat" placeholder="Flat" {...form.getInputProps('flat')} />
            </div>
            <TextInput //
              name="phone"
              placeholder="29..."
              icon={<p className="text-sm">+375</p>}
              iconWidth={45}
              {...form.getInputProps('phone')}
            />
            <Textarea name="note" placeholder="Note" {...form.getInputProps('note')} />
            <div className="mt-3">
              <Button fullWidth type="submit">
                Checkout (${total})
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <Notification //
            icon={<IconCheck />}
            title="Order Successfully Placed"
            disallowClose>
            Your order has been sent. The operator will call you back
          </Notification>
        )}
      </Modal>
    </>
  );
};

export default CartModal;
