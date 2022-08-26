const { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt } = require('graphql');

const OffsetPaginationType = (name, type) =>
  new GraphQLObjectType({
    name,
    fields: {
      count: { type: new GraphQLNonNull(GraphQLInt) },
      rows: { type: new GraphQLList(type) },
    },
  });

module.exports = OffsetPaginationType;
