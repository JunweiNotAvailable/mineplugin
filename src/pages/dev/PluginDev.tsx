import React, { useEffect, useState } from 'react'
import { AppProps, Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../utils/Config';

const PluginDev: React.FC<AppProps> = ({ user, setUser }) => {

  const navigate = useNavigate();
  const { username, pluginId } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null | undefined>(undefined);
  const [owner, setOwner] = useState<User | null | undefined>(undefined);
  const [isAuthUser, setIsAuthUser] = useState(false);

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
          if (userData.username !== user?.username) {
            navigate('/pagenotfound');
            return;
          }
          setOwner(userData);
          setIsAuthUser(true);
          // Get plugin
          const pluginRes = await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=plugins&keys=['owner', 'name']&values=['${username}', '${pluginId}']`);
          const pluginData = await pluginRes.json();
          setPlugin(pluginData);
        } catch (error) {
          navigate('/pagenotfound');
          console.log(error);
        }
      }
    })();
    document.title = `${pluginId} | MC Picker`;
  }, [user]);
  
  return (
    <div className='flex-1'>
      
    </div>
  )
}

export default PluginDev