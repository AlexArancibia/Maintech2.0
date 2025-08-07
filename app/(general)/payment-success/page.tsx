"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useApiData } from "@/hooks/ApiContext"

type PaymentStatus = 'loading' | 'approved' | 'pending' | 'rejected' | 'error'

// Component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshPurchasedCourses } = useApiData()
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const handlePaymentVerification = async () => {
      try {
        // Obtener parámetros de la URL
        const status = searchParams.get('status')
        const collectionStatus = searchParams.get('collection_status')
        const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')
        const externalReference = searchParams.get('external_reference')
        const preferenceId = searchParams.get('preference_id')

        console.log('Payment success page loaded:', {
          status,
          collectionStatus,
          paymentId,
          externalReference,
          preferenceId
        })

        // Determinar el estado real del pago
        const actualStatus = collectionStatus || status
        
        if (!actualStatus || !paymentId) {
          throw new Error('Faltan parámetros de pago en la URL')
        }

        switch (actualStatus) {
          case 'approved':
            setPaymentStatus('approved')
            try {
              console.log('Actualizando cursos comprados...')
              await refreshPurchasedCourses()
              console.log('Cursos actualizados exitosamente')
              
              // Redirigir después de actualizar los cursos
              setIsRedirecting(true)
              setTimeout(() => {
                router.push('/dashboard')
              }, 3000)
            } catch (refreshError) {
              console.error('Error al actualizar cursos:', refreshError)
              setError('El pago fue exitoso, pero hubo un problema al actualizar tus cursos. Por favor, actualiza la página.')
              setPaymentStatus('error')
            }
            break
            
          case 'pending':
          case 'in_process':
            setPaymentStatus('pending')
            break
            
          case 'rejected':
          case 'cancelled':
            setPaymentStatus('rejected')
            setError('El pago fue rechazado o cancelado')
            break
            
          default:
            throw new Error(`Estado de pago desconocido: ${actualStatus}`)
        }
        
      } catch (error) {
        console.error('Error en verificación de pago:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido al procesar el pago')
        setPaymentStatus('error')
      }
    }

    handlePaymentVerification()
  }, [searchParams, router, refreshPurchasedCourses])

  // Función para reintentar la actualización de cursos
  const retryRefresh = async () => {
    setPaymentStatus('loading')
    setError(null)
    
    try {
      await refreshPurchasedCourses()
      setPaymentStatus('approved')
      setIsRedirecting(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error en reintento:', error)
      setError('No se pudieron actualizar los cursos. Intenta recargar la página.')
      setPaymentStatus('error')
    }
  }

  // Renderizado condicional basado en el estado
  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <CardTitle>Verificando tu pago...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Estamos confirmando tu pago y vinculando el curso a tu cuenta.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">¡Pago Exitoso!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Tu pago ha sido procesado correctamente y el curso ya está disponible en tu cuenta.
            </p>
            {isRedirecting && (
              <p className="text-sm text-muted-foreground mb-4">
                Redirigiendo al dashboard en unos segundos...
              </p>
            )}
            <div className="space-y-2">
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  Ir al Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/cursos" className="block">
                <Button variant="outline" className="w-full">
                  Ver todos los cursos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-yellow-800">Pago Pendiente</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Tu pago está siendo procesado. Te notificaremos cuando esté completado.
            </p>
            <div className="space-y-2">
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  Ir al Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/cursos" className="block">
                <Button variant="outline" className="w-full">
                  Continuar navegando
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estados de error o rechazo
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-800">
            {paymentStatus === 'rejected' ? 'Pago Rechazado' : 'Error en el Pago'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            {error || 'Hubo un problema con tu pago'}
          </p>
          <div className="space-y-2">
            {paymentStatus === 'error' && (
              <Button onClick={retryRefresh} className="w-full">
                Reintentar
              </Button>
            )}
            <Link href="/cursos" className="block">
              <Button variant={paymentStatus === 'error' ? 'outline' : 'default'} className="w-full">
                Volver a Cursos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading fallback component
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <CardTitle>Cargando...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Preparando la página de confirmación de pago.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Main page component with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}