const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLEnumType, GraphQLInt, GraphQLFloat, GraphQLList } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const ProductTypeEnum = new GraphQLEnumType({
  name: 'ProductType',
  values: {
    pizza: { value: 'pizza' },
    starters: { value: 'starters' },
    chicken: { value: 'chicken' },
    desserts: { value: 'desserts' },
    drinks: { value: 'drinks' },
  },
});

const ProductPriceType = new GraphQLObjectType({
  name: 'Price',
  fields: {
    variant: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLFloat) },
    weight: { type: GraphQLInt },
  },
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(ProductTypeEnum) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    prices: { type: new GraphQLNonNull(new GraphQLList(ProductPriceType)) },
    images: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  },
});

module.exports = { ProductType, ProductTypeEnum, ProductPriceType };
