import React from 'react';

export default function CertificationSection() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-blue-900 w-full h-96 p-16 shadow-lg flex justify-center">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-screen-2xl w-full">
        
        <div className="flex-1 md:pr-10 text-center md:text-left">
          <h2 className="text-4xl text-white font-bold flex items-center justify-center md:justify-start">
            <span className="mr-3 text-blue-400">🎓</span> Certificación al Completar
          </h2>
          <p className="text-gray-300 mt-6 text-lg max-w-lg">
            Completa el curso y obtén un certificado que avala tus conocimientos. Este certificado es otorgado en nombre de la institución y refleja tu dedicación y aprendizaje.
          </p>
          <a
            href="https://wa.me/1234567890" // Reemplaza con el número de WhatsApp
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-4 text-lg font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition duration-300"
          >
            Más información
          </a>
        </div>

        <div className="flex-shrink-0 mt-8 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2116&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Certificado de ejemplo"
            className="w-96 h-auto rounded shadow-md"
          />
        </div>

      </div>
    </div>
  );
}
