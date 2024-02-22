import React from "react"

interface Props {
  color?: string
}

const Download: React.FC<Props> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={'100%'}
      viewBox='0 0 77 86'
      fill="none"
    >
      <path
        stroke={color || '#000'}
        strokeLinecap="round"
        strokeWidth={5}
        d="M38.938 3V65.5M38 65 10 37M39 65l28-28M3 83h71"
      />
    </svg>
  )
}

export default Download