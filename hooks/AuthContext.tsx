"use client"
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCoursesByStudent } from "./coursesAPI";
import { BasicCourse } from "@/types/CoursesType";
import { User } from "@/types/StudentType";

interface AuthContextType {
  user: User | null;
  token: string | null;
  purchasedCourses: BasicCourse[];
  login: (response: AuthResponse) => void;
  logout: () => void;
  authReady: boolean;
  isLoading: boolean;
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
  isLoading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<BasicCourse[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
    
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
    <AuthContext.Provider value={{ user, token, purchasedCourses, login, logout, authReady ,isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
