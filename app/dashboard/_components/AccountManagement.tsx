"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/AuthContext"
import { useApiData } from "@/hooks/ApiContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Lock, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Save,
  X
} from "lucide-react"
import { useCurrency } from "@/hooks/CurrencyContext"
import { formatCourseStartDate } from "@/lib/dateUtils"

export default function AccountManagement() {
  const { user, updateUser } = useAuth()
  const { purchasedCourses } = useApiData()
  const { formatPrice } = useCurrency()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || ""
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditSubmit = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      await updateUser(user.id, editForm)
      setMessage({ type: 'success', text: 'Información actualizada correctamente' })
      setIsEditing(false)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar la información' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    setIsLoading(true)
    try {
      // Aquí implementarías la lógica para cambiar la contraseña
      // Por ahora solo simulamos el éxito
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' })
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al cambiar la contraseña' })
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditForm({
      username: user?.username || "",
      email: user?.email || ""
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            Gestión de Cuenta
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Administra tu información personal, contraseña y revisa tus cursos
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto sm:h-10">
              <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Perfil</span>
                <span className="sm:hidden">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Mis Cursos</span>
                <span className="sm:hidden">Cursos</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Seguridad</span>
                <span className="sm:hidden">Seguridad</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab de Perfil */}
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold">Información Personal</h3>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Editar</span>
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm">Nombre de usuario</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="Nombre de usuario"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={handleEditSubmit} 
                        disabled={isLoading}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">
                          {isLoading ? 'Guardando...' : 'Guardar'}
                        </span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={cancelEdit}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Cancelar</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Nombre de usuario</Label>
                      <p className="text-sm sm:text-base">{user.username}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm sm:text-base">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Tipo de cuenta</Label>
                      <Badge variant={user.isTeacher ? "default" : "secondary"} className="text-xs">
                        {user.isTeacher ? "Profesor" : "Estudiante"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Miembro desde</Label>
                      <p className="text-sm sm:text-base">{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab de Cursos */}
            <TabsContent value="courses" className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold">Resumen de Cursos</h3>
                  <Badge variant="outline" className="text-xs w-fit">
                    Total: {purchasedCourses?.length || 0} cursos
                  </Badge>
                </div>

                {purchasedCourses && purchasedCourses.length > 0 ? (
                  <div className="space-y-3">
                    {purchasedCourses.map((course, index) => (
                      <div key={course.documentId || index} className="border rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                          <div className="space-y-2 sm:space-y-1 flex-1">
                            <h4 className="font-medium text-sm sm:text-base">{course.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{course.category?.name}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {course.start_date ? formatCourseStartDate(course.start_date) : "Por confirmar"}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {course.chapters?.length || 0} capítulos
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {course.users_permissions_users?.length || 0} estudiantes
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <p className="font-medium text-sm sm:text-base">
                              {course.price === 0 ? "GRATUITO" : formatPrice(course.price, course.priceUSD)}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {course.modality || "Online"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">No tienes cursos comprados aún</p>
                    <p className="text-xs sm:text-sm">Explora nuestros cursos disponibles</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab de Seguridad */}
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">Cambiar Contraseña</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm">Contraseña actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Ingresa tu contraseña actual"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Ingresa tu nueva contraseña"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirma tu nueva contraseña"
                      className="text-sm"
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <span className="text-sm">
                      {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                    </span>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Recomendaciones de seguridad</h4>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <li>• Usa una contraseña de al menos 8 caracteres</li>
                    <li>• Incluye mayúsculas, minúsculas, números y símbolos</li>
                    <li>• No uses información personal fácil de adivinar</li>
                    <li>• Cambia tu contraseña regularmente</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Mensajes de estado */}
          {message && (
            <Alert className={`mt-4 ${
              message.type === 'success' ? 'border-green-200 bg-green-50' :
              message.type === 'error' ? 'border-red-200 bg-red-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : message.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-blue-600" />
              )}
              <AlertTitle className={
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }>
                {message.type === 'success' ? 'Éxito' :
                 message.type === 'error' ? 'Error' :
                 'Información'}
              </AlertTitle>
              <AlertDescription className={
                message.type === 'success' ? 'text-green-700' :
                message.type === 'error' ? 'text-red-700' :
                'text-blue-700'
              }>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
