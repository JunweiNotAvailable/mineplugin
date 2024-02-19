import React, { useEffect, useState } from 'react'
import { AppProps } from '../../utils/Interfaces'
import './style.css'
import PluginsIcon from '../../asset/svgs/PluginsIcon';
import { toClassFormat } from '../../utils/Functions';

const NewPlugin: React.FC<AppProps> = ({ user, setUser }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.20');
  const [areValidInputs, setAreValidInputs] = useState(false);
  
  // Set document title
  useEffect(() => {
    document.title = 'New plugin | MC Picker';
  }, []);

  // Check if inputs are valid
  useEffect(() => {
    setAreValidInputs(!user?.plugins.includes(toClassFormat(name)) && name.length > 0 && description.length > 0);
  }, [name, description]);

  // Create plugin and go to edit page
  const submit = async () => {
    try {
      
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
        <div className='flex justify-end mt-8'>
          <button onClick={submit} className='main-button text-sm py-1.5 px-4 disabled:bg-secondary' disabled={!areValidInputs}>Create plugin</button>
        </div>
      </div>
    </div>
  )
}

export default NewPlugin