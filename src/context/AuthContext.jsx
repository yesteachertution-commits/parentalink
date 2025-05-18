import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const manualJwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Invalid token');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const decodeToken = useCallback((token) => {
    try {
      return jwtDecode(token);
    } catch {
      return manualJwtDecode(token);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback((tokenValue) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    try {
      const decoded = decodeToken(tokenValue);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email
      });
    } catch {
      logout();
    }
  }, [decodeToken, logout]);

  useEffect(() => {
    if (isInitialized) return;

    try {
      localStorage.setItem("authTest", "test");
      localStorage.removeItem("authTest");
    } catch {
      setIsInitialized(true);
      return;
    }

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = decodeToken(storedToken);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        } else {
          setToken(storedToken);
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
          });
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }

    setIsInitialized(true);
  }, [decodeToken, isInitialized]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);