import React, { useEffect, useState } from 'react'
import { AppProps, User } from '../../utils/Interfaces'
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../asset/svgs/Logo';
import { Auth } from 'aws-amplify';
import { config } from '../../utils/Config';

interface Props extends AppProps {
  codeIsSent?: boolean
}

const SignUp: React.FC<Props> = ({ user, setUser, ...props }) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [codeIsSent, setCodeIsSent] = useState(props.codeIsSent);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [areValidInputs, setAreValidInputs] = useState(false);

  // Check if inputs are vaild
  useEffect(() => {
    setAreValidInputs(
      email.length > 0 &&
      username.length > 0 &&
      nickname.length > 0 &&
      password1.length > 0 &&
      password1 === password2
    );
  }, [email, username, nickname, password1, password2]);

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
      setCodeIsSent(true);
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        setErrorMessage('Email or username existed');
      } else if (err.name === 'InvalidPasswordException') {
        setErrorMessage('The password has to be at least 8 characters');
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
  const confirmSignUp = async () => {
    setErrorMessage('');
    setIsConfirming(true);
    try {
      await Auth.confirmSignUp(username, code);
      // set up
      await setupUser();
      navigate('/login');
    } catch (error) {
      setErrorMessage('Wrong verification code');
      console.log(error)
    }
    setIsConfirming(false);
  }

  // Create a user and store to database
  const setupUser = async () => {
    const newUser: User = {
      username: username,
      nickname: nickname,
      plugins: [],
    };
    try {
      await fetch(`${config.api.mongodb}/put-single-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mineplugin',
          collection: 'users',
          value: newUser
        }),
      });
    } catch (error) {
      console.log('Failed creating user')
    }
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
          {!codeIsSent && <>
            <input placeholder='Username' className='main-input mt-3' value={username} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            <input placeholder='Nickname' className='main-input mt-3' value={nickname} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
            <input placeholder='Password' type='password' className='main-input mt-3' value={password1} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword1(e.target.value)} />
            <input placeholder='Confirm password' type='password' className='main-input mt-3' value={password2} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)} />
          </>}
          {codeIsSent && <input placeholder='Verification code' className='main-input mt-3' value={code} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)} />}
          <button className='main-button mt-4 py-1 disabled:bg-secondary' onClick={codeIsSent ? confirmSignUp : signUp} disabled={(!codeIsSent && !areValidInputs)}>{codeIsSent ? 'Sign up' : 'Send code'}</button>
          <Link to={'/login'} className='text-center mt-4 py-1 hover:text-primary-hover'>Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp