import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
      recaptcha?: {
        enterprise: {
          ready: (callback: () => void) => void
          execute: (siteKey: string, options: { action: string }) => Promise<string>
        }
      }
    }
  }
}

// Add validation and error handling for environment variables
const validateEnvironmentVariables = () => {
  const errors = [];
  
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    errors.push('Missing VITE_GOOGLE_CLIENT_ID');
  }
  if (!import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
    errors.push('Missing VITE_RECAPTCHA_SITE_KEY');
  }
  
  return errors;
}

const envErrors = validateEnvironmentVariables();

export const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  const { login, register, googleSignIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/game'

  useEffect(() => {
    if (envErrors.length > 0) {
      console.error('Environment configuration errors:', envErrors);
      setError(envErrors.join(', '));
      return;
    }

    // Initialize Google Sign-In with error handling
    const initializeGoogleSignIn = () => {
      try {
        if (window.google?.accounts) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false, // Prevent auto-selection of account
            cancel_on_tap_outside: true // Allow closing the popup by clicking outside
          });

          const buttonElement = document.getElementById('googleSignInButton');
          if (buttonElement) {
            window.google.accounts.id.renderButton(buttonElement, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'continue_with' // Show "Continue with Google" text
            });
          }
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
        setError('Failed to initialize Google Sign-In');
      }
    };

    // Initialize reCAPTCHA with error handling
    const initializeRecaptcha = () => {
      try {
        if (window.google?.recaptcha?.enterprise) {
          window.google.recaptcha.enterprise.ready(() => {
            console.log('reCAPTCHA is ready');
          });
        } else {
          console.warn('reCAPTCHA enterprise not available');
        }
      } catch (err) {
        console.error('Error initializing reCAPTCHA:', err);
        setError('Failed to initialize reCAPTCHA');
      }
    };

    initializeGoogleSignIn();
    initializeRecaptcha();

    // Cleanup function
    return () => {
      try {
        window.google?.accounts.id.cancel();
      } catch (err) {
        console.error('Error cleaning up Google Sign-In:', err);
      }
    };
  }, []);

  const executeRecaptcha = async () => {
    try {
      if (!window.google?.recaptcha?.enterprise) {
        throw new Error('reCAPTCHA not initialized');
      }

      const token = await window.google.recaptcha.enterprise.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: isLogin ? 'LOGIN' : 'SIGNUP' }
      );

      if (!token) {
        throw new Error('Failed to get reCAPTCHA token');
      }

      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      throw new Error('Failed to verify reCAPTCHA. Please try again.');
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Execute reCAPTCHA before Google Sign-In
      const recaptchaToken = await executeRecaptcha()
      if (!recaptchaToken) {
        throw new Error('Failed to get reCAPTCHA token')
      }
      
      await googleSignIn(response.credential, recaptchaToken)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول بواسطة جوجل')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Execute reCAPTCHA before form submission
      const recaptchaToken = await executeRecaptcha()
      if (!recaptchaToken) {
        throw new Error('Failed to get reCAPTCHA token')
      }
      
      if (isLogin) {
        await login(email, password, recaptchaToken)
      } else {
        await register(email, password, name, recaptchaToken)
      }
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center font-arabic">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <div id="googleSignInButton" className="w-full"></div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60 font-arabic">
                أو
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            {!isLogin && (
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
                  placeholder="أدخل اسمك"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2 font-arabic">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md 
                         text-white placeholder-white/50 focus:ring-2 focus:ring-primary-500"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 font-arabic">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md 
                         text-white placeholder-white/50 focus:ring-2 focus:ring-primary-500"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center font-arabic">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full font-arabic"
              isLoading={isLoading}
            >
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/70 hover:text-white text-sm font-arabic"
            >
              {isLogin
                ? 'ليس لديك حساب؟ سجل الآن'
                : 'لديك حساب بالفعل؟ سجل دخولك'}
            </button>
          </div>

          {/* Add invisible reCAPTCHA */}
          <div ref={recaptchaRef} className="hidden">
            <div 
              className="g-recaptcha" 
              data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              data-action={isLogin ? 'LOGIN' : 'SIGNUP'}
            ></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
