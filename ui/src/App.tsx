import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { SignIn, SignUp, MainPage, Profile } from 'pages';
import { Layout, AuthController, AutoSignInIndicator } from 'components';
import { Provider } from 'react-redux';
import { store, history } from 'redux-manager';

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AutoSignInIndicator>
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route>
            <AuthController>
              <Layout>
                <Switch>
                  <Route path="/main" component={MainPage} />
                  <Route path="/profile" component={Profile} />
                </Switch>
              </Layout>
            </AuthController>
          </Route>
        </Switch>
      </AutoSignInIndicator>
    </ConnectedRouter>
  </Provider>
);

export default App;
