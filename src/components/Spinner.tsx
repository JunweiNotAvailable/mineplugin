import { motion } from 'framer-motion'
import React from 'react'

interface Props {
  size?: number
  color?: string
}

const Spinner: React.FC<Props> = ({ size, color }) => {
  return (
    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: .4, repeat: Infinity, ease: 'linear' }} className={`rounded-full border${size && size > 24 ? '-2' : ''}`} style={{ width: size || 16, height: size || 16, borderColor: color || '#000', borderTopColor: 'transparent' }} />
  )
}

export default Spinner