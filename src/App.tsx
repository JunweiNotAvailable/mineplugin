import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Plugin from './pages/plugin/Plugin';
import Landing from './pages/home/Landing';
import { User } from './utils/Interfaces';
import Login from './pages/auth/Login';
import ForgetPassword from './pages/auth/ForgetPassword';
import SignUp from './pages/auth/SignUp';

function App() {

  const [user, setUser] = useState<User | undefined | null>(undefined);
  const appProps = {
    user, setUser
  };

  // Load the current user
  useEffect(() => {
    setUser(null);
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar {...appProps} />
        <Routes>
          {/* auth routes */}
          <Route path='/login' element={<Login {...appProps} />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />

          {/* main routes */}
          <Route path='/' element={user ? <Home {...appProps} /> : <Landing />} /> {/* to home page if user logged in otherwise go to landing page */}
          <Route path='/:username' element={<Profile {...appProps} />} />
          <Route path='/:username/:plugin_id' element={<Plugin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
