import { Route, Switch } from 'react-router';
import { AuthController, SubscriptionManager } from 'components';
import Layout from './Layout';
import StartPage from './Stats';
import Profile from './Profile';
import Products from './Products';
import Orders from './Orders';

const AdminPanel = ({ path }: { path: string }) => (
  <AuthController>
    <Layout>
      <SubscriptionManager>
        <Switch>
          <Route path={`${path}/profile`} component={Profile} />
          <Route path={`${path}/stats`} component={StartPage} />
          <Route path={`${path}/products`} component={Products} />
          <Route path={`${path}/orders`} component={Orders} />
        </Switch>
      </SubscriptionManager>
    </Layout>
  </AuthController>
);

export default AdminPanel;
