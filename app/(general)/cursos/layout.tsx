import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos de Mantenimiento Tecnológico",
  description: "Explora nuestra amplia gama de cursos especializados en mantenimiento tecnológico. Desde fundamentos hasta técnicas avanzadas, encuentra la formación que necesitas para tu carrera profesional.",
  keywords: [
    "cursos de mantenimiento tecnológico",
    "formación técnica industrial",
    "cursos online de tecnología",
    "mantenimiento preventivo",
    "automatización industrial",
    "ingeniería de mantenimiento",
    "certificaciones técnicas",
    "educación industrial",
    "cursos técnicos profesionales",
    "mantenimiento de equipos"
  ],
  openGraph: {
    title: "Cursos de Mantenimiento Tecnológico | Maintech",
    description: "Explora nuestra amplia gama de cursos especializados en mantenimiento tecnológico. Formación profesional y certificaciones técnicas.",
    url: "https://maintech.com/cursos",
    images: [
      {
        url: "/curso.png",
        width: 1200,
        height: 630,
        alt: "Cursos de Mantenimiento Tecnológico - Maintech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursos de Mantenimiento Tecnológico | Maintech",
    description: "Explora nuestra amplia gama de cursos especializados en mantenimiento tecnológico. Formación profesional y certificaciones técnicas.",
    images: ["/curso.png"],
  },
  alternates: {
    canonical: "/cursos",
  },
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
