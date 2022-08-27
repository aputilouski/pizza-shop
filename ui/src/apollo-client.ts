import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: window.location.origin + '/graphql',
  cache: new InMemoryCache({
    // typePolicies: {
    //   Query: {
    //     fields: {},
    //   },
    // },
  }),
});

export default client;
