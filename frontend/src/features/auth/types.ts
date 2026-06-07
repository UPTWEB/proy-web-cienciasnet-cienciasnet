export interface AuthUser {
  id: string
  name: string
  email: string
  active: boolean
  roles: string[]
  permissions: string[]
}

export interface LoginInput {
  email: string
  password: string
  remember: boolean
}
