import type { Metadata } from "next";
import "./globals.css";
import { ApiProvider } from "@/hooks/ApiContext";
import { AuthContextProvider } from "@/hooks/AuthContext";
import { CurrencyProvider } from "@/hooks/CurrencyContext";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/NavBar";

import Analytics from "./analytics";

export const metadata: Metadata = {
  title: {
    default: "Maintech - El Futuro del Mantenimiento Tecnológico",
    template: "%s | Maintech"
  },
  description: "Maintech es la plataforma líder en formación de mantenimiento tecnológico. Cursos especializados, certificaciones profesionales y la mejor educación técnica del sector.",
  keywords: [
    "mantenimiento tecnológico",
    "cursos técnicos",
    "formación profesional",
    "certificaciones técnicas",
    "tecnología industrial",
    "mantenimiento preventivo",
    "automatización industrial",
    "ingeniería de mantenimiento"
  ],
  authors: [{ name: "Maintech" }],
  creator: "Maintech",
  publisher: "Maintech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://maintech.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://maintech.com',
    siteName: 'Maintech',
    title: 'Maintech - El Futuro del Mantenimiento Tecnológico',
    description: 'Plataforma líder en formación de mantenimiento tecnológico. Cursos especializados y certificaciones profesionales.',
    images: [
      {
        url: '/iconotipo.png',
        width: 1200,
        height: 630,
        alt: 'Maintech - Mantenimiento Tecnológico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maintech - El Futuro del Mantenimiento Tecnológico',
    description: 'Plataforma líder en formación de mantenimiento tecnológico. Cursos especializados y certificaciones profesionales.',
    images: ['/iconotipo.png'],
    creator: '@maintech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      {
        url: "/iconotipo.png",
        sizes: "32x32 192x192",
        type: "image/png",
      },
    ],
    apple: {
      url: "/iconotipo.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <AuthContextProvider>
          <ApiProvider>
            <CurrencyProvider>
  
              <Navbar />
              
              {children}

              <Footer />
            </CurrencyProvider>
          </ApiProvider>
        </AuthContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
