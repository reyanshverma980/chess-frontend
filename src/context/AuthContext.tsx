import { User } from "lucide-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type User = {
  userId: string;
  username: string;
};

type Token = string | null;

type AuthContextType = {
  user: User | null;
  token: Token;
  signup: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AuthContext = createContext<Partial<AuthContextType>>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const username = localStorage.getItem("username")!;
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser({ userId: decodedToken.userId, username });
      }
    }
  }, [token]);

  const signup = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/signup`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const newToken = res.data.token;

      localStorage.setItem("username", username);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      const decodedToken: any = jwtDecode(newToken);
      setUser({ userId: decodedToken.userId, username });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const newToken = res.data.token;

      localStorage.setItem("username", username);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      const decodedToken: any = jwtDecode(newToken);
      setUser({ userId: decodedToken.userId, username });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
