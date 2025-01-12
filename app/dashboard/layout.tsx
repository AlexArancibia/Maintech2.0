import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Button } from "@/components/ui/button";
import { ApiProvider } from "@/hooks/ApiContext";
import Footer from "@/components/Footer";
 
import { ProtectedRoute } from "./_components/AuthMiddelware";
 
 

const Dashboard = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    
    <>

         <ProtectedRoute>
           {children}
         </ProtectedRoute>
 
    </>
  );
}
export default Dashboard