import { motion } from "framer-motion"
import React from "react"

interface Props {
  loading?: boolean
}

const Logo: React.FC<Props> = ({ loading }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={'100%'}
      viewBox="0 0 320 340"
      fill="none"
    >
      <path fill="#397A72" d="M80 0h100v20H80z" />
      <path fill="#5BE7D6" d="M80 20h100v20H80z" />
      <path fill="#5BE7D6" d="M80 20h100v20H80z" />
      <path fill="#5BE7D6" d="M80 20h100v20H80zM220 180V80h20v100z" />
      <path fill="#5BE7D6" d="M220 180V80h20v100z" />
      <path fill="#5BE7D6" d="M220 180V80h20v100zM200 100V40h20v60z" />
      <path fill="#5BE7D6" d="M200 100V40h20v60z" />
      <path fill="#5BE7D6" d="M200 100V40h20v60z" />
      <path fill="#5BE7D6" d="M160 40h60v20h-60z" />
      <path fill="#5BE7D6" d="M160 40h60v20h-60z" />
      <path fill="#5BE7D6" d="M160 40h60v20h-60z" />
      <path
        fill="#397A72"
        d="M240 180V80h20v100zM200 180v-80h20v80zM80 40h80v20H80zM180 20h20v20h-20zM220 180h20v20h-20zM60 20h20v20H60zM220 60h20v20h-20z"
      />
      <path fill="#5BE7D6" d="M180 60h20v20h-20z" />
      <path fill="#5F5248" d="M180 80h20v20h-20z" />
      <path
        fill="#5F5248"
        d="M180 80h20v20h-20zM220 40h20v20h-20zM160 100h20v20h-20zM40 220h20v20H40zM0 240h40v20H0zM60 200h20v20H60zM80 180h20v20H80zM100 160h20v20h-20zM120 140h20v20h-20zM140 120h20v20h-20z"
      />
      <path
        fill="#736458"
        d="M200 20h20v20h-20zM160 60h20v20h-20zM120 100h20v20h-20zM0 220h20v20H0zM20 200h20v20H20zM40 180h20v20H40zM60 160h20v20H60zM80 140h20v20H80zM100 120h20v20h-20zM140 80h20v20h-20z"
      />
      <path fill="#99775D" d="M160 100V80h20v20z" />
      <path
        fill="#816A59"
        d="M140 120v-20h20v20zM60 200v-20h20v20zM20 240v-20h20v20zM100 160v-20h20v20z"
      />
      <path
        fill="#99775D"
        d="M40 220v-20h20v20zM80 180v-20h20v20zM120 140v-20h20v20zM220 40V20h20v20zM200 60V40h20v20z"
      />
      <motion.path animate={{ fill: loading ? ["#D3CBC8", "#AF9F99", "#6B5850", '#D3CBC8'] : '#B4A7A1' }} transition={{ duration: loading ? 1 : 0, repeat: Infinity }} d="M200 281h60v59h-60z" />
      <motion.path animate={{ fill: loading ? ["#AF9F99", "#6B5850", "#D3CBC8", '#AF9F99'] : '#9C8C85' }} transition={{ duration: loading ? 1 : 0, repeat: Infinity }} d="M140 220h60v61h-60z" />
      <motion.path animate={{ fill: loading ? ["#6B5850", "#D3CBC8", "#AF9F99", '#6B5850'] : '#6B5850' }} transition={{ duration: loading ? 1 : 0, repeat: Infinity }} d="M260 220h60v61h-60z" />
    </svg>
  )
}

export default Logo