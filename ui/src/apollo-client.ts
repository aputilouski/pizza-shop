import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const client = new ApolloClient({
  uri: window.location.origin + '/graphql',
  cache: new InMemoryCache({
    // typePolicies: {
    //   Query: {
    //     fields: {},
    //   },
    // },
  }),
  link: createUploadLink({
    uri: window.location.origin + '/graphql',
  }),
});

export default client;
