 
export default function MisionVision() {
 
  return (
    <section className="relative bg-gray-100 py-16 z-1 container-section">
      {/* Gradient Decoration */}
      <div className="absolute left-0 top-10 h-32 hidden xl:block md:h-64 w-32 sm:w-48 md:w-64  z-0">
        <img 
          src="/iconotipo.png" 
          alt="Iconotipo MainTech" 
          className="w-full h-full object-contain  "
        />      
      </div>

      <div className="content-section   ">
        <div className="lg:bg-[url('/pop.png')]  bg-contain bg-no-repeat lg:w-[1000px] flex text-center pt-12  mx-auto p-4 h-[220px]">
      <p className="text-gray-700 text-lg z-10">
          IDEAS CAMPUS SAC es una empresa dedicada a la capacitación y consultoría superior de primer nivel.
          Nos especializamos en temas de gestión, calidad, mantenimiento, estrategia, gerencia y finanzas.
          Trabajamos bajo una política basada en excelencia, integridad y cumplimiento, logrando el nivel de
          competitividad requerida por el mercado.
        </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 py-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="flex">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary">
                  <polygon points="8,4 18,12 8,20" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary -ml-3">
                  <polygon points="8,4 18,12 8,20" />
                </svg>
              </span>
              Misión
            </h2>
            <p className="text-gray-600 px-11">
              Consolidarnos como una institución líder en capacitación profesional y consultoría empresarial a
              nivel nacional. Ser un referente de calidad y profesionalismo para el mercado.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="flex">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary">
                  <polygon points="8,4 18,12 8,20" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary -ml-3">
                  <polygon points="8,4 18,12 8,20" />
                </svg>
              </span>
              Visión
            </h2>
            <p className="text-gray-600 px-11">
              Generar conocimiento e innovación constante, por medio de metodologías sólidas, pensamiento crítico,
              disciplina y principios éticos en nuestros estudiantes. Propiciamos el desarrollo de conocimientos.
            </p>
          </div>
        </div>


        
      {/* Banner Images Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[url('/somos3.png')] bg-cover h-[600px] ">
        </div>
        <div className="bg-[url('/somos2.png')] bg-cover h-[600px]">
        <div className="flex items-center justify-center">
            <div className="rounded-full bg-red-500 p-6">
              <div className="w-16 h-16 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      </div>
    </section>
  )
}

