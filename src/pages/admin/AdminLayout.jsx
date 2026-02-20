import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import {
  FaCar, FaUsers, FaClipboardList, FaPlus, FaSignOutAlt,
  FaChartBar, FaBars, FaTimes, FaHandshake
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = path => location.pathname === path;

  const mainNav = [
    { path: '/admin/dashboard', icon: FaChartBar,     label: 'Overview'   },
    { path: '/admin/manage-cars', icon: FaCar,        label: 'Inventory'  },
    { path: '/admin/add-car',   icon: FaPlus,         label: 'Add Car'    },
  ];

  const opsNav = [
    { path: '/admin/dealers',   icon: FaHandshake,    label: 'Dealers'    },
    { path: '/admin/bookings',  icon: FaClipboardList, label: 'Enquiries' },
    { path: '/admin/users',     icon: FaUsers,        label: 'Customers'  },
  ];

  const allNav = [...mainNav, ...opsNav];

  const navItemClass = path =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left text-sm ${
      isActive(path)
        ? 'bg-[#F59E0B] text-[#0F172A] font-black shadow-lg'
        : 'text-slate-400 hover:text-white hover:bg-white/10 font-bold'
    }`;

  const SidebarContent = ({ onLinkClick }) => (
    <>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-2 mb-2">Main Menu</p>
        {mainNav.map(item => (
          <Link key={item.path} to={item.path} onClick={onLinkClick} className={navItemClass(item.path)}>
            <item.icon size={15} /> {item.label}
          </Link>
        ))}

        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-2 mb-2 mt-5">Operations</p>
        {opsNav.map(item => (
          <Link key={item.path} to={item.path} onClick={onLinkClick} className={navItemClass(item.path)}>
            <item.icon size={15} />
            <span className="flex-1">{item.label}</span>
            {/* Highlight Dealers as new */}
            {item.path === '/admin/dealers' && (
              <span className="text-[8px] font-black bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-white/5 p-3 rounded-xl mb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#F59E0B] flex items-center justify-center font-black text-[#0F172A] text-xs flex-shrink-0">AD</div>
            <div>
              <p className="text-sm font-black text-white">Admin</p>
              <p className="text-[10px] text-slate-500">System Admin</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all text-sm font-black">
          <FaSignOutAlt size={14} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex md:w-64 flex-col bg-gradient-to-b from-[#0F172A] to-[#1E293B] shadow-2xl">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800/50">
          <img src={logo} alt="Admin" className="h-14 brightness-0 invert" />
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-2 font-black">Management Portal</p>
        </div>
        <SidebarContent onLinkClick={undefined} />
      </aside>

      {/* ── Mobile Drawer ── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-gradient-to-b from-[#0F172A] to-[#1E293B] shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
              <img src={logo} alt="Admin" className="h-12 brightness-0 invert" />
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                <FaTimes size={18} />
              </button>
            </div>
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-600 hover:text-[#0F172A]">
              <FaBars size={18} />
            </button>
            <div>
              <h2 className="font-black text-[#0F172A] text-base sm:text-lg leading-tight">
                {allNav.find(n => isActive(n.path))?.label || 'Dashboard'}
              </h2>
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold">System Online</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <p className="text-[10px] text-slate-500 font-bold">
              {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* ── Mobile Bottom Tab Bar ── */}
        <nav className="md:hidden bg-white border-t border-slate-200 flex items-center justify-around px-1 py-2 safe-area-bottom shadow-2xl">
          {/* Show only first 5 items on mobile (no room for all 6) */}
          {[mainNav[0], mainNav[1], mainNav[2], opsNav[0], opsNav[1]].map(item => (
            <Link key={item.path} to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
                isActive(item.path) ? 'text-[#F59E0B]' : 'text-slate-400 hover:text-slate-700'
              }`}>
              <item.icon size={isActive(item.path) ? 17 : 15} />
              <span className="text-[8px] font-bold">{item.label}</span>
              {isActive(item.path) && <div className="h-0.5 w-4 bg-[#F59E0B] rounded-full" />}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-red-400">
            <FaSignOutAlt size={15} />
            <span className="text-[8px] font-bold">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;