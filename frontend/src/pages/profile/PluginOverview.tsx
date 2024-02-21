import React, { useEffect, useState } from 'react'
import { Plugin, User } from '../../utils/Interfaces'
import { useNavigate, useParams } from 'react-router-dom'
import { config } from '../../utils/Config'

interface Props {
  profileUser: User
  isAuthUser: boolean
}

const PluginOverview: React.FC<Props> = ({ profileUser, isAuthUser }) => {

  const navigate = useNavigate();
  const { username, pluginId } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null | undefined>(undefined);

  // Load the plugin by route
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${config.api.mongodb}/get-single-item?database=mc-picker&collection=plugins&keys=['name', 'owner']&values=['${encodeURIComponent(pluginId as string)}', '${username}']`);
        if (res.ok) {
          setPlugin(await res.json());
        }
      } catch (error) {
        console.log('Failed getting plugin')
      }
    })();
  }, []);

  return (
    plugin ? <div>
      {plugin.name}
    </div>
    : <></>
  )
}

export default PluginOverview