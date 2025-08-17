"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getImageUrl } from "@/lib/getImageUrl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCourseBySlug } from "@/hooks/coursesAPI"
import type { DetailedCourse } from "@/types/CoursesType"
import { ArrowLeft, CreditCard, DollarSign, Shield, CheckCircle, User, Lock, Mail, CheckSquare, Square, Building2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/AuthContext"
import { useCurrency } from "@/hooks/CurrencyContext"
import { useApiData } from "@/hooks/ApiContext"
import api from "@/lib/axios"

type Params = {
  courseId: string
}

interface PostPurchase {
  data: {
    users_permissions_users: {
      connect: number[]
    }
  }
}

export default function CheckoutPage() {
  console.log("🎬 [CHECKOUT_PAGE] Componente renderizado")
  console.log("📋 [CHECKOUT_PAGE] Parámetros de la URL:", useParams<Params>())
  
  const { user, login, createUser } = useAuth()
  const { currency, formatPrice } = useCurrency()
  const { refreshPurchasedCourses } = useApiData()
  const router = useRouter()
  const params = useParams<Params>()
  const [course, setCourse] = useState<DetailedCourse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'auth' | 'payment' | 'processing'>('auth')
  const [newAccountCreated, setNewAccountCreated] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mercadopago' | 'deposito' | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    async function fetchData() {
      console.log("🚀 [CHECKOUT] Iniciando fetchData...")
      console.log("📋 [CHECKOUT] Parámetros recibidos:")
      console.log("   - courseId (params):", params.courseId)
      console.log("   - Tipo de courseId:", typeof params.courseId)
      console.log("   - User:", user)
      
      setIsLoading(true)
      try {
        console.log("🔍 [CHECKOUT] Llamando a getCourseBySlug...")
        console.log("   - Parámetros:", { slug: params.courseId, detailed: true })
        
        const fetchedCourse = await getCourseBySlug(params.courseId, true)
        
        console.log("📥 [CHECKOUT] Respuesta de getCourseBySlug:")
        console.log("   - fetchedCourse:", fetchedCourse)
        console.log("   - Tipo:", typeof fetchedCourse)
        console.log("   - Es null/undefined:", fetchedCourse === null || fetchedCourse === undefined)
        console.log("   - Tiene chapters:", fetchedCourse && "chapters" in fetchedCourse)
        
        if (fetchedCourse) {
          console.log("✅ [CHECKOUT] Curso encontrado, verificando estructura...")
          console.log("   - Título:", fetchedCourse.title)
          console.log("   - ID:", fetchedCourse.id)
          console.log("   - DocumentId:", fetchedCourse.documentId)
          console.log("   - Precio:", fetchedCourse.price)
          console.log("   - Categoría:", fetchedCourse.category)
          console.log("   - Imagen:", fetchedCourse.image)
          // Verificar si es DetailedCourse antes de acceder a chapters
          const isDetailedCourse = "chapters" in fetchedCourse
          const chaptersInfo = isDetailedCourse ? fetchedCourse.chapters : 'No disponible'
          const modalityInfo = fetchedCourse.modality || 'No disponible'
          
          console.log("   - Capítulos:", chaptersInfo)
          console.log("   - Modalidad:", modalityInfo)
          console.log("   - Es DetailedCourse:", isDetailedCourse)
          
          // Verificar si tiene la estructura mínima requerida
          const hasRequiredFields = fetchedCourse.title && 
                                  fetchedCourse.documentId && 
                                  fetchedCourse.image && 
                                  fetchedCourse.image.url
          
          console.log("🔍 [CHECKOUT] Verificación de campos requeridos:")
          console.log("   - Tiene título:", !!fetchedCourse.title)
          console.log("   - Tiene documentId:", !!fetchedCourse.documentId)
          console.log("   - Tiene imagen:", !!fetchedCourse.image)
          console.log("   - Tiene URL de imagen:", !!(fetchedCourse.image && fetchedCourse.image.url))
          console.log("   - Todos los campos requeridos:", hasRequiredFields)
          
          if (fetchedCourse && isDetailedCourse && hasRequiredFields) {
            console.log("✅ [CHECKOUT] Curso válido, estableciendo en estado...")
            setCourse(fetchedCourse)
            
            // Pre-llenar datos del usuario si está logueado
            if (user) {
              console.log("👤 [CHECKOUT] Usuario logueado, pre-llenando datos...")
              setFormData(prev => ({
                ...prev,
                email: user.email || "",
              }))
              setCurrentStep('payment')
              setNewAccountCreated(false) // Usuario ya existente
            } else {
              console.log("👤 [CHECKOUT] No hay usuario logueado, manteniendo en paso de auth...")
            }
          } else {
            console.log("❌ [CHECKOUT] Curso inválido o incompleto:")
            console.log("   - Tiene chapters:", isDetailedCourse)
            console.log("   - Tiene campos requeridos:", hasRequiredFields)
            console.log("   - Estructura del curso:", {
              title: fetchedCourse.title,
              documentId: fetchedCourse.documentId,
              image: fetchedCourse.image,
              chapters: chaptersInfo
            })
            setError("Course not found or insufficient details")
          }
        } else {
          console.log("❌ [CHECKOUT] getCourseBySlug retornó null/undefined")
          setError("Course not found or insufficient details")
        }
      } catch (err) {
        console.error("💥 [CHECKOUT] Error en fetchData:")
        console.error("   - Error:", err)
        console.error("   - Mensaje:", err instanceof Error ? err.message : 'Error desconocido')
        console.error("   - Stack:", err instanceof Error ? err.stack : 'No disponible')
        setError("Failed to fetch course details")
      } finally {
        console.log("🏁 [CHECKOUT] Finalizando fetchData, isLoading = false")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.courseId, user])

  const handleUserCreation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Validar que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      // Crear username con nombre completo
      const fullName = `${formData.nombre} ${formData.apellido}`.trim()

      // Crear usuario usando el método del AuthContext
      const userData = {
        username: fullName,
        email: formData.email,
        password: formData.password,
      }

      const response = await createUser(userData)
      
      // Loguear al usuario
      login(response)
      
      // Marcar que se creó una cuenta nueva
      setNewAccountCreated(true)
      
      // Pasar al siguiente paso
      setCurrentStep('payment')
      // Limpiar cualquier error previo
      setError(null)
      // Limpiar método de pago seleccionado
      setSelectedPaymentMethod(null)
      
    } catch (error: any) {
      console.error("Error creating user:", error)
      setError(error.message || "Error al crear el usuario. Por favor inténtalo de nuevo.")
      // Limpiar el error después de 5 segundos
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMercadoPagoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("💳 [MERCADOPAGO] Iniciando proceso de pago...")
    console.log("📋 [MERCADOPAGO] Estado actual:")
    console.log("   - Course:", course)
    console.log("   - User:", user)
    console.log("   - Course ID:", course?.id)
    console.log("   - Course DocumentId:", course?.documentId)
    console.log("   - Course Title:", course?.title)
    console.log("   - Course Price:", course?.price)
    
    if (!course || !user) {
      console.error("❌ [MERCADOPAGO] Faltan datos críticos:")
      console.error("   - Course existe:", !!course)
      console.error("   - User existe:", !!user)
      setError("Error: Curso o usuario no encontrado")
      return
    }

    // Validar que tenemos todos los datos necesarios del curso
    if (!course.title || !course.documentId) {
      console.error("❌ [MERCADOPAGO] Datos del curso incompletos:", {
        title: course.title,
        price: course.price,
        documentId: course.documentId,
        imageUrl: course.image?.url,
        hasImage: !!course.image,
        imageUrlExists: !!(course.image && course.image.url)
      })
      setError("Error: Información del curso incompleta")
      return
    }

    // Si el curso es gratuito, no debe ir a pasarela de pago
    if (!course.price || course.price <= 0) {
      // Matriculación directa
      setIsProcessing(true)
      try {
        const linkSuccess = await linkCourseToUser(user.id, course.documentId)
        if (!linkSuccess) {
          throw new Error("Error al vincular el curso con tu cuenta")
        }
        await refreshPurchasedCourses()
        router.push('/dashboard')
        return
      } catch (err: any) {
        setError(err.message || 'No se pudo completar la matrícula gratuita')
      } finally {
        setIsProcessing(false)
      }
    }

    // Validar datos del usuario
    if (!user.email || !user.id) {
      console.error("❌ Datos del usuario incompletos:", {
        email: user.email,
        id: user.id
      })
      setError("Error: Información del usuario incompleta")
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      
      // Usar el precio real del curso (debe ser > 0 para pago)
      const finalPrice = course.price
      
      const data = {
        coursePrice: finalPrice,
        userEmail: user.email,
        courseId: course.documentId,
        userId: user.id
      }

      // Agregar campos al FormData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      
      const response = await fetch('/api/payment/redirect-mercadopago', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl
      } else {
        throw new Error(result.error || 'Error al crear preferencia de pago')
      }
      
    } catch (error) {
      console.error('❌ Error redirecting to MercadoPago:', error)
      setError("Error al redirigir a MercadoPago. Por favor inténtalo de nuevo.")
      setIsProcessing(false)
    }
  }

  const linkCourseToUser = async (userId: number, courseId: string) => {
    try {
      console.log("🔗 [LINK_COURSE] Iniciando vinculación de curso al usuario...")
      console.log("📋 [LINK_COURSE] Datos de entrada:")
      console.log("   - userId:", userId)
      console.log("   - courseId:", courseId)
      console.log("   - Tipo de courseId:", typeof courseId)
      console.log("   - userId es válido:", userId > 0)
      console.log("   - courseId es válido:", courseId && courseId.length > 0)
      
      const payload: PostPurchase = {
        data: {
          users_permissions_users: {
            connect: [userId],
          },
        },
      }
      
      console.log("📤 [LINK_COURSE] Payload a enviar:", payload)
      console.log("🌐 [LINK_COURSE] URL de la API:", `/api/courses/${courseId}`)
      console.log("🔧 [LINK_COURSE] Configuración de axios:")
      console.log("   - Base URL:", api.defaults.baseURL)
      console.log("   - Headers:", api.defaults.headers)
      
      const response = await api.put(`/api/courses/${courseId}`, payload)
      
      console.log("✅ [LINK_COURSE] Respuesta exitosa de la API:")
      console.log("   - Status:", response.status)
      console.log("   - Status Text:", response.statusText)
      console.log("   - Data:", response.data)
      console.log("   - Headers:", response.headers)
      
      return true
    } catch (error: any) {
      console.error("❌ [LINK_COURSE] Error al vincular curso al usuario:")
      console.error("   - Mensaje:", error.message)
      console.error("   - Tipo de error:", error.constructor.name)
      console.error("   - Status:", error.response?.status)
      console.error("   - Status Text:", error.response?.statusText)
      console.error("   - Data:", error.response?.data)
      console.error("   - Headers:", error.response?.headers)
      console.error("   - URL intentada:", `/api/courses/${courseId}`)
      console.error("   - Payload enviado:", {
        data: {
          users_permissions_users: {
            connect: [userId],
          },
        },
      })
      console.error("   - Stack trace:", error.stack)
      
      // Log adicional para errores de red
      if (error.code) {
        console.error("   - Error code:", error.code)
      }
      if (error.syscall) {
        console.error("   - Syscall:", error.syscall)
      }
      
      return false
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("🚀 [CHECKOUT] Iniciando proceso de checkout...")
    console.log("📋 [CHECKOUT] Método de pago seleccionado:", selectedPaymentMethod)
    console.log("📋 [CHECKOUT] Estado del curso:")
    console.log("   - Course existe:", !!course)
    console.log("   - Course ID:", course?.id)
    console.log("   - Course DocumentId:", course?.documentId)
    console.log("   - Course Title:", course?.title)
    console.log("   - Course Price:", course?.price)
    console.log("   - Course Image:", course?.image)
    console.log("   - User existe:", !!user)
    console.log("   - User ID:", user?.id)
    console.log("   - User Email:", user?.email)
    
    const isFreeCourse = !course?.price || course.price <= 0

    // Matrícula directa para cursos gratuitos
    if (isFreeCourse) {
      try {
        if (!course || !user) {
          throw new Error('Curso o usuario no encontrado')
        }
        setIsProcessing(true)
        setCurrentStep('processing')
        const linkSuccess = await linkCourseToUser(user.id, course.documentId)
        if (!linkSuccess) {
          throw new Error('Error al vincular el curso con tu cuenta')
        }
        await refreshPurchasedCourses()
        router.push('/dashboard')
        return
      } catch (err: any) {
        setError(err.message || 'No se pudo completar la matrícula gratuita')
        setCurrentStep('payment')
        setTimeout(() => setError(null), 5000)
        return
      } finally {
        setIsProcessing(false)
      }
    }

    if (!selectedPaymentMethod) {
      console.log("❌ No se seleccionó método de pago")
      setError("Por favor selecciona un método de pago")
      setTimeout(() => setError(null), 5000)
      return
    }
    
    setIsProcessing(true)
    setCurrentStep('processing')
    
    try {
      // 1. Procesar pago según el método seleccionado
      let paymentSuccess = false
      
      if (selectedPaymentMethod === 'mercadopago') {
        console.log("💳 Procesando pago con MercadoPago...")
        // El pago de MercadoPago se maneja en handleMercadoPagoSubmit
        // No necesitamos procesarlo aquí
        return
      } else if (selectedPaymentMethod === 'deposito') {
        console.log("🏦 Procesando pago por depósito directo...")
        console.log("📋 Información del curso:")
        console.log("   - ID del curso:", course?.id)
        console.log("   - DocumentId:", course?.documentId)
        console.log("   - Título:", course?.title)
        console.log("   - Precio:", course?.price)
        console.log("📋 Información del usuario:")
        console.log("   - ID del usuario:", user?.id)
        console.log("   - Email:", user?.email)
        console.log("   - Username:", user?.username)
        
        // Para depósito directo, simulamos que el pago es exitoso
        // En el futuro, aquí se validaría el comprobante subido
        console.log("⏳ Simulando procesamiento de pago (2 segundos)...")
        await new Promise(resolve => setTimeout(resolve, 2000))
        paymentSuccess = true
        console.log("✅ Pago simulado exitoso")
      }
      
      if (!paymentSuccess) {
        console.log("❌ El pago no pudo ser procesado")
        throw new Error("El pago no pudo ser procesado")
      }

      // 2. Vincular curso con el usuario
      console.log("🔗 Iniciando vinculación del curso con el usuario...")
      if (course && user) {
        console.log("📋 Datos para vinculación:")
        console.log("   - User ID:", user.id)
        console.log("   - Course DocumentId:", course.documentId)
        console.log("   - Course ID:", course.id)
        
        const linkSuccess = await linkCourseToUser(user.id, course.documentId)
        
        if (!linkSuccess) {
          console.log("❌ Falló la vinculación del curso")
          throw new Error("Error al vincular el curso con tu cuenta")
        }
        
        console.log("✅ Curso vinculado exitosamente")
      } else {
        console.log("❌ Faltan datos de curso o usuario:")
        console.log("   - Course:", course)
        console.log("   - User:", user)
      }

      // 3. Actualizar los cursos comprados en el contexto
      console.log("🔄 Actualizando cursos comprados en el contexto...")
      await refreshPurchasedCourses()
      console.log("✅ Cursos comprados actualizados")

      // 4. Redirigir al dashboard
      console.log("🎯 Redirigiendo al dashboard...")
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error("❌ Error en el proceso de checkout:")
      console.error("   - Mensaje:", error.message)
      console.error("   - Stack:", error.stack)
      setError(error.message || "Error al procesar la compra. Por favor inténtalo de nuevo.")
      setCurrentStep('payment')
      // Limpiar el error después de 5 segundos
      setTimeout(() => setError(null), 5000)
    } finally {
      console.log("🏁 Finalizando proceso de checkout")
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <CheckoutSkeleton />
  }

  // Solo mostrar error de página completa para errores críticos (curso no encontrado)
  if (error && !course && !isProcessing) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center py-8">
        <div className="text-center text-destructive">
          <p className="text-xl mb-4">{error}</p>
          <Link href="/cursos">
            <Button variant="outline" className="text-foreground border-border hover:bg-muted hover:text-white">
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-xl mb-4">Curso no encontrado</p>
          <Link href="/cursos">
            <Button variant="outline" className="text-foreground border-border hover:bg-muted">
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/cursos/${params.courseId}`}>
            <Button variant="ghost" className="text-foreground hover:text-foreground/80 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al curso
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground">Completa tu información para adquirir el curso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                  {currentStep === 'auth' ? (
                    <>
                      <User className="w-5 h-5" />
                      Crear Cuenta
                    </>
                  ) : currentStep === 'payment' ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Información de Pago
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Procesando Pago
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 'auth' && (
                  <form onSubmit={handleUserCreation} className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-destructive">{error}</span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Input
                        id="nombre"
                        type="text"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="apellido"
                        type="text"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Correo Electrónico"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                          Creando cuenta...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Crear Cuenta y Continuar
                        </div>
                      )}
                    </Button>
                  </form>
                )}

                {currentStep === 'payment' && (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-destructive">{error}</span>
                        </div>
                      </div>
                    )}
                    {/* Información del usuario */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-foreground">Información del Usuario</h3>
                        <p className="text-sm text-muted-foreground">Datos de tu cuenta</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Usuario:</span>
                          <span className="text-sm font-medium text-foreground">{user?.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-medium text-foreground">{user?.email}</span>
                        </div>
                      </div>
                    </div>

                    {newAccountCreated && (
                      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-secondary" />
                          <span className="text-secondary font-semibold">Cuenta creada exitosamente</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tu cuenta ha sido creada con el email: {formData.email}
                        </p>
                      </div>
                    )}

                    {/* Métodos de Pago */}
                    {(!(course?.price === 0 || !course?.price)) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Método de Pago</h3>
                      
                      {/* Mercado Pago */}
                      <div className="border border-border rounded-lg p-4">
                        <div 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedPaymentMethod(selectedPaymentMethod === 'mercadopago' ? null : 'mercadopago')}
                        >
                          {selectedPaymentMethod === 'mercadopago' ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium text-foreground">Mercado Pago</span>
                        </div>
                        
                        {selectedPaymentMethod === 'mercadopago' && (
                          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                <span className="text-primary font-semibold">Pago con Mercado Pago</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Al continuar, serás redirigido a Mercado Pago para completar el pago de forma segura.
                              </p>
                            </div>
                            
                            <Button
                              type="button"
                              onClick={handleMercadoPagoSubmit}
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                  Redirigiendo a Mercado Pago...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  Ir a Mercado Pago
                                </div>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Depósito Directo */}
                      <div className="border border-border rounded-lg p-4">
                        <div 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedPaymentMethod(selectedPaymentMethod === 'deposito' ? null : 'deposito')}
                        >
                          {selectedPaymentMethod === 'deposito' ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium text-foreground">Depósito Directo</span>
                        </div>
                        
                        {selectedPaymentMethod === 'deposito' && (
                          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                              <h4 className="font-semibold text-foreground mb-2">Información Bancaria</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Banco:</span>
                                  <span className="font-medium text-foreground">Banco de Crédito del Perú</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tipo de cuenta:</span>
                                  <span className="font-medium text-foreground">Corriente</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Número de cuenta:</span>
                                  <span className="font-medium text-foreground">193-12345678-0-12</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">CCI:</span>
                                  <span className="font-medium text-foreground">002-193-000123456789-12</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Titular:</span>
                                  <span className="font-medium text-foreground">MAINTECH SAC</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Input
                                id="voucher"
                                type="file"
                                accept="image/*,.pdf"
                                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                                placeholder="Subir comprobante de pago"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Input
                                id="reference"
                                placeholder="Número de referencia o voucher"
                                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                      disabled={isProcessing || (!(!course?.price || course.price <= 0) && !selectedPaymentMethod)}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin"></div>
                          {(!course?.price || course.price <= 0) ? 'Matriculando...' : 'Procesando pago...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {(!course?.price || course.price <= 0)
                            ? 'Matricular gratis'
                            : selectedPaymentMethod === 'mercadopago' ? 'Pagar con Mercado Pago' 
                            : selectedPaymentMethod === 'deposito' ? 'Confirmar Depósito' 
                            : 'Seleccionar método de pago'}
                        </div>
                      )}
                    </Button>
                  </form>
                )}

                {currentStep === 'processing' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Procesando tu pago</h3>
                    <p className="text-muted-foreground">Por favor espera mientras procesamos tu compra...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumen del curso */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Resumen del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(course.image.url) || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.category?.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{course.chapters?.length || 0} capítulos</span>
                      <span>{course.modality}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Precio del curso:</span>
                    {(!course.price || course.price <= 0) ? (
                      <span className="text-2xl font-bold text-green-600">Gratis</span>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {formatPrice(course.price, course.priceUSD)}
                        </div>
                        {currency === 'USD' && (
                          <div className="text-sm text-muted-foreground">
                            Pago en soles: S/ {course.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {course.price && course.price > 0 && (
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">IGV (18%):</span>
                      <span className="text-foreground">{`S/ ${(course.price * 0.18).toFixed(2)}`}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {(!course.price || course.price <= 0) ? 'S/ 0.00' : `S/ ${(course.price * 1.18).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Beneficios */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-card-foreground font-semibold mb-3">Lo que incluye:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Certificado de finalización
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Soporte técnico
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Acceso desde cualquier dispositivo
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 bg-muted mb-4" />
          <Skeleton className="h-8 w-64 bg-muted mb-2" />
          <Skeleton className="h-4 w-96 bg-muted" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="bg-card border border-border">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-muted" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-10 w-full bg-muted" />
                ))}
                <Skeleton className="h-12 w-full bg-muted" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-card border border-border">
              <CardHeader>
                <Skeleton className="h-6 w-40 bg-muted" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-20 h-20 bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                    <Skeleton className="h-4 w-1/3 bg-muted" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 