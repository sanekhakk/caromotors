import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // src/context/AuthContext.jsx
useEffect(() => {
  const checkUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };
  checkUserLoggedIn();
}, []);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    
    // We need to decode the token to get the role, OR modify the backend to send user info on login.
    // QUICK FIX: Modify backend login controller to send user data, OR we just decode it here.
    // Let's assume for this step we will parse the payload manually (JWTs are just base64):
    const payload = JSON.parse(atob(res.data.token.split('.')[1]));
    
    const userData = { id: payload.user.id, role: payload.user.role };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;