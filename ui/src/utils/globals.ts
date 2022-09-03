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
