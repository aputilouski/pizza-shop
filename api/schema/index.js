const {
  GraphQLSchema, //
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
} = require('graphql');
const { Product } = require('@models');
const OffsetPaginationType = require('./types/offset-pagination');
const { ProductType, ProductTypeEnum } = require('./types/product');

const Query = new GraphQLObjectType({
  name: 'query',
  fields: {
    product: {
      type: ProductType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id }) => Product.findById(id),
    },
    products: {
      type: OffsetPaginationType('products', ProductType),
      args: {
        limit: { type: GraphQLInt, defaultValue: 10 },
        offset: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { limit, offset }) => {
        const [count, rows] = await Promise.all([
          Product.find().count(), //
          Product.find().sort('-createdAt').limit(limit).skip(offset),
        ]);
        return { count, rows };
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    CreateProduct: {
      type: ProductType,
      args: {
        input: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'CreateProductData',
              fields: {
                type: { type: new GraphQLNonNull(ProductTypeEnum) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
              },
            })
          ),
        },
      },
      resolve: (_, { input }) => Product.create(input),
    },
    UpdateProduct: {
      type: ProductType,
      args: {
        input: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'UpdateProductData',
              fields: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
              },
            })
          ),
        },
      },
      resolve: (_, { input }) => Product.findOneAndUpdate({ _id: input.id }, input),
    },
    DeleteProduct: {
      type: ProductType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id: _id }) => Product.findOneAndDelete({ _id }),
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
