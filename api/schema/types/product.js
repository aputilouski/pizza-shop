const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLEnumType, GraphQLFloat } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const ProductTypeEnum = new GraphQLEnumType({
  name: 'Type',
  values: {
    pizza: { value: 'pizza' },
    starters: { value: 'starters' },
    chicken: { value: 'chicken' },
    desserts: { value: 'desserts' },
    drinks: { value: 'drinks' },
  },
});

const ProductType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(ProductTypeEnum) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  }),
});

module.exports = { ProductType, ProductTypeEnum };
