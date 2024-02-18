import React, { useEffect, useState } from 'react'
import { AppProps, User } from '../../utils/Interfaces'
import { useParams } from 'react-router'
import { config } from '../../utils/Config';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import Cog from '../../asset/svgs/Cog';

const Profile: React.FC<AppProps> = ({ user, setUser }) => {

  const navigate = useNavigate();
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [option, setOption] = useState('Plugins');
  const [isAuthUser, setIsAuthUser] = useState(false); // If the profile user is the visitor
  const [isLoadingProfileUser, setIsLoadingProfileUser] = useState(true);

  // Load the profile user
  useEffect(() => {
    (async () => {
      try {
        const res = (await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=users&key=username&id=${username}`));
        if (res.ok) {
          const userData = await res.json();
          setProfileUser(userData);
          setIsAuthUser(userData.username === user?.username);
          setIsLoadingProfileUser(false);
        }
      } catch (error) {
        navigate('/page-not-found');
      }
    })();
  }, [username]);

  // Load data of profile user
  useEffect(() => {
    (async () => {
      if (profileUser) {
        // Load the first page of plugins
      }
    })();
  }, [profileUser]);

  return (
    profileUser ? <div className='app-body flex'>
      {/* sidebar */}
      <aside className='p-4 w-64 flex flex-col'>
        {/* user info */}
        <div className='p-2'>
          <div className='flex items-center'>
            <div className='w-1/3 aspect-square rounded-full overflow-hidden'>
              <Avatar />
            </div>
            <div className='ml-4 text-sm text-gray-400 font-light'>{profileUser.plugins} plugin{profileUser.plugins === 1 ? '' : 's'}</div>
          </div>
          <div className='mt-2 text-lg font-bold overflow-hidden text-ellipsis'>{profileUser.nickname}</div>
          <div className='text-sm font-light text-gray-400 overflow-hidden text-ellipsis'>@{profileUser.username}</div>
        </div>
        {/* options */}
        <div className='flex-1 flex flex-col mt-4 overflow-auto'>
          <button onClick={() => setOption('Plugins')} className={`${option === 'Plugins' ? 'bg-gray-100 ' : ''}text-left rounded-md hover:bg-gray-100 py-2 px-3 text-sm mt-2 flex items-center`}><div className='mr-3 w-4'><PluginsIcon /></div>Plugins</button>
          <button onClick={() => setOption('Settings')} className={`${option === 'Settings' ? 'bg-gray-100 ' : ''}text-left rounded-md hover:bg-gray-100 py-2 px-3 text-sm mt-2 flex items-center`}><div className='mr-3 w-4'><Cog /></div>Settings</button>
        </div>
      </aside>
      {/* main */}
      <main className='flex-1 p-4'>
        <div className='font-bold text-xl flex items-center'>{option}</div>
        
      </main>
    </div>
      : 
      <></>
  )
}

export default Profile