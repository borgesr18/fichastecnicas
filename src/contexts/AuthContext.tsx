'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('user-data')
      
      if (authToken && userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-data')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (email === 'admin@sistemachef.com' && password === 'admin123') {
      const userData = {
        id: '1',
        email: 'admin@sistemachef.com',
        name: 'Administrador'
      }
      
      localStorage.setItem('auth-token', 'demo-token')
      localStorage.setItem('user-data', JSON.stringify(userData))
      document.cookie = 'auth-token=demo-token; path=/'
      setUser(userData)
    } else {
      throw new Error('Credenciais inválidas. Use admin@sistemachef.com / admin123')
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const userData = {
      id: Date.now().toString(),
      email,
      name
    }
    
    localStorage.setItem('auth-token', 'demo-token')
    localStorage.setItem('user-data', JSON.stringify(userData))
    document.cookie = 'auth-token=demo-token; path=/'
    setUser(userData)
  }

  const signOut = async () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
