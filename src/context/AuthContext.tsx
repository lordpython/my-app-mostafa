import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User as FirebaseUser
} from "firebase/auth"
import { auth } from "../config/firebase"

interface User {
  id: string
  email: string | null
  name: string | null
  avatar?: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  googleSignIn: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      // Check for admin session
      const isAdminSession = localStorage.getItem('adminSession')
      
      if (isAdminSession === 'true') {
        setUser({
          id: 'admin-id',
          email: 'admin@admin.com',
          name: 'Admin',
          isAdmin: true
        })
      } else if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatar: firebaseUser.photoURL || undefined,
          isAdmin: false
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      
      // Check for admin credentials
      if (email === 'admin@admin.com' && password === 'admin123') {
        // Set admin user directly without Firebase authentication
        setUser({
          id: 'admin-id',
          email: 'admin@admin.com',
          name: 'Admin',
          isAdmin: true
        })
        // Store admin session
        localStorage.setItem('adminSession', 'true')
        return
      }

      // Regular user authentication
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (result.user) {
        setUser({
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          avatar: result.user.photoURL || undefined,
          isAdmin: false
        })
      }
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول')
      throw err
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null)
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      // Update user profile with name using the imported updateProfile function
      if (firebaseUser) {
        await updateProfile(firebaseUser, { 
          displayName: name 
        })
      }
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب')
      throw err
    }
  }

  const logout = async () => {
    try {
      // Clear admin session if exists
      localStorage.removeItem('adminSession')
      await signOut(auth)
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الخروج')
      throw err
    }
  }

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول بواسطة جوجل')
      throw err
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
