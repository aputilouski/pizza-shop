const {
  GraphQLSchema, //
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLList,
} = require('graphql');
const { Product } = require('@models');

const ProductTypeEnum = new GraphQLEnumType({
  name: 'Type',
  values: {
    PIZZA: { value: 'pizza' },
    STARTERS: { value: 'starters' },
    CHICKEN: { value: 'chicken' },
    DESSERTS: { value: 'desserts' },
    DRINKS: { value: 'drinks' },
  },
});

const ProductType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(ProductTypeEnum) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const Query = new GraphQLObjectType({
  name: 'query',
  fields: {
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return Product.findById(id);
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve() {
        return Product.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        input: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'newProduct',
              fields: {
                type: { type: new GraphQLNonNull(ProductTypeEnum) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
              },
            })
          ),
        },
      },
      async resolve(_, { input }) {
        return Product.create(input);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
