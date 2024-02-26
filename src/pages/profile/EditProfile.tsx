import React, { useEffect, useRef, useState } from 'react'
import { AppProps, User } from '../../utils/Interfaces'
import Avatar from '../../components/Avatar'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import { config } from '../../utils/Config'
import { Auth } from 'aws-amplify'
import { deleteImage, uploadImage } from '../../utils/Functions'

interface Props extends AppProps {
  isAuthUser: boolean
  pictureUrl: string
  setPictureUrl: React.Dispatch<React.SetStateAction<string>>
}

const EditProfile: React.FC<Props> = ({ user, setUser, isAuthUser, pictureUrl, setPictureUrl }) => {

  const navigate = useNavigate();
  const pictureInputRef = useRef(null);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && !isAuthUser) {
      navigate(`/${user.username}`);
    }
  }, [user]);

  // Update user profile
  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    // Store to database
    await fetch(`${config.api.mongodb}/update-single-item`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: 'mineplugin',
        collection: 'users',
        keys: ['username'],
        values: [user.username],
        fields: ['nickname'],
        field_values: [nickname]
      })
    });
    setUser({ ...user, nickname: nickname });
    setIsSaving(false);
  }

  // Change user's picture
  const changePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file || !user) return;
    if (user?.picture) {
      deleteImage(`src/${user.username}/${user.picture}`);
    }
    // Upload picture
    const { imageName, urlRes } = await uploadImage(`src/${user.username}`, file);
    setPictureUrl(urlRes);
    const newUser: User = { ...user, picture: imageName };
    setUser(newUser);
    // Update user
    await fetch(`${config.api.mongodb}/update-single-item`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: 'mineplugin',
        collection: 'users',
        keys: ['username'],
        values: [user.username],
        fields: ['picture'],
        field_values: [imageName]
      })
    });
  }

  // Delete user's picture
  const deletePicture = async () => {
    if (!user) return;
    // Delete image
    setPictureUrl('');
    await deleteImage(`src/${user.username}/${user.picture}`);
    const newUser: User = { ...user, picture: '' };
    setUser(newUser);
    // Update user
    await fetch(`${config.api.mongodb}/update-single-item`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: 'mineplugin',
        collection: 'users',
        keys: ['username'],
        values: [user.username],
        fields: ['picture'],
        field_values: ['']
      })
    });
  }

  return (
    isAuthUser ?
      <div className='flex flex-col'>
        {/* picture */}
        <div className='py-4'>
          <div className='text-sm font-bold'>Picture</div>
          <div className='flex items-center'>
            <div className='relative mt-2 w-1/4 min-w-36 max-w-50 rounded-full aspect-square overflow-hidden cursor-pointer' onClick={() => (pictureInputRef.current as any as HTMLElement).click()}>
              {pictureUrl ? <img className='w-full h-full object-cover object-center' src={pictureUrl} /> : <Avatar />}
              <input type='file' className='absolute' ref={pictureInputRef} style={{ width: '0', height: '0' }} accept="image/*" onInput={changePicture} />
            </div>
            {user?.picture && <button onClick={deletePicture} className='ml-8 px-4 py-0.5 border text-sm border-gray-300 text-gray-500'>Remove picture</button>}
          </div>
        </div>
        {/* nickname */}
        <div className='py-4'>
          <div className='text-sm font-bold'>Nickname</div>
          <input className='main-input w-full max-w-md mt-1' value={nickname} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
        </div>
        <div className='py-8'>
          <button onClick={saveProfile} className='text-sm bg-green-600 text-white py-1.5 px-8 disabled:bg-gray-300' disabled={(nickname === user?.nickname) || isSaving}>{isSaving ? <Spinner color='#fff' size={16} /> : 'Save'}</button>
        </div>
      </div>
      : <></>
  )
}

export default EditProfile