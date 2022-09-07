import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getAccessToken } from 'api';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(createClient({ url: window.location.origin + '/graphql' }));

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
    // typePolicies: {
    //   Query: {
    //     fields: {},
    //   },
    // },
  }),
  link: splitLink,
});

export default client;
