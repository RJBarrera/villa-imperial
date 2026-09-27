import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
} from "../api/auth";

import type { AuthUser, LoginPayload } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = async () => {
    try {
      const result = await getMe();

      setUser(result);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    const result = await loginRequest(payload);
    setUser(result);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      queryClient.clear();
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      queryClient.clear();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse " + "dentro de AuthProvider.");
  }

  return context;
}
