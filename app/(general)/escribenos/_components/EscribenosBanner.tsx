import { Button } from "@/components/ui/button";
import Link from "next/link";

function EscribenosBanner() {
  return (
    <div
      className="container-section bg-cover bg-left bg-no-repeat sm:bg-[url('/escribenos.png')] bg-[url('/escribenos-mobile.png')]"
    >
      <div className="content-section flex flex-col gap-8 md:gap-10   justify-center min-h-[350px] md:min-h-[350px] text-white">
        <div className="font-orbitron text-4xl md:text-6xl lg:text-7xl ">
 
          <span className="font-bold">Escribenos</span>
        </div>
 
      </div>
    </div>
  );
}

export default EscribenosBanner;
