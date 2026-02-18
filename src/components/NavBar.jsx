import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import { FaHeart, FaUser, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/5' 
        : 'bg-white/80 backdrop-blur-md'
    } border-b ${scrolled ? 'border-slate-300/50' : 'border-slate-200'}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo with Hover Animation */}
          <Link to="/" className="flex items-center gap-2 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
            <img 
              src={logo} 
              alt="Caromotors Logo" 
              className="h-28 relative transform group-hover:scale-110 transition-transform duration-300" 
            />
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {/* Home Link with Active State */}
            <Link 
              to="/" 
              className={`relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 group ${
                isActive('/') 
                  ? 'text-[#F59E0B]' 
                  : 'text-primary hover:text-accent'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 rounded-full transition-all duration-300 ${
                isActive('/') ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
              }`}></div>
              <div className="flex items-center gap-2 relative z-10">
                <FaHome className={`transition-transform duration-300 ${isActive('/') ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>Home</span>
              </div>
              {isActive('/') && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"></div>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                {user.role !== 'admin' && (
                  <>
                    {/* Wishlist Link with Active State */}
                    <Link 
                      to="/wishlist" 
                      className={`relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 group ${
                        isActive('/wishlist') 
                          ? 'text-[#F59E0B]' 
                          : 'text-primary hover:text-accent'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 rounded-full transition-all duration-300 ${
                        isActive('/wishlist') ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                      }`}></div>
                      <div className="flex items-center gap-2 relative z-10">
                        <FaHeart className={`transition-transform duration-300 ${isActive('/wishlist') ? 'scale-110 animate-heart-beat' : 'group-hover:scale-110 group-hover:animate-wiggle'}`} />
                        <span>Wishlist</span>
                      </div>
                      {isActive('/wishlist') && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"></div>
                      )}
                    </Link>

                    {/* Dashboard Link with Active State */}
                    <Link 
                      to="/dashboard" 
                      className={`relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 group ${
                        isActive('/dashboard') 
                          ? 'text-[#F59E0B]' 
                          : 'text-primary hover:text-accent'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 rounded-full transition-all duration-300 ${
                        isActive('/dashboard') ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                      }`}></div>
                      <div className="flex items-center gap-2 relative z-10">
                        <FaUser className={`transition-transform duration-300 ${isActive('/dashboard') ? 'scale-110' : 'group-hover:scale-110'}`} />
                        <span>My Bookings</span>
                      </div>
                      {isActive('/dashboard') && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"></div>
                      )}
                    </Link>
                  </>
                )}

                {/* Animated Logout Button */}
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="relative ml-4 bg-gradient-to-r from-primary to-[#1E293B] text-white px-7 py-3 rounded-full text-sm font-black hover:shadow-2xl hover:shadow-slate-900/30 transition-all overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    Logout
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                {/* Login Button with Hover Effect */}
                <button 
                  onClick={() => setIsAuthOpen(true)} 
                  className="relative px-6 py-2.5 rounded-full text-primary font-bold text-sm transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    Login
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </button>

                {/* Register Button with Advanced Animation */}
                <button 
                  onClick={() => setIsAuthOpen(true)} 
                  className="relative bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-7 py-3 rounded-full text-sm font-black shadow-lg shadow-slate-900/20 overflow-hidden group"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000">
                    <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  </div>

                  <span className="relative z-10 group-hover:text-[#0F172A] transition-colors flex items-center gap-2">
                    Register
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-[#F59E0B]/50"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Indicator (Optional) */}
      <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"></div>
    </nav>
    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;