import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { 
  FaCar, 
  FaUsers, 
  FaClipboardList, 
  FaPlus, 
  FaSignOutAlt, 
  FaChartBar,
  FaCogs,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) => `
    flex items-center p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
    ${isActive(path) 
      ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] shadow-xl shadow-[#F59E0B]/30 scale-105' 
      : 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-102'}
  `;

  const navItems = [
    { path: '/admin/dashboard', icon: FaChartBar, label: 'Overview', category: 'Main Menu' },
    { path: '/admin/manage-cars', icon: FaCar, label: 'Inventory', category: 'Main Menu' },
    { path: '/admin/add-car', icon: FaPlus, label: 'Add New Listing', category: 'Main Menu' },
    { path: '/admin/bookings', icon: FaClipboardList, label: 'Enquiries', category: 'Operations' },
    { path: '/admin/users', icon: FaUsers, label: 'Customers', category: 'Operations' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] overflow-hidden">
      {/* Advanced Sidebar with Animation */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col shadow-2xl transition-all duration-500 relative`}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-10 w-40 h-40 bg-[#F59E0B] rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        {/* Logo Section with Animation */}
        <div className="relative p-8 mb-4 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <img src={logo} alt="Caro Admin" className="h-12 w-auto brightness-0 invert" />
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              {sidebarOpen ? (
                <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <FaBars className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
          {sidebarOpen && (
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mt-3 font-black animate-fade-in">
              Management Portal
            </p>
          )}
        </div>
        
        {/* Navigation with Staggered Animation */}
        <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {['Main Menu', 'Operations'].map((category) => (
            <div key={category}>
              {sidebarOpen && (
                <div className="text-[11px] text-slate-600 font-black uppercase tracking-widest px-3 mb-4 mt-6 first:mt-0">
                  {category}
                </div>
              )}
              {navItems
                .filter(item => item.category === category)
                .map((item, idx) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={navItemClass(item.path)}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Hover Glow Effect */}
                    {isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] blur-xl opacity-50"></div>
                    )}
                    
                    {/* Icon with Animation */}
                    <item.icon className={`text-xl relative z-10 transition-all duration-300 ${
                      isActive(item.path) 
                        ? 'text-[#0F172A] scale-110' 
                        : 'group-hover:text-[#F59E0B] group-hover:scale-110'
                    } ${sidebarOpen ? 'mr-4' : 'mx-auto'}`} />
                    
                    {/* Label with Slide Animation */}
                    {sidebarOpen && (
                      <span className="font-bold text-sm relative z-10 animate-fade-in">
                        {item.label}
                      </span>
                    )}

                    {/* Active Indicator */}
                    {isActive(item.path) && (
                      <div className="absolute right-2 w-2 h-2 bg-[#0F172A] rounded-full animate-pulse-slow"></div>
                    )}
                  </Link>
                ))}
            </div>
          ))}
        </nav>

        {/* User Profile Section with Animation */}
        <div className="relative p-4 mt-auto border-t border-slate-800/50">
          {sidebarOpen ? (
            <div className="animate-fade-in">
              <div className="bg-white/5 p-4 rounded-2xl mb-4 backdrop-blur-xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="inset-0 bg-[#F59E0B] rounded-full blur-md animate-pulse-slow"></div>
                    <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center font-black text-[#0F172A] shadow-xl">
                      AD
                    </div>
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-black truncate">Admin Central</p>
                    <p className="text-[10px] text-slate-500 truncate">System Administrator</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 hover:from-red-800 hover:to-red-800 hover:text-white rounded-2xl transition-all duration-300 font-black text-sm gap-3 shadow-lg shadow-red-500/5 group overflow-hidden"
              >
                <FaSignOutAlt className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="relative z-10">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full p-4 text-red-400 hover:bg-red-500/20 rounded-2xl transition-all duration-300 group"
            >
              <FaSignOutAlt className="mx-auto text-xl group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area with Enhanced Header */}
      <div className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Enhanced Top Header Bar */}
        <header className="relative z-10 h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-10 sticky top-0 shadow-lg">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Dashboard
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500 font-bold">System Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications Badge */}
            <button className="relative p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-[#F59E0B] transition-all duration-300 group">
              <FaCogs className="text-lg group-hover:rotate-90 transition-transform duration-500" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                3
              </span>
            </button>

            {/* Time Display */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-3 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content with Animation */}
        <main className="relative flex-1 p-10 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;