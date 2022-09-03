const PIZZA = 'pizza';
const STARTERS = 'starters';
const CHICKEN = 'chicken';
const DESSERTS = 'desserts';
const DRINKS = 'drinks';

const KEYS = [PIZZA, STARTERS, CHICKEN, DESSERTS, DRINKS] as const;

export const PRODUCT = {
  PIZZA,
  STARTERS,
  CHICKEN,
  DESSERTS,
  DRINKS,

  KEYS,

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
