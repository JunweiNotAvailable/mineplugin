import React, { useEffect, useState } from 'react'
import { Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom'
import { config } from '../../utils/Config'
import Pickaxe from '../../asset/svgs/Pickaxe'
import Download from '../../asset/svgs/Download'

interface Props {
  profileUser: User
  isAuthUser: boolean
}

const PluginOverview: React.FC<Props> = ({ profileUser, isAuthUser }) => {

  const navigate = useNavigate();
  const { username, pluginId } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null | undefined>(undefined);

  // Load the plugin by route
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=plugins&keys=['name', 'owner']&values=['${encodeURIComponent(pluginId as string)}', '${username}']`);
        if (res.ok) {
          setPlugin(await res.json());
        }
      } catch (error) {
        console.log('Failed getting plugin')
      }
    })();
  }, []);

  return (
    plugin ? <div className='py-8'>
      {/* header */}
      <div className='flex items-center'>
        <div className='w-24 h-24 rounded-2xl flex bg-gray-200 items-center justify-center'>
          {plugin.picture ? <img /> : <div className='w-1/2'><Pickaxe color='#a0a0a0' /></div>}
        </div>
        <div className='flex-1 min-w-0 ml-6 py-2 flex flex-col'>
          <div className='text-xl font-bold'>{plugin.name}<span className='ml-4 text-base font-light'>{plugin.version}</span></div>
          <div className='text-sm mt-1 font-light text-gray-400'>Last Update: {plugin.lastUpdate ? plugin.lastUpdate : 'Not update yet'}</div>
          <div className='text-sm mt-1 font-light text-gray-400'>Total downloads: {plugin.downloads}</div>
        </div>
        <div className='w-32 flex flex-col text-sm h-full py-2'>
          <button className='main-button py-1 flex items-center justify-center'><div className='w-3 mr-2'><Download color='#fff' /></div>Download</button>
          {isAuthUser && <button className='border border-primary rounded py-1 mt-2 text-primary hover:border-primary-hover hover:text-primary-hover'>Edit</button>}
        </div>
      </div>
      <div className='py-4 px-2 font-light'>{plugin.description}</div>
      {/* details */}
      <div className='border-t'>

      </div>
    </div>
    : <></>
  )
}

export default PluginOverview