import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { useNavigate, useLocation } from 'react-router-dom'

interface RegisterFormProps {
  onToggleForm: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as any)?.from?.pathname || '/game'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await register(email, password, name)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Error during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <div>
          <label className="block text-sm font-medium text-white">
            الاسم
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 
                     rounded-md text-white placeholder-white/50 focus:ring-2 
                     focus:ring-primary-500 focus:border-transparent"
            placeholder="أدخل اسمك"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 
                     rounded-md text-white placeholder-white/50 focus:ring-2 
                     focus:ring-primary-500 focus:border-transparent"
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 
                     rounded-md text-white placeholder-white/50 focus:ring-2 
                     focus:ring-primary-500 focus:border-transparent"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 
                     rounded-md text-white placeholder-white/50 focus:ring-2 
                     focus:ring-primary-500 focus:border-transparent"
            placeholder="أعد إدخال كلمة المرور"
            required
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          إنشاء حساب
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-primary-400 hover:text-primary-300 text-sm"
          >
            لديك حساب بالفعل؟ سجل دخولك
          </button>
        </div>
      </form>
    </motion.div>
  )
}
