import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useState } from 'react';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Plugin from './pages/plugin/Plugin';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:username' element={<Profile />} />
          <Route path='/:username/:plugin_id' element={<Plugin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
