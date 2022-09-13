import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition, relayStylePagination } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getAccessToken } from 'api';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NODE_ENV === (window.location.protocol === 'https:' ? 'wss' : 'ws') + 'development' ? `://localhost:${process.env.REACT_APP_API_PORT}/subscriptions` : `://${window.location.host}/subscriptions`,
    connectionParams: () => ({
      authorization: getAccessToken(),
    }),
  })
);

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return token === null ? { headers } : { headers: { ...headers, authorization: token } };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(createUploadLink({ uri: window.location.origin + '/graphql' }))
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          orders: relayStylePagination(['status']),
        },
      },
    },
  }),
  link: splitLink,
});

export default client;
