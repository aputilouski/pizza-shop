const {
  GraphQLSchema, //
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const { Product } = require('@models');
const { encodeCursor, decodeCursor, useCursor } = require('@utils/cursor');
const mongoose = require('mongoose');

const ConnectionModelType = (name, type) =>
  new GraphQLObjectType({
    name,
    fields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
      edges: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: 'edge',
            fields: {
              node: { type },
              cursor: { type: GraphQLString },
            },
          })
        ),
      },
      pageInfo: {
        type: new GraphQLObjectType({
          name: 'pageInfo',
          fields: {
            startCursor: { type: GraphQLString },
            endCursor: { type: GraphQLString },
            hasPreviousPage: { type: GraphQLBoolean },
            hasNextPage: { type: GraphQLBoolean },
          },
        }),
      },
    },
  });

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
      type: ConnectionModelType('products', ProductType),
      args: {
        first: { type: GraphQLInt, defaultValue: 10 },
        after: { type: GraphQLString },
      },
      resolve: async (_, { first, after }) => {
        const totalCount = await Product.find().count();

        const filter = {};
        if (after) filter._id = { $gt: mongoose.Types.ObjectId(decodeCursor(after)) };

        const products = await Product.find(filter).sort('-createdAt').limit(first);
        const edges = products.map(p => ({ node: p, cursor: encodeCursor(p.id) }));
        const [startCursor, endCursor] = useCursor(edges);

        return {
          totalCount,
          edges,
          pageInfo: {
            startCursor,
            endCursor,
            hasPreviousPage: false,
            hasNextPage: false,
          },
        };
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
                price: { type: new GraphQLNonNull(GraphQLFloat) },
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
