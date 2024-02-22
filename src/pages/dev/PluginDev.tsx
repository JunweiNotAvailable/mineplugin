import React, { useEffect, useState } from 'react'
import { AppProps, Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../utils/Config';
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { codeSet } from '../../utils/Code';
import CodeEditor from '../../components/CodeEditor';

const PluginDev: React.FC<AppProps> = ({ user }) => {

  const navigate = useNavigate();
  const { username, pluginId } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null | undefined>(undefined);
  const [owner, setOwner] = useState<User | null | undefined>(undefined);
  const [code, setCode] = useState('');
  const [isBuilding, setIsBuilding] = useState(true);

  // Get the data from params
  useEffect(() => {
    (async () => {
      // Go to error page if user is not authenticated
      if (user === null) navigate('/pagenotfound');
      else if (user) {
        try {
          // Get owner
          const userRes = await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=users&keys=['username']&values=['${username}']`);
          const userData = await userRes.json();
          // Page not found if user is not owner
          if (userData.username !== user?.username) {
            navigate('/pagenotfound');
            return;
          }
          setOwner(userData);
          // Get plugin
          const pluginRes = await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=plugins&keys=['owner', 'name']&values=['${username}', '${pluginId}']`);
          const pluginData = await pluginRes.json();
          setPlugin(pluginData);
          setCode(pluginData.code);
        } catch (error) {
          navigate('/pagenotfound');
          console.log(error);
        }
      }
    })();
    document.title = `${pluginId} | MC Picker`;
  }, [user]);

  return (
    plugin ?
      <div className='flex-1 flex flex-col scroller'>
        {/* header */}
        <div className='flex items-center justify-between py-4 px-8 shadow sticky top-0'>
          <div className='flex items-center font-bold cursor-pointer' onClick={() => navigate(`/${username}/${pluginId}`)}>
            <div className='w-4 mr-2'><PluginsIcon /></div>
            {plugin.name}
          </div>
          {/* buttons */}
          <div className='flex text-sm'>
            {isBuilding && <div className='text-sm font-bold text-gray-300 flex items-center px-4'>Building...</div>}
            <button className='py-1 px-4 border border-primary hover:border-primary-hover rounded disabled:text-gray-300 disabled:border-gray-300' disabled={code === plugin.code}>Save</button>
            <button className='py-1 px-4 ml-2 main-button'>Build</button>
          </div>
        </div>
        {/* dev body */}
        <main className='flex flex-1 scroller'>
          <aside className='w-64 box-border p-4 sticky top-0'>
            <div className='text-sm font-bold'>Add Plugin Components</div>
            <div className='mt-2 flex flex-col text-sm'>
              {Array.from(codeSet.Components).map(([key, value]) => <button className='hover:bg-gray-100 mt-2 rounded py-1 px-2 text-left' key={key}>{key}</button>)}
            </div>
          </aside>
          <div className='flex-1 p-4'>
            <div className='rounded overflow-hidden h-full'>
              <CodeEditor code={code} setCode={setCode} />
            </div>
          </div>
        </main>
      </div>
      : <></>
  )
}

export default PluginDev