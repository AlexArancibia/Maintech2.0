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
    return <p>Loading...</p>;
  }

  return <>{user && token ? children : null}</>;
};