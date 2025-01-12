import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Button } from "@/components/ui/button";
import { ApiProvider } from "@/hooks/ApiContext";
import Footer from "@/components/Footer";
 

 

const Dashboard = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    
    <>
          {children}
    </>
  );
}
export default Dashboard