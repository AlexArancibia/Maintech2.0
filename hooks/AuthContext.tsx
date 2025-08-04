"use client"
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCoursesByStudent } from "./coursesAPI";
import { BasicCourse } from "@/types/CoursesType";
import { User } from "@/types/StudentType";
import api from "@/lib/axios";

interface AuthContextType {
  user: User | null;
  token: string | null;
  purchasedCourses: BasicCourse[];
  login: (response: AuthResponse) => void;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<AuthResponse>;
  updateUser: (userId: number, userData: UpdateUserData) => Promise<User>;
  authReady: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null, 
  login: () => {},
  purchasedCourses : [],
  logout: () => {},
  createUser: async () => ({ jwt: '', user: {} as User }),
  updateUser: async () => ({} as User),
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

  const createUser = async (userData: CreateUserData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/local/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      } else {
        throw new Error("Error al crear el usuario. Por favor inténtalo de nuevo.");
      }
    }
  };

  const updateUser = async (userId: number, userData: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put(`/api/users/${userId}`, userData);
      const updatedUser = response.data;
      
      // Actualizar el usuario en el contexto si es el usuario actual
      if (user && user.id === userId) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      } else {
        throw new Error("Error al actualizar el usuario. Por favor inténtalo de nuevo.");
      }
    }
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
    <AuthContext.Provider value={{ 
      user, 
      token, 
      purchasedCourses, 
      login, 
      logout, 
      createUser,
      updateUser,
      authReady, 
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
