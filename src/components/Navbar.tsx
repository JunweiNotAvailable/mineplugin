import { Link, useNavigate } from 'react-router-dom'
import Logo from '../asset/svgs/Logo'
import './style.css'
import { AppProps } from '../utils/Interfaces'
import { storageUsername } from '../utils/Constants'

const Navbar: React.FC<AppProps> = ({ user, setUser }) => {

  const navigate = useNavigate();

  const logout = () => {
    // Set user to null
    setUser(null);
    // Remove username from local storage
    localStorage.removeItem(storageUsername);
    // Navigate to home page
    navigate('/');
  }

  return (
    <header className='navbar border-b border-gray-100 z-50'>
      {/* logo */}
      <Link className='logo' to={'/'}>
        <div style={{ width: 28, display: 'flex', alignItems: 'center', marginRight: '.5rem' }}><Logo /></div>
        MC Picker
      </Link>
      {/* nav menu */}
      {user === undefined ? <></>
        : user === null ?
          <Link to={'/login'} className='main-button' style={{ padding: '.3rem 1rem', fontSize: '.9rem' }}>Log in</Link>
          :
          <nav>
            <button onClick={logout}>logout</button>
          </nav>}
    </header>
  )
}

export default Navbar