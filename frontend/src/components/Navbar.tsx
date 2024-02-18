import { Link } from 'react-router-dom'
import Logo from '../asset/Logo'
import './style.css'
import { AppProps } from '../utils/Interfaces'

const Navbar: React.FC<AppProps> = ({ user, setUser }) => {
  return (
    <header className='navbar'>
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
            <button>logout</button>
          </nav>}
    </header>
  )
}

export default Navbar