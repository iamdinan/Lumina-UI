import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "@/api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lumina_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("lumina_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const { token, user } = await loginUser(username, password);
    localStorage.setItem("lumina_token", token);
    setUser(user);
  }

  async function register(username, password) {
    await registerUser(username, password);
    // Auto-login after successful registration
    await login(username, password);
  }

  function logout() {
    localStorage.removeItem("lumina_token");
    setUser(null);
  }

  async function refreshUser() {
    const me = await getMe();
    setUser(me);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
