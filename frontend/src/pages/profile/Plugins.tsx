import React, { useEffect, useState } from 'react'
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { Link } from 'react-router-dom';
import { AppProps, Plugin, User } from '../../utils/Interfaces';
import { config } from '../../utils/Config';

interface Props {
  profileUser: User
  isAuthUser: boolean
}

const Plugins: React.FC<Props> = React.memo(({ profileUser, isAuthUser }) => {

  const [searchInput, setSearchInput] = useState('');
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [page, setPage] = useState(1);

  // Load plugins from database
  useEffect(() => {
    (async () => {
      const res = (await fetch(`${config.api.mongodb}/query-items?database=mc-picker&collection=plugins&keys=['owner', 'isPublic']&values=['${profileUser.username}', True]&page=${page}&per_page=100`, { headers: { 'Content-Type': 'application/json' } }));
      const data = await res.json();
      setPlugins(data);
    })();
  }, []);

  return (
    <div>
      {/* search bar */}
      <div className='flex items-center justify-between'>
        <input className='main-input text-sm flex-1 py-1.5 max-w-80' placeholder='Search' value={searchInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} />
        {isAuthUser && <Link to={'/new'} className='main-button ml-4 text-sm flex items-center py-1.5 px-4'><div className='w-3 mr-2 *:*:fill-white'><PluginsIcon /></div>New</Link>}
      </div>
      {/* my plugins */}
      <div>
        
      </div>
    </div>
  )
})

export default Plugins