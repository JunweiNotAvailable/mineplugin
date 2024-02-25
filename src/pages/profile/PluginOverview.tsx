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
import Spinner from '../../components/Spinner'
import { getFormattedDate } from '../../utils/Functions'

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
  const [isConfirmDeleting, setIsConfirmDeleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Click handler
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement);
      if (!target.closest('.delete-button') && !target.closest('.delete-popup')) {
        setIsConfirmDeleting(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

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

  // Delete the plugin
  const deletePlugin = async () => {
    setIsDeleting(true);
    try {
      // Delete data from database
      await fetch(`${config.api.mongodb}/delete-single-item?database=mineplugin&collection=plugins&keys=['owner', 'name']&values=['${username}', '${pluginId}']`, { method: 'DELETE' });
      // Update user
      await fetch(`${config.api.mongodb}/update-single-item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mineplugin',
          collection: 'users',
          keys: ['username'],
          values: [username],
          fields: ['plugins'],
          field_values: profileUser.plugins.filter(p => p !== pluginId)
        })
      });
      // Delete files in s3
      await fetch(`${config.api.s3}/access-file?bucket=mineplugin-bucket&path=src/${username}/${pluginId}&is_folder=True`, { method: 'DELETE' });
    } catch (error) {
      console.log(error)
    }
    // Update states
    setIsDeleting(false);
  }

  return (
    <>
      {plugin ? <div className='py-8'>
        {/* header */}
        <div className='flex items-center'>
          <div className='w-24 h-24 rounded-2xl flex bg-gray-200 items-center justify-center'>
            {plugin.picture ? <img /> : <div className='w-1/2'><Pickaxe color='#a0a0a0' /></div>}
          </div>
          <div className='flex-1 min-w-0 ml-6 mr-4 py-2 flex flex-col'>
            {isEdittingPlugin ?
              <input placeholder='Plugin name' className='main-input w-1/2' value={tempName} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTempName(e.target.value)} />
              : <div className='text-xl font-bold flex items-center'>{plugin.name}<span className='ml-4 text-base font-light'>{plugin.version}</span>{(isAuthUser && !isEdittingPlugin) && <i onClick={() => setIsEdittingPlugin(true)} className='fa-solid fa-pen text-gray-400 ml-4 cursor-pointer text-sm' />}</div>}
            <div className='text-sm mt-1 font-light text-gray-400'>Last Update: {plugin.lastUpdate ? getFormattedDate(plugin.lastUpdate) : 'Not update yet'}</div>
            <div className='text-sm mt-1 font-light text-gray-400'>Total downloads: {plugin.downloads}</div>
          </div>
          {isEdittingPlugin ? <div className='w-40 flex text-sm h-full py-2'>
            <button onClick={() => setIsEdittingPlugin(false)} className='flex-1 border border-secondary py-1 text-primary hover:text-primary-hover'>Cancel</button>
            <button onClick={updatePlugin} className='main-button flex-1 py-1 flex items-center justify-center ml-2 disabled:bg-secondary' disabled={isUpdating}>{isUpdating ? <Spinner size={14} color='#fff' /> : 'Save'}</button>
          </div> : <div className='w-32 flex flex-col text-sm h-full py-2'>
            <button onClick={download} className='main-button py-1 flex items-center justify-center disabled:py-2 disabled:bg-secondary' disabled={isDownloading}>{isDownloading ? <Spinner size={14} color='#fff' /> : <><span className='w-3 mr-2'><Download color='#fff' /></span>Download</>}</button>
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
          {(isAuthUser && !isEdittingPlugin) && <div className='flex justify-end'><i onClick={() => setIsEdittingPlugin(true)} className='fa-solid fa-pen text-gray-400 ml-4 cursor-pointer text-sm' /></div>}
          {isEdittingPlugin ? <MarkdownEditor source={tempDetails} setSource={setTempDetails} />
            : (plugin.details ?
              <UIWMarkdownEditor.Markdown className='markdown-content' source={plugin.details} />
              : <div className='flex justify-center'>
                <div className='text-gray-400 font-light'>No details about this plugin</div>
              </div>
            )
          }
        </div>
        {/* delete */}
        {isAuthUser && <div className='flex justify-end mt-4 border-t pt-8'>
          <button className={`delete-button font-bold text-white bg-red-400 py-1 px-4 text-sm`} onClick={() => setIsConfirmDeleting(true)}>Delete plugin</button>
        </div>}
      </div>
        : <></>}

      {/* delete popup */}
      {isConfirmDeleting && <div className='z-50 fixed w-dvw h-dvh top-0 left-0 flex items-center justify-center' style={{ background: '#0002' }}>
        <div className='delete-popup max-w-md w-5/6 bg-white shadow-xl rounded-sm p-4'>
          <div className='text-lg'>Delete <span className='font-bold'>{pluginId}</span></div>
          <div className='text-base mt-2'>Once it is deleted, it will be gone forever</div>
          <div className='mt-4 flex justify-end text-sm'>
            <button onClick={() => setIsConfirmDeleting(false)} className='border border-secondary text-primary py-1 px-3'>Cancel</button>
            <button onClick={deletePlugin} className='text-white bg-red-400 py-1 px-4 font-bold ml-2 disabled:bg-red-300 disabled:px-6' disabled={isDeleting}>{isDeleting ? <Spinner color='#fff' /> : 'Delete'}</button>
          </div>
        </div>
      </div>}
    </>
  )
}

export default PluginOverview