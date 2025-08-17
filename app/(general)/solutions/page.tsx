'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowDown, 
  Plus, 
  Users, 
  Building2, 
  TrendingUp, 
  FileText, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  Target,
  Globe,
  Award,
  Clock,
  BarChart3,
  Cpu,
  Database,
  Settings,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Rocket
} from 'lucide-react'
import { useCurrency } from '@/hooks/CurrencyContext'
import Image from 'next/image'

export default function SolutionsPage() {
  const { formatPrice } = useCurrency()
  const [activeSolution, setActiveSolution] = useState(0)

  const solutions = [
    {
      id: 1,
      title: "Confiabilidad & Gestión Integral de Activos",
      description: "Implementamos estrategias avanzadas de mantenimiento predictivo y gestión de activos para maximizar la eficiencia operativa y reducir costos de mantenimiento en un 30-40%.",
      features: [
        "Análisis de vibraciones avanzado",
        "Monitoreo de condición en tiempo real",
        "Gestión del ciclo de vida de activos",
        "Optimización de programas de mantenimiento"
      ],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Monitoreo de Condición CBM",
      description: "Sistemas inteligentes de monitoreo continuo que detectan anomalías antes de que se conviertan en fallas críticas.",
      features: [
        "Sensores IoT de última generación",
        "Machine Learning para detección de patrones",
        "Alertas predictivas inteligentes",
        "Dashboard en tiempo real"
      ],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      icon: Cpu,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "Tecnología 4.0 & IoT",
      description: "Integración de tecnologías de la cuarta revolución industrial para crear sistemas inteligentes y conectados.",
      features: [
        "Conectividad 5G y edge computing",
        "Digital twins para simulación",
        "Analytics predictivos avanzados",
        "Integración con sistemas ERP"
      ],
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      icon: Zap,
      color: "from-purple-500 to-pink-500"
    }
  ]

  const statistics = [
    {
      number: "+40",
      label: "Empresas del sector industrial en LATAM",
      description: "Experiencia comprobada en múltiples industrias",
      icon: Building2,
      color: "bg-blue-500"
    },
    {
      number: "+500",
      label: "Proyectos exitosos en LATAM",
      description: "Implementaciones que han transformado operaciones",
      icon: Target,
      color: "bg-green-500"
    },
    {
      number: "+1,000",
      label: "MW analizados en centrales",
      description: "Especialistas en turbomaquinaria y generación",
      icon: Zap,
      color: "bg-yellow-500"
    },
    {
      number: "24/7",
      label: "Monitoreo continuo",
      description: "Soporte técnico y supervisión permanente",
      icon: Clock,
      color: "bg-red-500"
    }
  ]

  const testimonials = [
    {
      name: "Carlos Mendoza",
      position: "Director de Mantenimiento",
      company: "Industrias del Norte S.A.",
      content: "MainTech transformó completamente nuestro programa de mantenimiento. Redujimos los tiempos de parada en un 45% y aumentamos la confiabilidad de nuestros equipos críticos.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Ana Rodríguez",
      position: "Ingeniera de Confiabilidad",
      company: "Energía del Sur",
      content: "La implementación del sistema CBM de MainTech nos permitió detectar fallas potenciales semanas antes de que ocurrieran, ahorrando millones en costos de reparación.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Roberto Silva",
      position: "Gerente de Operaciones",
      company: "Minería del Pacífico",
      content: "La plataforma de gestión de activos de MainTech nos dio visibilidad completa sobre el estado de nuestros equipos, optimizando nuestros recursos de mantenimiento.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-secondary/90 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop"
            alt="Industria del futuro"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-4 sm:px-6 max-w-4xl lg:max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-sm sm:text-base">
            🚀 Tecnología de Vanguardia
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Soluciones Inteligentes para el
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mt-2">
              Mantenimiento del Futuro
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Transformamos la industria con tecnologías de monitoreo predictivo, gestión inteligente de activos 
            y soluciones IoT que maximizan la eficiencia operativa y reducen costos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 transition-all duration-200 hover:scale-105 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Explorar Soluciones
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 transition-all duration-200 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Solicitar Demo
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-8 h-8 text-white/80" />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
              Nuestro Impacto en Números
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4">
              Más de una década transformando la industria con soluciones tecnológicas innovadoras
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {statistics.map((stat, index) => (
                              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 leading-tight">{stat.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{stat.description}</p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 border-accent text-accent text-sm sm:text-base">
              🎯 Nuestras Soluciones
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
              Tecnologías que Transforman la Industria
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed">
              Soluciones integrales que combinan IoT, Machine Learning y analítica avanzada para 
              optimizar el mantenimiento y maximizar la confiabilidad de sus activos.
            </p>
          </div>

          {/* Featured Solutions */}
          <div className="space-y-12 sm:space-y-16">
            {solutions.map((solution, index) => (
              <div key={solution.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={`space-y-4 sm:space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${solution.color} rounded-lg flex items-center justify-center`}>
                      <solution.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
                      Solución {solution.id}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {solution.title}
                  </h3>
                  
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {solution.description}
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button 
                      size="lg" 
                      className="bg-accent text-white hover:bg-accent/90 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                    >
                      Solicitar Información
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200 text-sm sm:text-base"
                    >
                      Ver Caso de Estudio
                    </Button>
                  </div>
                </div>
                
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Solutions Grid */}
          <div className="mt-16 sm:mt-20">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
              Todas Nuestras Soluciones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                "Analítica de Datos Aplicada a la Gestión de Activos",
                "Tribología & Gestión de la Lubricación",
                "Purificación de Aceites Lubricantes",
                "Tecnología para Purificación de Aceites",
                "Planes de Formación Especializada",
                "Consultoría en Mantenimiento Predictivo",
                "Implementación de Sistemas CMMS",
                "Auditorías de Confiabilidad",
                "Optimización de Programas de Mantenimiento"
              ].map((solution, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 group-hover:text-accent transition-colors duration-200 leading-tight text-sm sm:text-base">
                        {solution}
                      </h4>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-accent transition-colors duration-200" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 border-green-500 text-green-600 text-sm sm:text-base">
              💬 Testimonios
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4">
              Empresas líderes confían en MainTech para transformar sus operaciones de mantenimiento
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
                              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{testimonial.position}</p>
                        <p className="text-xs sm:text-sm text-accent font-medium">{testimonial.company}</p>
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 leading-relaxed italic text-sm sm:text-base">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center mt-4 sm:mt-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-blue-500 text-blue-600">
                📚 Blog MainTech
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900">
                Conocimiento que Transforma la Industria
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mantente actualizado con los últimos avances en mantenimiento predictivo, 
                casos de estudio, eventos técnicos y artículos escritos por nuestros expertos.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Artículos técnicos semanales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Webinars mensuales gratuitos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Casos de estudio detallados</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200"
              >
                Explorar Blog
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Equipo colaborando"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold mb-2">Último Webinar</h4>
                  <p className="text-white/90">"Mantenimiento 4.0: El Futuro es Ahora"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=1080&fit=crop"
            alt="Equipo trabajando"
            fill
            className="object-cover opacity-10"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <Badge variant="outline" className="border-green-500 text-green-600 text-sm sm:text-base">
                🚀 Únete al Equipo
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Construyendo el Futuro del Mantenimiento
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Queremos seguir haciendo crecer nuestro principal activo: las personas. 
                Buscamos talentos apasionados por la tecnología y la innovación industrial.
              </p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">+25</div>
                  <div className="text-xs sm:text-sm text-gray-600">Profesionales</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Años de Experiencia</div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl text-gray-900">Aplicar Ahora</CardTitle>
                <p className="text-sm sm:text-base text-gray-600">Únete a nuestro equipo de innovadores</p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="nombre" className="text-sm sm:text-base">Nombre</Label>
                    <Input id="nombre" placeholder="Tu nombre" className="text-sm sm:text-base" />
                  </div>
                  <div>
                    <Label htmlFor="apellido" className="text-sm sm:text-base">Apellido</Label>
                    <Input id="apellido" placeholder="Tu apellido" className="text-sm sm:text-base" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" className="text-sm sm:text-base" />
                </div>
                
                <div>
                  <Label htmlFor="linkedin" className="text-sm sm:text-base">LinkedIn</Label>
                  <Input id="linkedin" placeholder="URL de tu perfil" className="text-sm sm:text-base" />
                </div>
                
                <div>
                  <Label htmlFor="resume" className="text-sm sm:text-base">CV/Resume</Label>
                  <Input id="resume" type="file" className="text-sm sm:text-base" />
                </div>
                
                <div>
                  <Label htmlFor="cargo" className="text-sm sm:text-base">Cargo de interés</Label>
                  <Select>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Selecciona un cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingeniero-cbm">Ingeniero CBM</SelectItem>
                      <SelectItem value="analista-datos">Analista de Datos</SelectItem>
                      <SelectItem value="especialista-tribologia">Especialista en Tribología</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="desarrollador">Desarrollador Full-Stack</SelectItem>
                      <SelectItem value="arquitecto">Arquitecto de Soluciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-accent text-white hover:bg-accent/90 transition-all duration-200 hover:scale-105 text-sm sm:text-base">
                  Enviar Aplicación
                  <Rocket className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"
            alt="Oficina moderna"
            fill
            className="object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <Badge variant="outline" className="border-accent text-accent mb-3 sm:mb-4 text-sm sm:text-base">
                  📞 Contacto
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Hablemos de tu Proyecto</h2>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  Estamos aquí para ayudarte a transformar tu operación de mantenimiento 
                  con las últimas tecnologías y mejores prácticas de la industria.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <MapPin className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-semibold">Oficina Principal</div>
                    <div className="text-gray-300">Lima, Perú - Centro Empresarial</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Phone className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-semibold">Teléfono</div>
                    <div className="text-gray-300">+51 1 123 4567</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Phone className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-gray-300">+51 999 123 456</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Mail className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-300">info@maintech.com</div>
                  </div>
                </div>
              </div>
            </div>
            
                         {/* Newsletter & Quick Contact */}
             <div className="space-y-6 sm:space-y-8">
               <div className="bg-white/10 p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                 <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">¿Quieres saber más sobre nosotros?</h3>
                 <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                   Suscríbete a nuestro newsletter y recibe las últimas novedades en mantenimiento predictivo.
                 </p>
                 <div className="space-y-3 sm:space-y-4">
                   <Input 
                     type="email" 
                     placeholder="Tu email" 
                     className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
                   />
                   <Button className="w-full bg-accent text-white hover:bg-accent/90 transition-all duration-200 text-sm sm:text-base">
                     Suscribirse
                     <Mail className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
               </div>
               
               {/* Quick Contact Form */}
               <div className="bg-white/10 p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                 <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Consulta Rápida</h3>
                 <div className="space-y-3 sm:space-y-4">
                   <Input 
                     placeholder="Tu nombre" 
                     className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
                   />
                   <Input 
                     type="email" 
                     placeholder="Tu email" 
                     className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
                   />
                   <Input 
                     placeholder="Empresa" 
                     className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
                   />
                   <Button className="w-full bg-accent text-white hover:bg-accent/90 transition-all duration-200 text-sm sm:text-base">
                     Enviar Consulta
                     <ChevronRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
               </div>
              
                             {/* Diversity Statement */}
               <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center">
                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                   <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                 </div>
                 <h4 className="text-base sm:text-lg font-semibold mb-2">Inclusión y Diversidad</h4>
                 <p className="text-xs sm:text-sm text-gray-300">
                   En MainTech somos inclusión, igualdad y diversidad. 
                   Creemos en el poder de diferentes perspectivas para innovar.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

// Componente Star para las calificaciones
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
