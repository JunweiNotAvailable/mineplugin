import React from 'react'
import Pickaxe from '../asset/svgs/Pickaxe'

interface Props {
  className?: string
}

const PluginDefaultIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={`w-full aspect-square flex justify-center items-center bg-gray-200 ${className}`}>
      <div className='w-1/2'>
        <Pickaxe color='#a0a0a0' />
      </div>
    </div>
  )
}

export default PluginDefaultIcon