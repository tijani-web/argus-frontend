"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signupUser, loginUser } from "@/lib/api";

interface AuthUser {
  email: string;
  userId: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;          // true while localStorage is being rehydrated
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const LS_KEY = "argus_user";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // start true — we don't know yet

  // Rehydrate from localStorage on mount. Set isLoading=false after, regardless of result.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore parse errors — treat as logged out
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const backendUser = await loginUser(email, password);
    const authUser: AuthUser = {
      email: backendUser.email,
      userId: backendUser.id,
      name: email.split("@")[0],
    };
    setUser(authUser);
    localStorage.setItem(LS_KEY, JSON.stringify(authUser));
  };

  const signup = async (email: string, password: string) => {
    const backendUser = await signupUser(email, password);
    const authUser: AuthUser = {
      email: backendUser.email,
      userId: backendUser.id,
      name: email.split("@")[0],
    };
    setUser(authUser);
    localStorage.setItem(LS_KEY, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
