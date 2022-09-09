const PIZZA = 'pizza';
const STARTERS = 'starters';
const CHICKEN = 'chicken';
const DESSERTS = 'desserts';
const DRINKS = 'drinks';

export const PRODUCT = {
  PIZZA,
  STARTERS,
  CHICKEN,
  DESSERTS,
  DRINKS,

  TYPE: [PIZZA, STARTERS, CHICKEN, DESSERTS, DRINKS] as const,

  LABEL: {
    [PIZZA]: 'Pizza',
    [STARTERS]: 'Starters',
    [CHICKEN]: 'Chicken',
    [DESSERTS]: 'Desserts',
    [DRINKS]: 'Drinks',
  },
};

export const PRICE_LABEL = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  default: 'Default',
};

export const ORDER_STATUS = {
  KEYS: ['initiated', 'received', 'in_kitchen', 'delivery', 'completed', 'rejected'],
  LABEL: {
    initiated: 'Initiated',
    received: 'Received',
    in_kitchen: 'In kitchen',
    delivery: 'Delivery',
    completed: 'Completed',
    rejected: 'Rejected',
  },
} as const;
