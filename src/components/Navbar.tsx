import { Link, useNavigate } from 'react-router-dom'
import Logo from '../asset/svgs/Logo'
import './style.css'
import { AppProps } from '../utils/Interfaces'
import { logo, storageUsername } from '../utils/Constants'

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
    <header className='navbar border-b border-gray-100 z-40'>
      {/* logo */}
      <Link className='logo' to={'/'}>
        <div style={{ width: 28, display: 'flex', alignItems: 'center', marginRight: '.5rem' }}><Logo /></div>
        {logo}
      </Link>
      {/* nav menu */}
      {user === undefined ? <></>
        : user === null ?
          <Link to={'/login'} className='main-button' style={{ padding: '.3rem 1rem', fontSize: '.9rem' }}>Log in</Link>
          :
          <nav>
            <button className='font-bold text-sm px-2 text-gray-400 hover:text-gray-600' onClick={logout}>Log out</button>
          </nav>}
    </header>
  )
}

export default Navbar