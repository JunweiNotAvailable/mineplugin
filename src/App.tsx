import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useState } from 'react';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Plugin from './pages/plugin/Plugin';
import Landing from './pages/home/Landing';
import { User } from './utils/Interfaces';

function App() {

  const [user, setUser] = useState<User | undefined | null>(undefined);

  const appProps = {
    user
  };

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* to home page if user logged in otherwise go to landing page */}
          <Route path='/' element={user ? <Home {...appProps} /> : <Landing />} />
          <Route path='/:username' element={<Profile {...appProps} />} />
          <Route path='/:username/:plugin_id' element={<Plugin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
