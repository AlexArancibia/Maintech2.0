import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quienes Somos - Maintech",
  description: "Conoce Maintech, la empresa líder en formación de mantenimiento tecnológico. Descubre nuestra misión, visión y el equipo de expertos que hace posible la excelencia educativa.",
  keywords: [
    "quienes somos maintech",
    "empresa de formación técnica",
    "misión y visión maintech",
    "equipo de expertos técnicos",
    "historia de maintech",
    "formación en mantenimiento tecnológico",
    "educación técnica profesional",
    "empresa de cursos técnicos",
    "formación industrial",
    "mantenimiento tecnológico"
  ],
  openGraph: {
    title: "Quienes Somos - Maintech | Formación en Mantenimiento Tecnológico",
    description: "Conoce Maintech, la empresa líder en formación de mantenimiento tecnológico. Descubre nuestra misión, visión y el equipo de expertos.",
    url: "https://maintech.com/quienes-somos",
    images: [
      {
        url: "/somos1.png",
        width: 1200,
        height: 630,
        alt: "Quienes Somos - Maintech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quienes Somos - Maintech | Formación en Mantenimiento Tecnológico",
    description: "Conoce Maintech, la empresa líder en formación de mantenimiento tecnológico. Descubre nuestra misión, visión y el equipo de expertos.",
    images: ["/somos1.png"],
  },
  alternates: {
    canonical: "/quienes-somos",
  },
};

export default function QuienesSomosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
