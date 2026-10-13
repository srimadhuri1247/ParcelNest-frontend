
import {
  createContext,
  useContext,
  useState,
} from "react";

import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campus_user")) || null;
    } catch {
      return null;
    }
  });

  async function login(email, password) {
    const data = await loginUser(email, password);

    // Save the JWT token
    localStorage.setItem("campus_token", data.token);

    // Save the authenticated user's details
    localStorage.setItem(
      "campus_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem("campus_token");
    localStorage.removeItem("campus_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
