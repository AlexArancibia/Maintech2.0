import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ApiProvider } from "@/hooks/ApiContext";
import { AuthContextProvider } from "@/hooks/AuthContext";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/NavBar";
 
 
export const metadata: Metadata = {
  title: "Maintech",
  description: "El futuro del mantenimiento tecnologico",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      
      
      <body
        className={` antialiased`}
      >
        <AuthContextProvider>
          <ApiProvider>
            <Navbar />
            
            {children}

            <Footer />
          </ApiProvider>
        </AuthContextProvider>
 
      </body>
    </html>
  );
}
