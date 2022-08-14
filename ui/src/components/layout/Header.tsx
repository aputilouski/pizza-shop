import { Link } from 'react-router-dom';
import { signOut } from 'redux-manager';

const Header = () => (
  <div className="flex justify-between">
    <p>
      <Link to="/profile">Profile</Link>
    </p>

    <button onClick={signOut}>Sign Out</button>
  </div>
);

export default Header;
