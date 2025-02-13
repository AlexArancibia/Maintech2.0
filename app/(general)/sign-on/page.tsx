'use client'

import React, { useState } from 'react'
import LoginForm from './_components/login-form'
import RegisterForm from './_components/register-form'
import { Button } from '@/components/ui/button'

const AuthForms: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <Button
        className="mt-4 bg-transparent text-gray-300 hover:text-white transition-colors duration-300"
        onClick={() => setIsLogin(!isLogin)}
      >
        {/* {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'} */}
      </Button>
    </div>
  )
}

export default AuthForms