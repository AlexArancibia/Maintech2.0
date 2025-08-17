import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen, Users, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            La página que estás buscando no existe o ha sido movida. 
            No te preocupes, tenemos muchas opciones para explorar.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
            <Link href="/cursos" className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Ver Cursos
            </Link>
          </Button>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <Link 
            href="/cursos" 
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Explorar Cursos</h3>
            <p className="text-sm text-gray-600">Descubre nuestra amplia gama de cursos técnicos</p>
          </Link>

          <Link 
            href="/quienes-somos" 
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Conócenos</h3>
            <p className="text-sm text-gray-600">Aprende más sobre Maintech y nuestro equipo</p>
          </Link>

          <Link 
            href="/escribenos" 
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Contacto</h3>
            <p className="text-sm text-gray-600">¿Necesitas ayuda? Escríbenos</p>
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">¿Buscas algo específico?</span>
          </div>
          <p className="text-sm text-gray-500">
            Intenta usar nuestro buscador o navega por las categorías principales
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-blue-100 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/3 right-5 w-12 h-12 bg-indigo-100 rounded-full opacity-30 animate-bounce delay-500"></div>
    </div>
  );
}
