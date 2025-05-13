import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem("token", token); // Storing token in AsyncStorage
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      });
    } catch (err) {
      console.error("Error storing token during login:", err);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Removing token from AsyncStorage
      setUser(null);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // ✅ Function to update specific user fields (like name)
  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            logout(); // Token expired
          } else {
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
            });
          }
        } catch (err) {
          logout(); // Invalid token
        }
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);