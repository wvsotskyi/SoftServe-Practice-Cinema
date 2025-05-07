// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, AuthTokens, User } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have an access token
        const storedTokens = localStorage.getItem("authTokens");
        if (storedTokens) {
          const parsedTokens = JSON.parse(storedTokens) as AuthTokens;
          setTokens(parsedTokens);

          // Fetch user data
          await fetchUserData(parsedTokens.accessToken);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!tokens?.accessToken) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Background token refresh failed:", error);
        await clearAuthState();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [tokens?.accessToken]);

  const fetchUserData = async (accessToken: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If fetching user data fails, clear auth state
      await clearAuthState();
    }
  };

  const clearAuthState = async () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("authTokens");
    // Optionally call logout API to clear refresh token cookie
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Important for cookies
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const { accessToken } = data.data;

      // Store access token in local storage
      localStorage.setItem("authTokens", JSON.stringify({ accessToken }));
      setTokens({ accessToken });

      // Fetch user data
      await fetchUserData(accessToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      // After successful registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearAuthState();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include", // Important for cookies
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const { accessToken } = data.data;

      // Store the new access token
      localStorage.setItem("authTokens", JSON.stringify({ accessToken }));
      setTokens({ accessToken });

      return accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      await clearAuthState();
      throw error;
    }
  };

  const value = {
    user,
    tokens,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
