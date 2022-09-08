const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const OrderTypeEnum = new GraphQLEnumType({
  name: 'OrderStatus',
  values: {
    initiated: { value: 'initiated' },
    received: { value: 'received' },
    in_kitchen: { value: 'in-kitchen' },
    delivery: { value: 'delivery' },
    completed: { value: 'completed' },
    rejected: { value: 'rejected' },
  },
});

const Address = new GraphQLObjectType({
  name: 'Address',
  fields: {
    city: { type: new GraphQLNonNull(GraphQLString) },
    addr: { type: new GraphQLNonNull(GraphQLString) },
    entrance: { type: GraphQLString },
    floor: { type: GraphQLString },
    flat: { type: GraphQLString },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    note: { type: GraphQLString },
  },
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    number: { type: new GraphQLNonNull(GraphQLInt) },
    status: { type: new GraphQLNonNull(OrderTypeEnum) },
    address: { type: new GraphQLNonNull(Address) },
    items: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'OrderItem',
            fields: {
              name: { type: new GraphQLNonNull(GraphQLString) },
              amount: { type: new GraphQLNonNull(GraphQLInt) },
              variant: { type: new GraphQLNonNull(GraphQLString) },
              price: { type: new GraphQLNonNull(GraphQLFloat) },
            },
          })
        )
      ),
    },
    total: { type: new GraphQLNonNull(GraphQLFloat) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  },
});

module.exports = { OrderType, Address };
