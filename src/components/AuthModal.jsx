import { useState, useContext } from 'react';
import { FaEnvelope, FaLock, FaUser, FaTimes, FaArrowRight } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import logo from '../assets/logo.png';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        const freshUser = JSON.parse(localStorage.getItem('user'));
        if (freshUser?.role === 'admin') window.location.href = '/admin/dashboard';
        onClose();
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
        setIsLogin(true); // Switch to login after success
      }
    } catch (err) {
      setError(isLogin ? 'Invalid credentials.' : 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-modal-entry border border-slate-100">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 z-10">
          <FaTimes size={20} />
        </button>

        <div className="p-10">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#0F172A] uppercase tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Club'}
            </h2>
          </div>

          <form key={isLogin ? 'login' : 'register'} onSubmit={handleSubmit} className="space-y-4 animate-modal-switch">
            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    onChange={(e) => setFormData({...formData, name: e.target.value})} required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" placeholder="Email Address"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password" placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

            <button type="submit" className="w-full bg-[#0F172A] text-white p-4 rounded-2xl font-black hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
              {isLogin ? 'Sign In' : 'Create Account'} <FaArrowRight />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 hover:text-[#F59E0B] transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already a member? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;