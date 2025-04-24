import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/api/auth/verify", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            setUser(null);
            localStorage.removeItem("token"); // Clean up invalid token
          }
        } catch (err) {
          console.error('Verification error:', err);
          setUser(null);
          localStorage.removeItem("token"); // Clean up on error
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Move this outside try-catch to ensure it always runs
    };

    verifyUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
export default AuthContext;