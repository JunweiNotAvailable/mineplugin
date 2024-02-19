import React, { useEffect, useState } from 'react'
import { AppProps, Plugin } from '../../utils/Interfaces'
import './style.css'
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { toClassFormat } from '../../utils/Functions';
import { config } from '../../utils/Config';
import { defaultCode } from '../../utils/Code';
import { useNavigate } from 'react-router-dom';

const NewPlugin: React.FC<AppProps> = ({ user }) => {

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.20');
  const [isPublic, setIsPublic] = useState(true);
  const [areValidInputs, setAreValidInputs] = useState(false);
  
  // Set document title
  useEffect(() => {
    document.title = 'New plugin | MC Picker';
  }, []);

  // Check if inputs are valid
  useEffect(() => {
    setAreValidInputs(!user?.plugins.map(n => n.toLowerCase()).includes(name.toLowerCase()) && name.length > 0 && description.length > 0);
  }, [name, description]);

  /**
   * Create plugin
   * Store to database
   * Go to edit page
   */
  const submit = async () => {
    const plugin: Plugin = {
      name: name,
      description: description,
      version: '1.20',
      owner: user?.username as string,
      code: defaultCode.replaceAll('MyPlugin', toClassFormat(name)),
      isPublic: isPublic,
    };
    try {
      // Store new plugin data
      await fetch(`${config.api.mongodb}/put-single-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mc-picker',
          collection: 'plugins',
          value: plugin,
        })
      });
      // Store updated user
      await fetch(`${config.api.mongodb}/update-single-item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: 'mc-picker',
          collection: 'users',
          key: 'username',
          id: user?.username as string,
          fields: ["plugins"],
          values: [[...user?.plugins as string[], name]]
        })
      });
      navigate(`/${user?.username}/${name}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='py-8 flex flex-col items-center'>
      <div className='w-full p-4 max-w-2xl'>
        <div className='text-xl font-bold flex items-center'><div className='w-4 mr-3'><PluginsIcon /></div>New plugin</div>
        <div className='input-group max-w-96 mt-4'>
          <label>Name</label>
          <input placeholder='Plugin name' className='main-input' value={name} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
        </div>
        {name && <div className='text-xs py-1 text-gray-500'>The class name of the plugin will be created as <span className='font-bold text-blue-400'>{toClassFormat(name)}</span></div>}
        <div className='input-group mt-3'>
          <label>Description<span className='ml-2 text-gray-400'>(Optional)</span></label>
          <input placeholder='Add description...' className='main-input' value={description} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
        </div>
        <div className='text-sm mt-3 flex items-center cursor-pointer' onClick={() => setIsPublic(!isPublic)}>
          <div className={`mr-4 w-4 h-4 flex items-center justify-center border rounded-full border-gray-300 text-white${!isPublic ? ' bg-blue-400' : ''}`}>{!isPublic && <i className='fa-solid fa-check' style={{ fontSize: 10 }} />}</div>
          Private
        </div>
        <div className='flex justify-end mt-8'>
          <button onClick={submit} className='main-button text-sm py-1.5 px-4 disabled:bg-secondary' disabled={!areValidInputs}>Create plugin</button>
        </div>
      </div>
    </div>
  )
}

export default NewPlugin