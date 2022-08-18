import { Route, Switch } from 'react-router';
import { AuthController } from 'components';
import Layout from './Layout';
import StartPage from './Start';
import Profile from './Profile';
import Products from './Products';
import Orders from './Orders';
import Team from './Team';

const AdminPanel = ({ path }: { path: string }) => (
  <AuthController>
    <Layout>
      <Switch>
        <Route path={`${path}/main`} component={StartPage} />
        <Route path={`${path}/products`} component={Products} />
        <Route path={`${path}/orders`} component={Orders} />
        <Route path={`${path}/team`} component={Team} />
        <Route path={`${path}/profile`} component={Profile} />
      </Switch>
    </Layout>
  </AuthController>
);

export default AdminPanel;
