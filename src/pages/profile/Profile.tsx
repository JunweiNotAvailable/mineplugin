import React, { useEffect, useState } from 'react'
import { AppProps, Plugin, User } from '../../utils/Interfaces'
import { useParams } from 'react-router'
import { config } from '../../utils/Config';
import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import Cog from '../../asset/svgs/Cog';
import Plugins from './Plugins';
import Settings from './Settings';
import PluginOverview from './PluginOverview';
import EditProfile from './EditProfile';
import PluginDefaultIcon from '../../components/PluginDefaultIcon';

interface Props extends AppProps {
  option?: string
}

const Profile: React.FC<Props> = ({ user, setUser, ...props }) => {

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [recentPlugins, setRecentPlugins] = useState<Plugin[]>([]);
  const [option, setOption] = useState(props.option || 'Plugins'); // The selected option on sidebar
  const [isAuthUser, setIsAuthUser] = useState(false); // If the profile user is the visitor
  const [isLoadingProfileUser, setIsLoadingProfileUser] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Load the profile user
        const res = (await fetch(`${config.api.mongodb}/get-single-item?database=mineplugin&collection=users&keys=['username']&values=['${username}']`));
        if (res.ok) {
          const userData = await res.json();
          setProfileUser(userData);
          setIsAuthUser(userData.username === user?.username);
          setIsLoadingProfileUser(false);
          document.title = `${userData.username} | MinePlugin`
        }
        // Load recent plugins
        const pluginsRes = (await fetch(`${config.api.mongodb}/query-items?database=mineplugin&collection=plugins&keys=['owner']&values=['${username}']&page=1&per_page=5&sort_by=lastUpdate`, { headers: { 'Content-Type': 'application/json' } }));
        const data = await pluginsRes.json();
        setRecentPlugins(data);
      } catch (error) {
        navigate('/pagenotfound');
      }
    })();
  }, [username, user, pathname]);

  // Update option when route changes
  useEffect(() => {
    setOption(props.option || 'Plugins');
  }, [pathname]);

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
            <div className='ml-4 text-sm text-gray-400 font-light'>{profileUser.plugins.length} plugin{profileUser.plugins.length === 1 ? '' : 's'}</div>
          </div>
          <div className='mt-2 text-lg font-bold overflow-hidden text-ellipsis'>{profileUser.nickname}</div>
          <div className='text-sm text-gray-400 overflow-hidden text-ellipsis'>@{profileUser.username}</div>
          {isAuthUser && <button onClick={() => navigate(`/${username}/profile`)} className='my-2 text-sm py-0.5 border border-gray-300 hover:border-gray-400 w-full'>Edit</button>}
        </div>
        {/* options */}
        <div className='flex-1 flex flex-col mt-4 overflow-auto'>
          <button onClick={() => navigate(`/${username}`)} className={`${option === 'Plugins' ? 'bg-gray-100 ' : ''}text-left py-2 px-3 text-sm mt-2 flex items-center border border-transparent hover:border-primary`}><div className='mr-3 w-4'><PluginsIcon /></div>Plugins</button>
          <div className='text-xs font-bold mt-2'>Recent</div>
          {recentPlugins.map(plugin => <button onClick={() => navigate(`/${username}/${plugin.name}`)} key={`btn-${plugin.name}`} className='text-left py-2 px-3 text-sm mt-2 flex items-center border border-transparent hover:border-primary'><div className='mr-3 w-5'>{plugin.picture ? <></> : <PluginDefaultIcon className="rounded" />}</div>{plugin.name}</button>)}
          <div className='border-t my-4' />
        </div>
      </aside>
      {/* main */}
      <main className='flex-1 p-4 pr-8 min-w-0 scroller'>
        <div className='font-medium text-xl flex items-center'>
          {option === 'Plugin' && <i className='fa-solid fa-arrow-left mr-4 cursor-pointer p-2 pl-0' onClick={() => navigate(`/${profileUser.username}`)} />}
          {option === 'Plugin' ? 'Plugins' : option}
        </div>
        <div className='mt-4'>
          {option === 'Plugins' ? <Plugins profileUser={profileUser} isAuthUser={isAuthUser} authUser={user} />
            : option === 'Settings' ? <Settings />
            : option === 'Plugin' ? <PluginOverview profileUser={profileUser} isAuthUser={isAuthUser} authUser={user} />
            : option === 'Profile' ? <EditProfile user={user} setUser={setUser} isAuthUser={isAuthUser} />
            : <></>}
        </div>
      </main>
    </div>
      :
      <></>
  )
}

export default Profile