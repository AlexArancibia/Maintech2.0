"use client"
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCoursesByStudent } from "./coursesAPI";
import { BasicCourse } from "@/types/CoursesType";

interface AuthContextType {
  user: User | null;
  token: string | null;
  purchasedCourses: BasicCourse[];
  login: (response: AuthResponse) => void;
  logout: () => void;
  authReady: boolean;
}

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null, 
  login: () => {},
  purchasedCourses : [],
  logout: () => {},
  authReady: false,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<BasicCourse[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const router = useRouter();

  const login = (response: AuthResponse) => {
    setUser(response.user);
    setToken(response.jwt);

    // Almacena en localStorage
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // Limpia localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirige al login
    router.push("/");
  };


  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setAuthReady(true);
    
  }, [])
  

  useEffect(() => {
    async function fetchCourses() {
      if (user) {
        try {
          // Llama a la función `getCoursesByStudent`
          setPurchasedCourses(await getCoursesByStudent(user.email));
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    }

    fetchCourses();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, purchasedCourses, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
