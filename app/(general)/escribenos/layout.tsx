import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contáctanos - Maintech",
  description: "¿Tienes preguntas sobre nuestros cursos? ¿Necesitas información sobre formación en mantenimiento tecnológico? Contáctanos y te responderemos a la brevedad.",
  keywords: [
    "contacto maintech",
    "escribenos maintech",
    "formulario de contacto",
    "información de cursos",
    "soporte técnico",
    "consultas formación",
    "mantenimiento tecnológico",
    "cursos técnicos",
    "atención al cliente",
    "ayuda maintech"
  ],
  openGraph: {
    title: "Contáctanos - Maintech | Formación en Mantenimiento Tecnológico",
    description: "¿Tienes preguntas sobre nuestros cursos? ¿Necesitas información sobre formación en mantenimiento tecnológico? Contáctanos.",
    url: "https://maintech.com/escribenos",
    images: [
      {
        url: "/contact1.png",
        width: 1200,
        height: 630,
        alt: "Contáctanos - Maintech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contáctanos - Maintech | Formación en Mantenimiento Tecnológico",
    description: "¿Tienes preguntas sobre nuestros cursos? ¿Necesitas información sobre formación en mantenimiento tecnológico? Contáctanos.",
    images: ["/contact1.png"],
  },
  alternates: {
    canonical: "/escribenos",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
