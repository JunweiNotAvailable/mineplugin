import React from "react"

export interface AppProps {
  user: User | undefined | null
  setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>
}

export interface User {
  username: string
  nickname: string
  plugins: string[]
  picture?: string
}

export interface Plugin {
  name: string
  description: string
  version: string
  owner: string
  code: string
  isPublic: boolean
  picture?: string
  lastUpdate?: string
  downloads: number
}