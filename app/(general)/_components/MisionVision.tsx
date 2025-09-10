
'use client'
import { motion } from "motion/react"

interface MisionVisionProps {
  misionCard?: any;
  visionCard?: any;
  descriptionCard?: any;
}

function getDescription(card: any) {
  if (!card?.description?.length) return "";
  const paragraph = card.description.find((d: any) => d.type === "paragraph");
  if (!paragraph || !paragraph.children) return "";
  const textChild = paragraph.children.find((c: any) => c.type === "text" && c.text);
  return textChild?.text || "";
}

export default function MisionVision({ misionCard, visionCard, descriptionCard }: MisionVisionProps) {
  return (
    <section className="relative bg-gray-100 py-8 sm:py-16  z-1 container-section">
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
            {getDescription(descriptionCard)}
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
              {getDescription(misionCard)}
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
              {getDescription(visionCard)}
            </p>
          </div>
        </div>

      {/* Banner Images Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[url('/somos3.png')] bg-cover h-[400px] sm:h-[600px]">
        </div>
        <div className="bg-[url('/somos2.png')] bg-cover h-[400px] sm:h-[600px] relative group bg-center">
          <motion.div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              {/* Outer pulsing circle */}
              <motion.div
                className="absolute -inset-4 bg-red-500 rounded-full opacity-25"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.25, 0.15, 0.25],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Play button background */}
              <motion.div
                className="relative z-10 bg-accent rounded-full p-6 text-white shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                {/* Play icon */}
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-12 h-12 fill-current"
                  style={{ marginLeft: "4px" }}
                >
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  )
}

