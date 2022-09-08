const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql');
const { Product, Order } = require('@models');
const OffsetPaginationType = require('./types/offset-pagination');
const CursorPaginationType = require('./types/cursor-pagination');
const { ProductType, ProductTypeEnum } = require('./types/product');
const { OrderType } = require('./types/order');
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
const { upload } = require('@utils/upload');
const { isAdmin } = require('@utils/user');
const { decodeCursor, encodeCursor, useCursor } = require('@utils/cursor');
const mongoose = require('mongoose');

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
    allProducts: {
      type: new GraphQLList(ProductType),
      resolve: () => Product.find().sort('-createdAt'),
    },
    orders: {
      type: CursorPaginationType('orders', OrderType),
      args: {
        first: { type: GraphQLInt, defaultValue: 10 },
        after: { type: GraphQLString },
      },
      resolve: async (_, { first, after }, context) => {
        if (!isAdmin(context.user)) throw new Error('Forbidden');
        const filter = {};
        if (after) filter._id = { $lt: mongoose.Types.ObjectId(decodeCursor(after)) };
        const query = Order.find(filter).sort('-createdAt');
        const totalCount = await Order.find().count();
        const totalCountAfterCursor = await query.clone().count();
        const orders = await query.limit(first);
        const edges = orders.map(o => ({ node: o, cursor: encodeCursor(o.id) }));
        const [startCursor, endCursor] = useCursor(edges);
        const hasNextPage = totalCountAfterCursor - first > 0;
        const hasPreviousPage = totalCount - totalCountAfterCursor > first;
        return {
          totalCount,
          edges,
          pageInfo: { startCursor, endCursor, hasPreviousPage, hasNextPage },
        };
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
      resolve: (_, { input }, context) => {
        if (isAdmin(context.user)) return Product.create(input);
        else throw new Error('Forbidden');
      },
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
      resolve: (_, { input }, context) => {
        if (isAdmin(context.user)) return Product.findOneAndUpdate({ _id: input.id }, input);
        else throw new Error('Forbidden');
      },
    },
    DeleteProduct: {
      type: ProductType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id: _id }, context) => {
        if (isAdmin(context.user)) return Product.findOneAndDelete({ _id });
        else throw new Error('Forbidden');
      },
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
      resolve: (_, { file }, context) => {
        if (isAdmin(context.user)) return upload(file);
        else throw new Error('Forbidden');
      },
    },
    CreateOrder: {
      type: OrderType,
      args: {
        input: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'CreateOrderData',
              fields: {
                address: {
                  type: new GraphQLNonNull(
                    new GraphQLInputObjectType({
                      name: 'CreateOrderAddressData',
                      fields: {
                        city: { type: new GraphQLNonNull(GraphQLString) },
                        addr: { type: new GraphQLNonNull(GraphQLString) },
                        entrance: { type: GraphQLString },
                        floor: { type: GraphQLString },
                        flat: { type: GraphQLString },
                        phone: { type: new GraphQLNonNull(GraphQLString) },
                        note: { type: GraphQLString },
                      },
                    })
                  ),
                },
                items: {
                  type: new GraphQLNonNull(
                    new GraphQLList(
                      new GraphQLInputObjectType({
                        name: 'CreateOrderItemData',
                        fields: {
                          id: { type: new GraphQLNonNull(GraphQLID) },
                          variant: { type: new GraphQLNonNull(GraphQLString) },
                          amount: { type: new GraphQLNonNull(GraphQLInt) },
                        },
                      })
                    )
                  ),
                },
              },
            })
          ),
        },
      },
      resolve: async (_, { input }) => {
        const { address, items: cartItams } = input;
        let total = 0;
        const products = await Product.find({ _id: { $in: cartItams.map(item => item.id) } });
        const items = cartItams.map(item => {
          const product = products.find(p => p.id === item.id);
          if (!product) throw new Error('Product not found');
          const productPrice = product.prices.find(p => p.variant === item.variant);
          if (!productPrice) throw new Error('Price not found');
          total += productPrice.value * item.amount;
          return {
            name: product.name,
            amount: item.amount,
            variant: item.variant,
            price: productPrice.value,
          };
        });
        return Order.create({ address, items, total });
      },
    },
  },
});

// const Subscription = new GraphQLObjectType({
//   name: 'subscription',
//   fields: {},
// });

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  // subscription: Subscription,
});
