export interface AppProps {
  user: User | undefined | null
}

export interface User {
  id: string
  name: string
}