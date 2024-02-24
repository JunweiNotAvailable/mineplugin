import React, { useEffect, useState } from 'react'
import { Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom'
import { config } from '../../utils/Config'
import Pickaxe from '../../asset/svgs/Pickaxe'
import Download from '../../asset/svgs/Download'
import UIWMarkdownEditor from '@uiw/react-markdown-editor'
import MarkdownEditor from '../../components/MarkdownEditor'
import { extractPluginName } from '../../utils/Code'
import { downloadFile } from '../../utils/CodeBuild'

interface Props {
  profileUser: User
  isAuthUser: boolean
  authUser: User | null | undefined
}

const PluginOverview: React.FC<Props> = ({ profileUser, isAuthUser, authUser }) => {

  const navigate = useNavigate();
  const { username, pluginId } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null | undefined>(undefined);
  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempDetails, setTempDetails] = useState('');
  const [isEdittingPlugin, setIsEdittingPlugin] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load the plugin by route
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${config.api.mongodb}/get-single-item?database=mineplugin&collection=plugins&keys=['name', 'owner']&values=['${encodeURIComponent(pluginId as string)}', '${username}']`);
        if (res.ok) {
          setPlugin(await res.json());
        }
      } catch (error) {
        console.log('Failed getting plugin')
      }
    })();
    document.title = `${pluginId} | MinePlugin`;
  }, []);

  // Reset inputs when click edit button
  useEffect(() => {
    if (isEdittingPlugin && plugin) {
      setTempName(plugin.name);
      setTempDescription(plugin.description);
      setTempDetails(plugin.details || '');
    }
  }, [isEdittingPlugin]);

  // Update the plugin information
  const updatePlugin = async () => {
    if (!plugin) return;
    setIsUpdating(true);
    // Store updated plugin
    await fetch(`${config.api.mongodb}/update-single-item`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: 'mineplugin',
        collection: 'plugins',
        keys: ['owner', 'name'],
        values: [profileUser.username, plugin?.name],
        fields: ["name", "description", "details"],
        field_values: [tempName, tempDescription, tempDetails]
      })
    });
    const newPlugin: Plugin = { ...plugin, name: tempName, description: tempDescription, details: tempDetails };
    setPlugin(newPlugin);
    setIsEdittingPlugin(false);
    setIsUpdating(false);
  }

  // Download the plugin
  const download = async () => {
    if (!plugin || !authUser) return;
    setIsDownloading(true);
    const pluginName = extractPluginName(plugin.code) || '';
    await downloadFile(`src/${profileUser.username}/${pluginName}/${pluginName}.jar`, `${pluginName}.jar`);
    // Update download users & numbers
    if (!plugin.downloadUsers?.includes(authUser.username)) {
      setPlugin({ ...plugin, downloadUsers: plugin.downloadUsers ? [...plugin.downloadUsers, authUser.username] : [authUser.username], downloads: plugin.downloads + 1 });
      await fetch(`${config.api.mongodb}/update-single-item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mineplugin',
          collection: 'plugins',
          keys: ['owner', 'name'],
          values: [profileUser.username, plugin.name],
          fields: ["downloads", 'downloadUsers'],
          field_values: [plugin.downloads + 1, plugin.downloadUsers ? [...plugin.downloadUsers, authUser.username] : [authUser.username]]
        })
      });
    }
    setIsDownloading(false);
  }

  return (
    plugin ? <div className='py-8'>
      {/* header */}
      <div className='flex items-center'>
        <div className='w-24 h-24 rounded-2xl flex bg-gray-200 items-center justify-center'>
          {plugin.picture ? <img /> : <div className='w-1/2'><Pickaxe color='#a0a0a0' /></div>}
        </div>
        <div className='flex-1 min-w-0 ml-6 mr-4 py-2 flex flex-col'>
          {isEdittingPlugin ?
            <input placeholder='Plugin name' className='main-input w-1/2' value={tempName} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTempName(e.target.value)} />
            : <div className='text-xl font-bold flex items-center'>{plugin.name}<span className='ml-4 text-base font-light'>{plugin.version}</span>{(isAuthUser && !isEdittingPlugin) && <i onClick={() => setIsEdittingPlugin(true)} className='fa-solid fa-pen text-gray-400 ml-4 cursor-pointer text-sm' />}</div>}
          <div className='text-sm mt-1 font-light text-gray-400'>Last Update: {plugin.lastUpdate ? plugin.lastUpdate : 'Not update yet'}</div>
          <div className='text-sm mt-1 font-light text-gray-400'>Total downloads: {plugin.downloads}</div>
        </div>
        {isEdittingPlugin ? <div className='w-40 flex text-sm h-full py-2'>
          <button onClick={() => setIsEdittingPlugin(false)} className='flex-1 border border-primary py-1 text-primary hover:border-primary-hover hover:text-primary-hover'>Cancel</button>
          <button onClick={updatePlugin} className='main-button flex-1 py-1 flex items-center justify-center ml-2'>Save</button>
        </div> : <div className='w-32 flex flex-col text-sm h-full py-2'>
          <button onClick={download} className='main-button py-1 flex items-center justify-center'><div className='w-3 mr-2'><Download color='#fff' /></div>Download</button>
          {isAuthUser && <button onClick={() => navigate(`/${username}/${pluginId}/dev`)} className='border border-primary py-1 mt-2 text-primary hover:border-primary-hover hover:text-primary-hover'><i className='fa-solid fa-code text-xs w-3 mr-2' />Code</button>}
        </div>}
      </div>
      {isEdittingPlugin ?
        <div className='flex'>
          <input placeholder='Plugin description' className='main-input my-4 flex-1 mx-2' value={tempDescription} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTempDescription(e.target.value)} />
        </div>
        : <div className='py-4 px-2 font-light'>{plugin.description}</div>}
      {/* details */}
      <div className='border-t py-8 px-2'>
        {isEdittingPlugin ? <MarkdownEditor source={tempDetails} setSource={setTempDetails} />
          : (plugin.details ?
            <UIWMarkdownEditor.Markdown className='markdown-content' source={plugin.details} />
            : <div className='flex justify-center'>
              <div className='text-gray-400 font-light'>No details about this plugin</div>
            </div>
          )
        }
      </div>
    </div>
      : <></>
  )
}

export default PluginOverview