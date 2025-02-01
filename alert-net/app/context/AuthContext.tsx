"use client";

import { createContext, useState, useContext, useCallback } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Here you would typically:
      // 1. Send credentials to your backend
      // 2. Receive and store authentication token
      // 3. Get user data

      // For now, simulate a successful login
      setIsLoggedIn(true);
      setUser({
        id: "user_1",
        name: "Test User",
        email: email,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      // Here you would typically:
      // 1. Send user data to your backend
      // 2. Create new user account
      // 3. Log user in automatically

      // For now, simulate a successful signup
      setIsLoggedIn(true);
      setUser({
        id: "user_1",
        name: name,
        email: email,
      });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Here you would typically:
    // 1. Clear authentication token
    // 2. Clear user data

    setIsLoggedIn(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
