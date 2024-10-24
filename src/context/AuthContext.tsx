import type { ReactNode } from "react";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from '../services/api/apiService'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>
  register: (email: string, password: string, name: string, recaptchaToken: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  googleSignIn: (token: string, recaptchaToken: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Add development bypass
  const isDevelopment = import.meta.env.DEV
  const [user, setUser] = useState<User | null>(isDevelopment ? {
    id: 'dev-user',
    email: 'dev@example.com',
    name: 'Developer'
  } : null)
  const [isLoading, setIsLoading] = useState(!isDevelopment)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isDevelopment) {
      checkAuth()
    }
  }, [isDevelopment])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const user = await apiService.getCurrentUser()
        setUser(user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, recaptchaToken: string) => {
    try {
      setError(null)
      const { user, token } = await apiService.login(email, password, recaptchaToken)
      localStorage.setItem('token', token)
      setUser(user)
    } catch (error: any) {
      setError(error.message || 'فشل تسجيل الدخول')
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, recaptchaToken: string) => {
    try {
      setError(null)
      const { user, token } = await apiService.register(email, password, name, recaptchaToken)
      localStorage.setItem('token', token)
      setUser(user)
    } catch (error: any) {
      setError(error.message || 'فشل إنشاء الحساب')
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
      localStorage.removeItem('token')
      setUser(null)
    } catch (error: any) {
      setError(error.message || 'فشل تسجيل الخروج')
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await apiService.resetPassword(email)
    } catch (error: any) {
      setError(error.message || 'فشل إعادة تعيين كلمة المرور')
      throw error
    }
  }

  const googleSignIn = async (token: string, recaptchaToken: string) => {
    try {
      setError(null)
      const { user, token: authToken } = await apiService.googleAuth(token, recaptchaToken)
      localStorage.setItem('token', authToken)
      setUser(user)
    } catch (error: any) {
      setError(error.message || 'فشل تسجيل الدخول بواسطة جوجل')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        resetPassword,
        googleSignIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
