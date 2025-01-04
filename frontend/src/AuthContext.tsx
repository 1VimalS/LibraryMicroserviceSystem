import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername); // Set the username after fetching from localStorage
    setLoading(false); // Mark loading as false after fetching
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
