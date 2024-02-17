import React, { useState } from 'react'
import { AppProps } from '../../utils/Interfaces'
import { Link } from 'react-router-dom';
import Logo from '../../asset/Logo';
import { Auth } from 'aws-amplify';

const SignUp: React.FC<AppProps> = ({ user, setUser }) => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // The sign up function - send verification code
  const signUp = async () => {
    setErrorMessage('');
    setIsSending(true);
    try {
      await Auth.signUp({
        username: username,
        password: password1,
        attributes: {
          email: email
        }
      });
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        setErrorMessage('Email or username existed');
      } else if (err.name === 'InvalidPasswordException') {
        setErrorMessage('The password has to be at least 6 characters');
      }
      console.log(err)
    }
    setIsSending(false);
  }

  /**
   * Confirm code -
   * Create a user and store to database
   * Go to the login page
   */
  const confirmCode = async () => {
    setErrorMessage('');
    setIsConfirming(true);
    try {
      await Auth.confirmSignUp(username, code);
      // set up
      await setupUser();
    } catch (error) {
      setErrorMessage('Wrong verification code');
      console.log(error)
    }
    setIsConfirming(false);
  }

  // Create a user and store to database
  const setupUser = async () => {
    
  }

  return (
    <div className='app-body flex'>
      {/* inputs */}
      <div className='flex-1 flex justify-center'>
        <div className='login-form flex flex-col justify-center'>
          <div className='text-start font-bold text-2xl flex items-center'>
            <div className='mr-4 w-8'><Logo /></div>
            Sign up
          </div>
          {errorMessage && <div className='mt-3 text-sm text-center text-red-400'>{errorMessage}</div>}
          <input placeholder='Email' className='main-input mt-4' value={email} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          <input placeholder='Username' className='main-input mt-3' value={username} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          <input placeholder='Nickname' className='main-input mt-3' value={nickname} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
          <input placeholder='Password' type='password' className='main-input mt-3' value={password1} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword1(e.target.value)} />
          <input placeholder='Confirm password' type='password' className='main-input mt-3' value={password2} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)} />
          <button className='main-button mt-4 py-1' onClick={signUp}>Sign up</button>
          <Link to={'/login'} className='text-center mt-4 py-1 hover:text-primary-hover'>Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp