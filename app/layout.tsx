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
