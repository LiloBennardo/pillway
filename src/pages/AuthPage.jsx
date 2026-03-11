import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green-dark mb-4">
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <rect x="26" y="16" width="12" height="32" rx="3" fill="#10B981" />
              <rect x="16" y="26" width="32" height="12" rx="3" fill="#10B981" />
            </svg>
          </div>
          <h1 className="text-white font-display font-bold text-3xl">PillWay</h1>
          <p className="text-gray-400 text-sm mt-1">Le bon médicament, au bon moment</p>
        </div>

        {/* Form */}
        <div className="bg-bg-card rounded-3xl p-6 shadow-card border border-bg-hover">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {isLogin ? (
                <LoginForm onSwitch={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitch={() => setIsLogin(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
