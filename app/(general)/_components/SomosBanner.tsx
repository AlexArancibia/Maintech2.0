import { Button } from "@/components/ui/button";
import Link from "next/link";

function SomosBanner() {
  return (
    <div
      className="container-section bg-cover bg-center bg-no-repeat sm:bg-[url('/somos1.png')] bg-[url('/somos-mobile.png')]"
    >
      <div className="content-section flex flex-col gap-8 md:gap-10   justify-center min-h-[350px] md:min-h-[500px] text-white">
        <div className="font-orbitron text-4xl md:text-6xl lg:text-7xl ">
          Somos
          <br />
          <span className="font-bold">Maintech</span>
        </div>
         
        <Button className="w-fit text-base sm:text-lg md:text-xl rounded-full px-6 py-2 sm:py-3 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-all duration-300">
        <Link href={`/cursos`}>
                  Ver Cursos
                </Link>
        </Button>
      </div>
    </div>
  );
}

export default SomosBanner;
