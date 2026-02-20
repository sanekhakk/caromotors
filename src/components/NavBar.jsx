import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import { FaHeart, FaUser, FaHome, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
      isActive(path)
        ? 'text-[#F59E0B] bg-[#F59E0B]/10'
        : 'text-slate-700 hover:text-[#F59E0B] hover:bg-slate-50'
    }`;

  const desktopLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
      isActive(path)
        ? 'text-[#F59E0B] bg-[#F59E0B]/10'
        : 'text-slate-700 hover:text-[#F59E0B] hover:bg-[#F59E0B]/5'
    }`;

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/5'
          : 'bg-white/90 backdrop-blur-md'
      } border-b border-slate-200/70`}>
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img src={logo} alt="Caromotors" className="h-20 transform group-hover:scale-105 transition-transform duration-300" />
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={desktopLinkClass('/')}>
                <FaHome size={13} /> Home
              </Link>
              {user && user.role !== 'admin' && (
                <>
                  <Link to="/wishlist" className={desktopLinkClass('/wishlist')}>
                    <FaHeart size={13} /> Wishlist
                  </Link>
                  <Link to="/dashboard" className={desktopLinkClass('/dashboard')}>
                    <FaUser size={13} /> My Bookings
                  </Link>
                </>
              )}
              {user ? (
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="ml-3 bg-[#0F172A] text-white px-5 py-2.5 rounded-full text-sm font-black hover:bg-red-600 transition-all duration-300 shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-2 ml-3">
                  <button onClick={() => setIsAuthOpen(true)}
                    className="text-slate-700 font-bold text-sm px-4 py-2.5 rounded-full hover:bg-slate-100 transition-all">
                    Login
                  </button>
                  <button onClick={() => setIsAuthOpen(true)}
                    className="bg-[#0F172A] text-white px-5 py-2.5 rounded-full text-sm font-black hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all duration-300 shadow-lg">
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* ── Mobile: quick wishlist + hamburger ── */}
            <div className="flex md:hidden items-center gap-1">
              {user && user.role !== 'admin' && (
                <Link to="/wishlist" className="p-2.5 text-slate-600 hover:text-[#F59E0B] transition-colors">
                  <FaHeart size={17} />
                </Link>
              )}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 text-slate-700 hover:text-[#F59E0B] transition-colors"
                aria-label="Open menu"
              >
                <FaBars size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════
          RIGHT-SIDE MOBILE DRAWER
      ══════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          drawerOpen ? 'visible bg-[#0F172A]/50 backdrop-blur-sm' : 'invisible bg-transparent'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel — slides in from the right */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-[70] md:hidden bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <img src={logo} alt="Caromotors" className="h-14" />
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-slate-500 hover:text-[#F59E0B] hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Close menu"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Navigation</p>

          <Link to="/" className={navLinkClass('/')}>
            <div className={`p-1.5 rounded-lg ${isActive('/') ? 'bg-[#F59E0B]/20' : 'bg-slate-100'}`}>
              <FaHome size={13} className={isActive('/') ? 'text-[#F59E0B]' : 'text-slate-500'} />
            </div>
            Home
          </Link>

          {user && user.role !== 'admin' && (
            <>
              <Link to="/wishlist" className={navLinkClass('/wishlist')}>
                <div className={`p-1.5 rounded-lg ${isActive('/wishlist') ? 'bg-[#F59E0B]/20' : 'bg-slate-100'}`}>
                  <FaHeart size={13} className={isActive('/wishlist') ? 'text-[#F59E0B]' : 'text-slate-500'} />
                </div>
                Wishlist
              </Link>

              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                <div className={`p-1.5 rounded-lg ${isActive('/dashboard') ? 'bg-[#F59E0B]/20' : 'bg-slate-100'}`}>
                  <FaUser size={13} className={isActive('/dashboard') ? 'text-[#F59E0B]' : 'text-slate-500'} />
                </div>
                My Bookings
              </Link>
            </>
          )}
        </nav>

        {/* Drawer Footer — Auth actions */}
        <div className="px-4 py-5 border-t border-slate-100 space-y-2">
          {user ? (
            <>
              {/* User info chip */}
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-300 flex items-center justify-center font-black text-[#0F172A] text-sm flex-shrink-0">
                  {user.role === 'admin' ? 'AD' : 'U'}
                </div>
                <div>
                  <p className="text-xs font-black text-[#0F172A]">{user.role === 'admin' ? 'Admin' : 'My Account'}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full bg-red-500 text-white py-3 rounded-xl text-sm font-black hover:bg-red-600 active:scale-95 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setIsAuthOpen(true); setDrawerOpen(false); }}
                className="w-full border-2 border-[#0F172A] text-[#0F172A] py-3 rounded-xl text-sm font-black hover:bg-slate-50 active:scale-95 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => { setIsAuthOpen(true); setDrawerOpen(false); }}
                className="w-full bg-[#0F172A] text-white py-3 rounded-xl text-sm font-black hover:bg-[#F59E0B] hover:text-[#0F172A] active:scale-95 transition-all duration-300"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;