import { ToggleState } from "@iwbam/react-ez"
import React from "react"

export interface AppProps {
  user: User | undefined | null
  setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>
  sidebarOpened: ToggleState
}

export interface User {
  username: string
  nickname: string
  plugins: string[]
  picture?: string
  favorites?: string[]
}

export interface Plugin {
  name: string
  description: string
  details?: string
  version: string
  owner: string
  code: string
  isPublic: boolean
  picture?: string
  lastUpdate?: string
  downloads: number
  downloadUsers?: string[]
  alreadyBuilt?: boolean
  starred?: string[]
}