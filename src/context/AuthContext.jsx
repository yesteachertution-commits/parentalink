import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const manualJwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
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
    try { return jwtDecode(token); } 
    catch { return manualJwtDecode(token); }
  }, []);

  const logout = useCallback(() => {
    const superadminToken = localStorage.getItem("superadmin_token");
    if (superadminToken) {
      localStorage.removeItem("superadmin_token");
      localStorage.removeItem("refreshToken");
      localStorage.setItem("token", superadminToken);
      window.location.href = '/superadmin';
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback((tokenValue) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    try {
      const decoded = decodeToken(tokenValue);
      setUser({
        id: decoded.id ?? decoded.sub ?? decoded.userId,
        name: decoded.name || decoded.studentName || "User",
        email: decoded.email ?? null,
        role: decoded.role || "admin",
        studentId: decoded.studentId ?? null,
        schoolCode: decoded.schoolCode ?? null,
      });
    } catch { logout(); }
  }, [decodeToken, logout]);

  // PROFESSIONAL SILENT TOKEN REFRESH INTERCEPTOR
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If API returns 401/403, and it's not a login/refresh route, and we haven't already retried:
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry && !originalRequest.url.includes('/login') && !originalRequest.url.includes('/refresh')) {
          originalRequest._retry = true; // Mark as retried to prevent infinite loops
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              logout();
              return Promise.reject(error);
            }

            const storedToken = localStorage.getItem('token');
            let role = 'admin';
            if (storedToken) {
               try { role = decodeToken(storedToken).role; } catch (e) {}
            }

            const refreshUrl = role === 'parent' 
                ? `${import.meta.env.VITE_BACKEND_URL}/api/parent/refresh` 
                : `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh`;

            // Pause the app, fetch a new token silently
            const res = await axios.post(refreshUrl, { refreshToken });
            const newToken = res.data.accessToken || res.data.token;
            
            if (newToken) {
              // Update persistent storage
              localStorage.setItem('token', newToken);
              
              // Update original failed request with the new valid token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              
              // Re-fire the original request seamlessly as if nothing ever happened
              return axios(originalRequest); 
            }
          } catch (refreshError) {
            // If the refresh token is also expired/invalid, THEN forcefully log out.
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, decodeToken]);

  // BOOT INITIALIZATION (REHYDRATION)
  useEffect(() => {
    if (isInitialized) return;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!storedToken && !refreshToken) {
        setIsInitialized(true);
        return;
      }

      // Phase 3 Architecture: Always attempt to securely rehydrate the session on cold boot
      if (refreshToken && navigator.onLine) {
        try {
          let role = 'admin';
          if (storedToken) {
            try { role = decodeToken(storedToken).role; } catch (e) {}
          }
          
          const refreshUrl = role === 'parent' 
              ? `${import.meta.env.VITE_BACKEND_URL}/api/parent/refresh` 
              : `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh`;
          
          // Silently hit the backend to get a 100% fresh, verified token
          const res = await axios.post(refreshUrl, { refreshToken });
          const newToken = res.data.accessToken || res.data.token;
          
          if (newToken) {
            login(newToken);
          } else {
            logout(); // Empty token returned
          }
        } catch (error) {
          // If the backend actively rejected the refresh token (401/403), the session is dead.
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          } else if (storedToken) {
            // It was a network failure (server unreachable), fallback to offline mode
            login(storedToken);
          }
        }
      } else if (storedToken) {
        // App is offline, trust the local token optimistically
        login(storedToken);
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [decodeToken, isInitialized, logout, login]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);