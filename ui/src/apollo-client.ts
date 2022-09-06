import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from 'api';

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return { headers: { ...headers, authorization: token } };
});

const client = new ApolloClient({
  // uri: window.location.origin + '/graphql',
  cache: new InMemoryCache({
    // typePolicies: {
    //   Query: {
    //     fields: {},
    //   },
    // },
  }),
  link: authLink.concat(createUploadLink({ uri: window.location.origin + '/graphql' })),
});

export default client;
