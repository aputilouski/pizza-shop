import { useStore } from 'redux-manager';
import { Redirect } from 'react-router-dom';

const AuthController = ({ children }: { children: JSX.Element }) => {
  const { authorized, pendingAuth } = useStore(state => state.auth);
  if (pendingAuth) return null;
  else return authorized ? children : <Redirect to="/admin" />;
};

export default AuthController;
