import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluciones - Maintech",
  description: "Descubre las soluciones integrales de Maintech para la formación en mantenimiento tecnológico. Programas personalizados, certificaciones y consultoría especializada.",
  keywords: [
    "soluciones maintech",
    "formación personalizada",
    "certificaciones técnicas",
    "consultoría mantenimiento",
    "programas corporativos",
    "soluciones educativas",
    "mantenimiento tecnológico",
    "formación industrial",
    "capacitación técnica",
    "soluciones empresariales"
  ],
  openGraph: {
    title: "Soluciones - Maintech | Formación en Mantenimiento Tecnológico",
    description: "Descubre las soluciones integrales de Maintech para la formación en mantenimiento tecnológico. Programas personalizados y certificaciones.",
    url: "https://maintech.com/solutions",
    images: [
      {
        url: "/feature1.png",
        width: 1200,
        height: 630,
        alt: "Soluciones - Maintech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soluciones - Maintech | Formación en Mantenimiento Tecnológico",
    description: "Descubre las soluciones integrales de Maintech para la formación en mantenimiento tecnológico. Programas personalizados y certificaciones.",
    images: ["/feature1.png"],
  },
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
