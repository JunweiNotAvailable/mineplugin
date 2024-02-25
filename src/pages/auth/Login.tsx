import React, { useEffect, useState } from 'react'
import { AppProps } from '../../utils/Interfaces'
import './style.css'
import Logo from '../../asset/svgs/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { storageUsername } from '../../utils/Constants';
import { Auth } from 'aws-amplify';
import { config } from '../../utils/Config';
import Spinner from '../../components/Spinner';

const Login: React.FC<AppProps> = ({ user, setUser }) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [areValidInputs, setAreValidInputs] = useState(false);

  // Check if inputs are vaild
  useEffect(() => {
    setAreValidInputs(username.length > 0 && password.length > 0);
  }, [username, password]);

  // Login to Cognito and get user data from database
  const login = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      // Cognito sign in
      await Auth.signIn(username, password);
      // Get user data
      const res = await fetch(`${config.api.mongodb}/get-single-item?database=mineplugin&collection=users&keys=['username']&values=['${username}']`);
      if (res.ok) {
        // Set app user to logged in user
        setUser(await res.json());
        // Store current user
        localStorage.setItem(storageUsername, username);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Wrong username or password');
      console.log(error)
    }
    setLoading(false);
  }

  return (
    <div className='app-body flex'>
      {/* inputs */}
      <div className='flex-1 flex justify-center'>
        <div className='login-form flex flex-col justify-center'>
          <div className='text-start font-bold text-2xl flex items-center'>
            <div className='mr-4 w-8'><Logo /></div>
            Login
          </div>
          {errorMessage && <div className='mt-3 text-sm text-center text-red-400'>{errorMessage}</div>}
          <input placeholder='Username or Email' className='main-input mt-4' value={username} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          <input placeholder='Password' type='password' className='main-input mt-3' value={password} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <button className={`main-button mt-4 py-1 flex justify-center disabled:bg-secondary${loading ? ' py-2' : ''}`} onClick={login} disabled={!areValidInputs || loading}>{loading ? <Spinner color='#fff' /> : 'Log in'}</button>
          <Link to={'/signup'} className='text-center mt-4 py-1 hover:text-primary-hover'>Don't have account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login