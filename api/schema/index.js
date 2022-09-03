const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql');
const { Product } = require('@models');
const OffsetPaginationType = require('./types/offset-pagination');
const { ProductType, ProductTypeEnum, ProductPriceType } = require('./types/product');
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
const { upload } = require('@utils/upload');

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
        type: { type: ProductTypeEnum, defaultValue: 'pizza' },
        limit: { type: GraphQLInt, defaultValue: 10 },
        offset: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { limit, offset, type }) => {
        const [count, rows] = await Promise.all([
          Product.find({ type }).count(), //
          Product.find({ type }).sort('-createdAt').limit(limit).skip(offset),
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
                description: { type: GraphQLString },
                prices: {
                  type: new GraphQLNonNull(
                    new GraphQLList(
                      new GraphQLInputObjectType({
                        name: 'CreatePriceData',
                        fields: {
                          variant: { type: new GraphQLNonNull(GraphQLString) },
                          value: { type: new GraphQLNonNull(GraphQLFloat) },
                          weight: { type: GraphQLInt },
                        },
                      })
                    )
                  ),
                },
                images: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
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
                description: { type: GraphQLString },
                prices: {
                  type: new GraphQLNonNull(
                    new GraphQLList(
                      new GraphQLInputObjectType({
                        name: 'UpdatePriceData',
                        fields: {
                          variant: { type: new GraphQLNonNull(GraphQLString) },
                          value: { type: new GraphQLNonNull(GraphQLFloat) },
                          weight: { type: GraphQLInt },
                        },
                      })
                    )
                  ),
                },
                images: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
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
    SingleUpload: {
      type: new GraphQLNonNull(
        new GraphQLObjectType({
          name: 'file',
          fields: () => ({
            name: { type: new GraphQLNonNull(GraphQLString) },
            link: { type: new GraphQLNonNull(GraphQLString) },
          }),
        })
      ),
      args: { file: { type: new GraphQLNonNull(GraphQLUpload) } },
      resolve: (_, { file }) => upload(file),
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
