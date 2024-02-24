import React, { useEffect, useState } from 'react'
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { Link, useNavigate } from 'react-router-dom';
import { AppProps, Plugin, User } from '../../utils/Interfaces';
import { config } from '../../utils/Config';
import Pickaxe from '../../asset/svgs/Pickaxe';
import Spinner from '../../components/Spinner';

interface Props {
  profileUser: User
  isAuthUser: boolean
}

const Plugins: React.FC<Props> = React.memo(({ profileUser, isAuthUser }) => {

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
      const res = (await fetch(`${config.api.mongodb}/query-items?database=mineplugin&collection=plugins&keys=${keys}&values=${values}&page=${page}&per_page=100`, { headers: { 'Content-Type': 'application/json' } }));
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
    // Delete data from database
    // Update user
    // Delete files in s3
    // Update states
    setDeletingPlugin(null);
    setIsDeleting(false);
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
              <div className=''>{plugin.name}</div>
              <div className='overflow-hidden whitespace-nowrap text-ellipsis text-sm text-gray-400 font-light'>{plugin.description}</div>
            </div>
            {/* options */}
            <div className='w-10 flex items-center justify-center'>
              <button onClick={() => setDeletingPlugin(plugin)} className='w-7 h-7 rounded-full hover:bg-gray-100'><i className='fa-solid fa-trash text-sm text-red-400' /></button>
            </div>
          </div>)}
        </div>
      </div>

      {/* delete pupop */}
      {deletingPlugin && <div className='z-50 fixed w-dvw h-dvh top-0 left-0 flex items-center justify-center' style={{ background: '#0001' }}>
        <div className='delete-popup max-w-md w-5/6 bg-white shadow-xl rounded-sm p-4'>
          <div className='text-lg'>Delete <span className='font-bold'>{deletingPlugin.name}</span></div>
          <div className='text-base mt-2'>Once it is deleted, it will be gone forever</div>
          <div className='mt-4 flex justify-end text-sm'>
            <button onClick={() => setDeletingPlugin(null)} className='border border-primary text-primary py-1 px-3'>Cancel</button>
            <button onClick={deletePlugin} className='text-white bg-red-400 py-1 px-4 font-bold ml-2 disabled:bg-red-300 disabled:px-6' disabled={isDeleting}>{isDeleting ? <Spinner color='#fff' /> : 'Delete'}</button>
          </div>
        </div>
      </div>}
    </>
  )
})

export default Plugins