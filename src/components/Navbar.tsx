import { Link } from 'react-router-dom'
import Logo from '../asset/Logo'
import './style.css'

const Navbar = () => {
  return (
    <header className='navbar'>
      {/* logo */}
      <Link className='logo' to={'/'}>
        <div style={{ width: 28, display: 'flex', alignItems: 'center', marginRight: '.5rem' }}><Logo /></div>
        MC Picker
      </Link>
      {/* nav menu */}
    </header>
  )
}

export default Navbar