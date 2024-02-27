import React, { useEffect, useRef, useState } from 'react'
import { AppProps, Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../utils/Config';
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { codeSet, extractPluginName } from '../../utils/Code';
import CodeEditor from '../../components/CodeEditor';
import { replaceLast } from '../../utils/Functions';
import Logo from '../../asset/svgs/Logo';
import { build, downloadFile, updateSpigotFiles } from '../../utils/CodeBuild';
import DocSidebar from './DocSidebar';

const PluginDev: React.FC<AppProps> = ({ user }) => {

  const navigate = useNavigate();
  const logsContainerRef = useRef(null);
  const saveBtnRef = useRef(null);
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
  const [isDownloading, setIsDownloading] = useState(false);
  // console
  const [isConsoleOpened, setIsConsoleOpened] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  
  // Handle keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        (saveBtnRef.current as unknown as HTMLElement).click();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get the data from params
  useEffect(() => {
    (async () => {
      // Go to error page if user is not authenticated
      if (user === null) navigate('/pagenotfound');
      else if (user) {
        try {
          // Get owner
          const userRes = await fetch(`${config.api.mongodb}/get-single-item?database=mineplugin&collection=users&keys=['username']&values=['${username}']`);
          const userData = await userRes.json();
          // Page not found if user is not owner
          if (userData.username !== user?.username) {
            navigate('/pagenotfound');
            return;
          }          
          // Get plugin
          const pluginRes = await fetch(`${config.api.mongodb}/get-single-item?database=mineplugin&collection=plugins&keys=['owner', 'name']&values=['${username}', '${pluginId}']`);
          const pluginData = await pluginRes.json();
          setPlugin(pluginData);
          setCode(pluginData.code);
        } catch (error) {
          navigate('/pagenotfound');
          console.log(error);
        }
      }
    })();
    document.title = `${pluginId} | MinePlugin`;
  }, [user, pluginId]);

  // Check building status every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(async () => {
      const buildId = localStorage.getItem('MinePlugin-buildId');
      // Check status if still building
      if (buildId) {
        setIsGeneratingFiles(false);
        setIsBuilding(true);
        const statusRes = (await fetch(`${config.api.codeBuild}/track-build?buildId=${buildId}`));
        const status = (await statusRes.json()).status;
        // Remove build id from local storage if completed
        if (status !== 'IN_PROGRESS') {
          localStorage.removeItem('MinePlugin-buildId');
          setIsBuilding(false);
          // Update plugin to already built
          await fetch(`${config.api.mongodb}/update-single-item`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              database: 'mineplugin',
              collection: 'plugins',
              keys: ['owner', 'name'],
              values: [owner?.username, plugin?.name],
              fields: ['alreadyBuilt', 'downloadUsers'],
              field_values: [true, []]
            })
          });
          setPlugin({ ...plugin as Plugin, alreadyBuilt: true });
        }
        // Get logs if still building
        const logsRes = (await fetch(`${config.api.codeBuild}/stream-logs?buildName=mineplugin-build&buildId=${buildId}`));
        setLogs(await logsRes.json());
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
  }, [pluginId]);

  // Scroll to bottom if logs changes
  useEffect(() => {
    const container = (logsContainerRef.current as unknown as HTMLElement);
    if (container) container.scrollTop = container.scrollHeight;
  }, [logs]);

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
        database: 'mineplugin',
        collection: 'plugins',
        keys: ['owner', 'name'],
        values: [owner?.username, plugin?.name],
        fields: ["code", 'alreadyBuilt', 'lastUpdate'],
        field_values: [code, false, new Date().toISOString()]
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
    setIsConsoleOpened(true);
    setLogs([]);
    // store files to s3
    const pluginClassName = extractPluginName(code) || '';
    await updateSpigotFiles(owner?.username as string, pluginClassName, code);
    // build
    const buildId = await build(owner?.username as string, pluginClassName);
    localStorage.setItem('MinePlugin-buildId', buildId);
  }

  // Download the plugin
  const download = async () => {
    if (!plugin || !owner) return;
    setIsDownloading(true);
    const pluginName = extractPluginName(plugin.code) || '';
    await downloadFile(`src/${owner.username}/${pluginName}/${pluginName}.jar`, `${pluginName}.jar`);
    // Update download users & numbers
    if (!plugin.downloadUsers?.includes(owner.username)) {
      setPlugin({ ...plugin, downloadUsers: plugin.downloadUsers ? [...plugin.downloadUsers, owner.username] : [owner.username], downloads: plugin.downloads + 1 });
      await fetch(`${config.api.mongodb}/update-single-item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mineplugin',
          collection: 'plugins',
          keys: ['owner', 'name'],
          values: [owner.username, plugin.name],
          fields: ["downloads", 'downloadUsers'],
          field_values: [plugin.downloads + 1, plugin.downloadUsers ? [...plugin.downloadUsers, owner.username] : [owner.username]]
        })
      });
    }
    setIsDownloading(false);
  }

  return (
    plugin ?
      <div className='flex-1 flex flex-col scroller'>
        {/* header */}
        <div className='flex items-center justify-between py-4 px-8 shadow sticky top-0 z-10'>
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
            <button onClick={saveCode} ref={saveBtnRef} className='py-1 px-4 border border-primary hover:border-primary-hover disabled:text-gray-300 disabled:border-gray-300' disabled={code === plugin.code || isBuilding || isChecking || isSaving || isGeneratingFiles}>Save</button>
            <button onClick={generateAndBuild} className='py-1 px-4 ml-2 main-button disabled:bg-gray-300' disabled={isBuilding || isChecking || isSaving || isGeneratingFiles || plugin.alreadyBuilt}>Build</button>
            <button onClick={download} className='py-1 px-4 ml-2 main-button disabled:bg-gray-300' disabled={isBuilding || isChecking || isSaving || isGeneratingFiles || isDownloading}>Download</button>
          </div>
        </div>
        {/* dev body */}
        <main className='flex flex-1 scroller'>
          <DocSidebar fetchLink='https://api.github.com/repos/Bukkit/Bukkit/contents/src/main/java/org/bukkit' parentDir='' />
          <div className='flex-1 p-1 min-w-0 flex flex-col'>
            <div className='text-sm px-1'>{extractPluginName(code)}.java</div>
            <div className='rounded overflow-hidden flex-1 mt-1'>
              <CodeEditor code={code} setCode={setCode} />
            </div>
            <div className={`border-t border-gray-300 p-1 px-2 flex flex-col`}>
              <div className='text-gray-500 text-sm font-bold cursor-pointer' onClick={() => setIsConsoleOpened(!isConsoleOpened)}><i className='fa-solid fa-terminal mr-2 text-xs' />Console</div>
              <div className={`${isConsoleOpened ? 'pb-16 h-48 scroller' : 'h-0 overflow-hidden'}`} ref={logsContainerRef}>
                {isGeneratingFiles && <div className='text-sm text-gray-300'>Generating files...</div>}
                {(!isGeneratingFiles && isBuilding && logs.length === 0) && <div className='text-sm text-gray-300'>Start building...</div>}
                {logs.map((log, i) => <div className='mt-1 flex items-start text-sm'>
                  <div className='text-gray-300'>{i + 1}</div>
                  <div className={`ml-4${log.includes('Running command') ? ' text-blue-500' : log.includes('COMMAND_EXECUTION_ERROR') ? ' text-red-500' : log.includes(' BUILD State: SUCCEEDED') ? ' text-green-500' : ''}`}>{log}</div>
                </div>)}
              </div>
            </div>
          </div>
        </main>
      </div>
      : <></>
  )
}

export default PluginDev