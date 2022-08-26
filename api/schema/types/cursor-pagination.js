const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLBoolean } = require('graphql');

const CursorPaginationType = (name, type) =>
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

// products: {

// # Example
// # query ($first: Int, $after: String){
// #   products (first: $first, after: $after){
// #     totalCount
// #     edges {
// #       node {
// #         name
// #         description
// #       }
// #       cursor
// #     }
// #     pageInfo{
// #       startCursor
// #       endCursor
// #       hasNextPage
// #       hasPreviousPage
// #     }
// #   }
// # }

//   type: CursorPaginationType('products', ProductType),
//   args: {
//     first: { type: GraphQLInt, defaultValue: 10 },
//     after: { type: GraphQLString },
//   },
//   resolve: async (_, { first, after }) => {
//     const filter = {};
//     if (after) filter._id = { $lt: mongoose.Types.ObjectId(decodeCursor(after)) };

//     const query = Product.find(filter).sort('-createdAt');

//     const totalCount = await Product.find().count();
//     const totalCountAfterCursor = await query.clone().count();

//     const products = await query.limit(first);
//     const edges = products.map(p => ({ node: p, cursor: encodeCursor(p.id) }));
//     const [startCursor, endCursor] = useCursor(edges);

//     const hasNextPage = totalCountAfterCursor - first > 0;
//     const hasPreviousPage = totalCount - totalCountAfterCursor > first;

//     return {
//       totalCount,
//       edges,
//       pageInfo: { startCursor, endCursor, hasPreviousPage, hasNextPage },
//     };
//   },
// },

module.exports = CursorPaginationType;
