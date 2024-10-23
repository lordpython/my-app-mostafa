import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { apiService } from '../../services/api/apiService'

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await apiService.updateProfile({
        name: name !== user?.name ? name : undefined,
        avatar: avatar || undefined // Convert null to undefined
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحديث الملف الشخصي')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={user?.avatar || '/images/default-avatar.png'}
                alt={user?.name}
                className="w-32 h-32 rounded-full border-4 border-primary-500"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  📷
                </label>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mt-4 font-arabic">
              {user?.name}
            </h2>
            <p className="text-white/60 font-arabic">{user?.email}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-arabic">
                  الاسم
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md 
                           text-white placeholder-white/50 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center font-arabic">
                  {error}
                </p>
              )}

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  className="font-arabic"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="font-arabic"
                >
                  حفظ التغييرات
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between">
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="font-arabic"
              >
                تعديل الملف الشخصي
              </Button>
              <Button
                variant="danger"
                onClick={logout}
                className="font-arabic"
              >
                تسجيل الخروج
              </Button>
            </div>
          )}

          {/* Game Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <h3 className="text-lg font-medium text-white mb-2 font-arabic">
                المباريات
              </h3>
              <p className="text-3xl font-bold text-primary-400">12</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <h3 className="text-lg font-medium text-white mb-2 font-arabic">
                الإجابات الصحيحة
              </h3>
              <p className="text-3xl font-bold text-primary-400">45</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <h3 className="text-lg font-medium text-white mb-2 font-arabic">
                النقاط
              </h3>
              <p className="text-3xl font-bold text-primary-400">1,250</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
