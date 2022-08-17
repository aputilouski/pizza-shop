import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { SignIn, AdminStartPage, Profile, Main } from 'pages';
import { AdminLayout, AuthController, AutoSignInIndicator, Layout } from 'components';
import { Provider } from 'react-redux';
import { store, history } from 'redux-manager';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

const App = () => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <NotificationsProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AutoSignInIndicator>
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
                  <Route>
                    <AuthController>
                      <AdminLayout>
                        <Switch>
                          <Route path="/main" component={AdminStartPage} />
                          <Route path="/profile" component={Profile} />
                        </Switch>
                      </AdminLayout>
                    </AuthController>
                  </Route>
                </Switch>
              </Route>
            </Switch>
          </AutoSignInIndicator>
        </ConnectedRouter>
      </Provider>
    </NotificationsProvider>
  </MantineProvider>
);

export default App;
