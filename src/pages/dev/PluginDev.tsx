import React, { useEffect, useRef, useState } from 'react'
import { AppProps, Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../utils/Config';
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { codeSet, extractPluginName } from '../../utils/Code';
import CodeEditor from '../../components/CodeEditor';
import { replaceLast } from '../../utils/Functions';
import Logo from '../../asset/svgs/Logo';
import { build, updateSpigotFiles } from '../../utils/CodeBuild';

const PluginDev: React.FC<AppProps> = ({ user }) => {

  const navigate = useNavigate();
  let timerRef = useRef<NodeJS.Timer | null>(null);
  const { username, pluginId } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null | undefined>(undefined);
  const [owner, setOwner] = useState<User | null | undefined>(undefined);
  const [code, setCode] = useState('');
  // building status
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

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

  // Check building status every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(async () => {
      const buildId = localStorage.getItem('MC-Picker-buildId');
      // Check status if still building
      if (buildId) {
        setIsGeneratingFiles(false);
        setIsBuilding(true);
        const statusRes = (await fetch(`${config.api.codeBuild}/track-build?buildId=${buildId}`));
        const status = (await statusRes.json()).status;
        console.log(status);
        // Remove build id from local storage if completed
        if (status !== 'IN_PROGRESS') {
          localStorage.removeItem('MC-Picker-buildId');
          setIsBuilding(false);
          // Update plugin to already built
          if (status === 'SUCCEEDED') {
            await fetch(`${config.api.mongodb}/update-single-item`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                database: 'mc-picker',
                collection: 'plugins',
                keys: ['owner', 'name'],
                values: [owner?.username, plugin?.name],
                fields: ['alreadyBuilt'],
                field_values: [true]
              })
            });
            setPlugin({ ...plugin as Plugin, alreadyBuilt: true });
          }
        }
      // no current build
      } else {
        setIsBuilding(false);
      }
      setIsChecking(false);
    }, 5000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, []);

  // Add a plugin component code to original code
  const addPluginComponent = (comp: string, value: string) => {
    let addedCode = replaceLast(code, '}', value + '\n}');
    setCode(addedCode);
  }

  // Save the code
  const saveCode = async () => {
    if (!plugin) return;
    setIsSaving(true);
    await fetch(`${config.api.mongodb}/update-single-item`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: 'mc-picker',
        collection: 'plugins',
        keys: ['owner', 'name'],
        values: [owner?.username, plugin?.name],
        fields: ["code", 'alreadyBuilt'],
        field_values: [code, false]
      })
    });
    setPlugin({ ...plugin, code: code, alreadyBuilt: false });
    setIsSaving(false);
  }

  /** 
   * Store the code to AWS s3 file
   * Trigger AWS CodeBuild and complie the java file
   */
  const generateAndBuild = async () => {
    setIsBuilding(true);
    setIsGeneratingFiles(true);
    // store files to s3
    const pluginName = extractPluginName(code) || '';
    await updateSpigotFiles(pluginName, code);
    // build
    const buildId = await build();
    localStorage.setItem('MC-Picker-buildId', buildId);
  }

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
            <div className='text-sm font-bold text-gray-300 flex items-center px-4'>
              {(isBuilding || isChecking || isSaving || isGeneratingFiles) && <div className='w-6 mr-2'><Logo loading /></div>}
              {
                isChecking ? 'Checking building status...'
                : isGeneratingFiles ? 'Generating files...'
                : isBuilding ? 'Building...'
                : isSaving ? 'Saving...'
                : ''
              }
            </div>
            <button onClick={saveCode} className='py-1 px-4 border border-primary hover:border-primary-hover rounded disabled:text-gray-300 disabled:border-gray-300' disabled={code === plugin.code || isBuilding || isChecking || isSaving || isGeneratingFiles}>Save</button>
            <button onClick={generateAndBuild} className='py-1 px-4 ml-2 main-button disabled:bg-gray-300' disabled={isBuilding || isChecking || isSaving || isGeneratingFiles || plugin.alreadyBuilt}>Build</button>
          </div>
        </div>
        {/* dev body */}
        <main className='flex flex-1 scroller'>
          <aside className='w-64 box-border p-4 sticky top-0'>
            <div className='text-sm font-bold'>Add Plugin Components</div>
            <div className='mt-2 flex flex-col text-sm'>
              {Array.from(codeSet.Components).map(([key, value]) => <button onClick={() => addPluginComponent(key, value)} className='hover:bg-gray-100 mt-2 rounded py-1 px-2 text-left' key={key}>{key}</button>)}
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