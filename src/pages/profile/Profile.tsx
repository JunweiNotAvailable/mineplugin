import React, { useEffect, useState } from 'react'
import { AppProps } from '../../utils/Interfaces'
import { useParams } from 'react-router'

const Profile: React.FC<AppProps> = ({ user }) => {

  const { username } = useParams();
  const [isLoadingProfileUser, setIsLoadingProfileUser] = useState(true);

  /**
   * Loading the profile user:
   * User exists - Load user's data
   * User not found - Not found page
   */
  useEffect(() => {
    
  }, [username]);

  return (
    <div className='app-body'>
      {/* options */}
      <aside>

      </aside>
      {/* user's data */}
      <main>
        
      </main>
    </div>
  )
}

export default Profile