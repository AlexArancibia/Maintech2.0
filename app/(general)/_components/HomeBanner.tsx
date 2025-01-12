import { Button } from "@/components/ui/button";
import Link from "next/link";

function HomeBanner() {
  return (
    <div
      className="container-section bg-cover bg-center bg-no-repeat sm:bg-[url('/home1.png')] bg-[url('/home-mobile.png')]"
    >
      <div className="content-section flex flex-col gap-8 md:gap-10 pt-8 lg:justify-center min-h-[600px] md:min-h-[700px] text-white">
        <div className="font-orbitron text-4xl md:text-6xl lg:text-7xl">
          Prepárate
          <br />
          <span className="font-bold">para triunfar</span>
        </div>
        <div className="w-fit bg-accent py-2 px-4 sm:px-6 text-lg sm:text-xl md:text-xl rounded-full hidden lg:block">
          Aprende con los mejores
        </div>
        <span className="text-base sm:text-lg md:text-xl font-light max-w-lg lg:max-w-lg xl:max-w-xl    ">
          Contamos con más de 6 años de experiencia en el mercado.
          <br />
          Maintech es una escuela digital especializada con más de 49 programas
          especializados.
        </span>
        <Button className="w-fit text-base sm:text-lg md:text-xl rounded-full px-6 py-2 sm:py-3 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-all duration-300">
        <Link href={`/cursos`}>
                  Ver Cursos
                </Link>
        </Button>
      </div>
    </div>
  );
}

export default HomeBanner;
