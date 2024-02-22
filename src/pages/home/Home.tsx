import { useNavigate } from 'react-router';
import './style.css';
import React, { useEffect } from 'react';
import { AppProps } from '../../utils/Interfaces';

const Home: React.FC<AppProps> = ({ user }) => {

  const navigate = useNavigate();

  // Redirect to user's profile
  useEffect(() => {
    navigate(`/${user?.username}`);
  }, [user]);

  return (
    <div className='app-body'></div>
  )
}

export default Home