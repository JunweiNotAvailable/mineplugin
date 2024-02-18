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
import { storageUsername } from './utils/Constants';
import { config } from './utils/Config';

function App() {

  const [user, setUser] = useState<User | undefined | null>(undefined);
  const appProps = {
    user, setUser
  };

  // Load the current user
  useEffect(() => {
    (async () => {
      // Check if there's current user
      const currUsername = localStorage.getItem(storageUsername);
      if (currUsername) {
        // get User data from mongodb
        try {
          const userData = await ((await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=users&key=username&id=${currUsername}`))).json();
          setUser(userData);
        } catch (error) {
          console.log('Failed getting user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    })();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar {...appProps} />
        <Routes>
          {/* auth routes */}
          <Route path='/login' element={<Login {...appProps} />} />
          <Route path='/signup' element={<SignUp {...appProps} />} />
          <Route path='/confirmsignup' element={<SignUp {...appProps} codeIsSent />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />

          {/* main routes */}
          <Route path='/' element={user ? <Home {...appProps} /> : <Landing />} /> {/* to home page if user logged in otherwise go to landing page */}
          <Route path='/:username' element={<Profile {...appProps} />} />
          {/* the routes require authenticated user */}
          {user && <>
            <Route path='/:username/:plugin_id' element={<Plugin />} />
          </>}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
