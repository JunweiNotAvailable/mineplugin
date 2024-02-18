import React from "react"

export interface AppProps {
  user: User | undefined | null
  setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>
}

export interface User {
  username: string
  nickname: string
}