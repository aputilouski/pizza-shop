import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { SignIn, AdminPanel, Main } from 'pages';
import { AutoSignInIndicator, Layout } from 'components';
import { Provider } from 'react-redux';
import { store, history } from 'redux-manager';
import { MantineProvider, Global } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apollo-client';

const theme = {
  fontFamily: 'Comfortaa, cursive',
};

const styles = {
  '*': { margin: 0, padding: 0 },
};

const App = () => (
  <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
    <Global styles={styles} />
    <NotificationsProvider>
      <ModalsProvider>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <AutoSignInIndicator>
              <ApolloProvider client={apolloClient}>
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
      </ModalsProvider>
    </NotificationsProvider>
  </MantineProvider>
);

export default App;
