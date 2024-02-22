import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Landing from './pages/home/Landing';
import { User } from './utils/Interfaces';
import Login from './pages/auth/Login';
import ForgetPassword from './pages/auth/ForgetPassword';
import SignUp from './pages/auth/SignUp';
import { storageUsername } from './utils/Constants';
import { config } from './utils/Config';
import PageNotFound from './pages/pagenotfound/PageNotFound';
import NewPlugin from './pages/new/NewPlugin';
import PluginEdit from './pages/edit/PluginEdit';

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
          const userData = await ((await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=users&keys=['username']&values=['${currUsername}']`))).json();
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
          <Route path='/' element={user === null ? <Landing /> : user ? <Home {...appProps} /> : <></>} /> {/* to home page if user logged in otherwise go to landing page */}
          <Route path='/:username' element={<Profile {...appProps} />} />
          <Route path='/:username/:pluginId' element={<Profile {...appProps} option='Plugin' />} />
          <Route path='/new' element={<NewPlugin {...appProps} />} />
          <Route path='/:username/settings' element={<Profile {...appProps} option='Settings' />} />
          <Route path='/:username/:pluginId/dev' element={<PluginEdit {...appProps} />} />

          {/* default */}
          <Route path='/pagenotfound' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
