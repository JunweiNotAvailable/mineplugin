import React from 'react'

const Avatar = () => {
  return (
    <div className='w-full h-full bg-slate-200 relative overflow-hidden'>
      <div className='w-2/5 h-2/5 rounded-full absolute bg-slate-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3' />
      <div className='w-full h-full rounded-full absolute bg-slate-300 top-2/3 left-1/2 -translate-x-1/2' />
    </div>
  )
}

export default Avatar