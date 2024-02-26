import React, { useEffect, useState } from 'react'
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { Link, useNavigate } from 'react-router-dom';
import { AppProps, Plugin, User } from '../../utils/Interfaces';
import { config } from '../../utils/Config';
import Pickaxe from '../../asset/svgs/Pickaxe';
import Spinner from '../../components/Spinner';
import { getFormattedDate } from '../../utils/Functions';

interface Props {
  profileUser: User
  isAuthUser: boolean
  authUser: User | null | undefined
}

const Plugins: React.FC<Props> = React.memo(({ profileUser, isAuthUser, authUser }) => {

  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [page, setPage] = useState(1);
  const [deletingPlugin, setDeletingPlugin] = useState<Plugin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load plugins from database
  useEffect(() => {
    (async () => {
      const keys = isAuthUser ? `['owner']` : `['owner', 'isPublic']`;
      const values = isAuthUser ? `['${profileUser.username}']` : `['${profileUser.username}', True]`;
      const res = (await fetch(`${config.api.mongodb}/query-items?database=mineplugin&collection=plugins&keys=${keys}&values=${values}&page=${page}&per_page=100&sort_by=lastUpdate`, { headers: { 'Content-Type': 'application/json' } }));
      const data = await res.json();
      setPlugins(data);
    })();
  }, [isAuthUser]);

  // Click handler
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement);
      if (!target.closest('.fa-trash') && !target.closest('.delete-popup')) {
        setDeletingPlugin(null);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Delete the plugin
  const deletePlugin = async () => {
    setIsDeleting(true);
    try {
      // Delete data from database
      await fetch(`${config.api.mongodb}/delete-single-item?database=mineplugin&collection=plugins&keys=['owner', 'name']&values=['${deletingPlugin?.owner}', '${deletingPlugin?.name}']`, { method: 'DELETE' });
      // Update user
      await fetch(`${config.api.mongodb}/update-single-item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mineplugin',
          collection: 'users',
          keys: ['username'],
          values: [profileUser.username],
          fields: ['plugins'],
          field_values: profileUser.plugins.filter(p => p !== deletingPlugin?.name)
        })
      });
      // Delete files in s3
      await fetch(`${config.api.s3}/access-file?bucket=mineplugin-bucket&path=src/${deletingPlugin?.owner}/${deletingPlugin?.name}&is_folder=True`, { method: 'DELETE' });
    } catch (error) {
      console.log(error)
    }
    // Update states
    setDeletingPlugin(null);
    setIsDeleting(false);
  }

  // Star a plugin
  const star = (plugin: Plugin) => {
    if (!authUser) return;
    if (!plugin.starred?.includes(authUser.username)) {
      setPlugins(prev => prev.map(p => p.name === plugin.name ? {...plugin, starred: plugin.starred ? [...plugin.starred, authUser.username] : [authUser.username] } : p));
    } else {
      setPlugins(prev => prev.map(p => p.name === plugin.name ? {...plugin, starred: plugin.starred?.filter(u => u !== authUser.username) } : p));
    }
  }

  return (
    <>
      <div>
        {/* search bar */}
        <div className='flex items-center justify-between py-2'>
          <input className='main-input text-sm flex-1 py-1.5 max-w-80' placeholder='Search' value={searchInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} />
          {isAuthUser && <Link to={'/new'} className='main-button ml-4 text-sm flex items-center py-1.5 px-4'><div className='w-3 mr-2 *:*:fill-white'><PluginsIcon /></div>New</Link>}
        </div>
        {/* my plugins */}
        <div className="mt-8">
          {plugins.map(plugin => <div className='flex items-center mt-4 py-1' key={`plugin-${plugin.name}`}>
            {/* image */}
            <div className='plugin-image w-10 aspect-square flex items-center justify-center bg-gray-200 rounded-lg'>
              {plugin.picture ? <img /> : <div className='w-1/2'><Pickaxe color='#a0a0a0' /></div>}
            </div>
            {/* name & description */}
            <div className='ml-4 flex-1 min-w-0 cursor-pointer' onClick={() => navigate(`/${profileUser.username}/${plugin.name}`)}>
              <div className=''>{plugin.name}<span className='text-sm text-gray-400 ml-4 font-light'>{plugin.version}</span></div>
              <div className='overflow-hidden whitespace-nowrap text-ellipsis text-sm text-gray-400 font-light'>{plugin.description}</div>
            </div>
            <div className='flex flex-col items-end cursor-pointer' onClick={() => navigate(`/${profileUser.username}/${plugin.name}`)}>
              <div className='text-xs text-gray-400 font-light'>Last update: {plugin.lastUpdate ? getFormattedDate(plugin.lastUpdate) : 'No update'}</div>
              <div className='text-xs text-gray-400 font-light'>Downloads: {plugin.downloads}</div>
            </div>
            {/* options */}
            {isAuthUser && <div className='flex items-center justify-center ml-2'>
              {/* <button onClick={() => star(plugin)} className='w-7 h-7 rounded-full hover:bg-gray-100'><i className={`fa-star text-sm${(plugin.starred && plugin.starred.includes(authUser?.username || '')) ? ' fa-solid text-yellow-400' : ' fa-regular text-gray-400'}`} /></button> */}
              <button onClick={() => navigate(`/${profileUser.username}/${plugin.name}/dev`)} className='w-7 h-7 ml-2 rounded-full hover:bg-gray-100'><i className={`fa-solid fa-code text-sm text-gray-400`} /></button>
              <button onClick={() => setDeletingPlugin(plugin)} className='w-7 h-7 ml-2 rounded-full hover:bg-gray-100'><i className='fa-solid fa-trash text-sm text-gray-400' /></button>
            </div>}
          </div>)}
        </div>
      </div>

      {/* delete pupop */}
      {deletingPlugin && <div className='z-50 fixed w-dvw h-dvh top-0 left-0 flex items-center justify-center' style={{ background: '#0002' }}>
        <div className='delete-popup max-w-md w-5/6 bg-white shadow-xl rounded-sm p-4'>
          <div className='text-lg'>Delete <span className='font-bold'>{deletingPlugin.name}</span></div>
          <div className='text-base mt-2'>Once it is deleted, it will be gone forever</div>
          <div className='mt-4 flex justify-end text-sm'>
            <button onClick={() => setDeletingPlugin(null)} className='border border-secondary text-primary py-1 px-3'>Cancel</button>
            <button onClick={deletePlugin} className='text-white bg-red-400 py-1 px-4 font-bold ml-2 disabled:bg-red-300 disabled:px-6' disabled={isDeleting}>{isDeleting ? <Spinner color='#fff' /> : 'Delete'}</button>
          </div>
        </div>
      </div>}
    </>
  )
})

export default Plugins