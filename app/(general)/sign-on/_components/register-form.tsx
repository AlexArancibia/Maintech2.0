'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import api from '@/lib/axios'
import axios from 'axios'

interface AuthResponse {
  jwt: string
  user: {
    id: number
    username: string
    email: string
  }
}

interface ErrorResponse {
  error: {
    message: string
  }
}

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)
    
    const formData = new FormData(event.currentTarget)
    const jsonData = Object.fromEntries(formData)

    try {
      const response = await api.post<AuthResponse>('api/auth/local/register', jsonData)
      setMessage('Registro exitoso.')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage((error.response.data as ErrorResponse).error.message)
      } else {
        setMessage('Error de conexión. Por favor, intente nuevamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Registrarse</CardTitle>
        <CardDescription className="text-gray-400">Crea una nueva cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={register}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-300">Nombre de usuario</Label>
              <Input id="username" name="username" required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">Correo electrónico</Label>
              <Input id="email" name="email" type="email" required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">Contraseña</Label>
              <Input id="password" name="password" type="password" required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-white" />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Registrarse'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        {message && (
          <p className={`text-sm font-medium text-center w-full ${message.includes('exitoso') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

export default RegisterForm