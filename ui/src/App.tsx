import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { SignIn, AdminPanel, Main } from 'pages';
import { AutoSignInIndicator, Layout } from 'components';
import { Provider } from 'react-redux';
import { store, history } from 'redux-manager';
import { MantineProvider, Global } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const styles = {
  '*': { margin: 0, padding: 0 },
};

const client = new ApolloClient({
  uri: window.location.origin + '/graphql',
  cache: new InMemoryCache(),
});

const App = () => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Global styles={styles} />
    <NotificationsProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AutoSignInIndicator>
            <ApolloProvider client={client}>
              <Switch>
                <Route exact path="/">
                  <Layout>
                    <Switch>
                      <Route exact path="/" component={Main} />
                    </Switch>
                  </Layout>
                </Route>
                <Route path="/admin">
                  <Switch>
                    <Route exact path="/admin" component={SignIn} />
                    <Route path="/admin/:page">
                      <AdminPanel path="/admin" />
                    </Route>
                  </Switch>
                </Route>
              </Switch>
            </ApolloProvider>
          </AutoSignInIndicator>
        </ConnectedRouter>
      </Provider>
    </NotificationsProvider>
  </MantineProvider>
);

export default App;
