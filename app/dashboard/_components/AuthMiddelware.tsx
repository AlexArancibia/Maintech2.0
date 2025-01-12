"use client"
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, token, authReady } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (authReady && (!user || !token)) {
      router.push("/");
    }
  }, [user, token, authReady, router]);

  if (!authReady) {
    return <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
  </div>;
  }

  return <>{user && token ? children : null}</>;
};