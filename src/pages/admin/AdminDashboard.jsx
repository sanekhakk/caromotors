import { Link } from 'react-router-dom';
import { FaCar, FaUsers, FaClipboardList, FaPlus, FaChartBar, FaArrowRight } from 'react-icons/fa';

const AdminDashboard = () => {
  const cards = [
    {
      icon: FaCar,
      label: 'Inventory',
      desc: 'Manage car listings, edit details, mark as sold.',
      link: '/admin/manage-cars',
      linkLabel: 'View All Cars',
      accent: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      action: { to: '/admin/add-car', icon: FaPlus },
    },
    {
      icon: FaClipboardList,
      label: 'Bookings',
      desc: 'Track token payments and update deal status.',
      link: '/admin/bookings',
      linkLabel: 'Manage Bookings',
      accent: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-700',
    },
    {
      icon: FaUsers,
      label: 'Customers',
      desc: 'View registered customers and manage roles.',
      link: '/admin/users',
      linkLabel: 'View Users',
      accent: 'from-purple-500 to-violet-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Control Center</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your dealership from one place.</p>
      </div>

      {/* Status card */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-4 sm:p-5 mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Business Status</p>
          <p className="text-xl font-black">Caromotors Live</p>
          <p className="text-xs text-slate-400 mt-1">Single Vendor Mode</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse mb-1"></div>
          <span className="text-[10px] text-green-400 font-bold">ONLINE</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        {cards.map((card) => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-2xl p-4 sm:p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`bg-gradient-to-br ${card.accent} p-2.5 rounded-xl`}>
                <card.icon className="text-white" size={18} />
              </div>
              {card.action && (
                <Link to={card.action.to} className={`p-2 rounded-xl hover:bg-white/60 transition-all ${card.text}`}>
                  <card.action.icon size={14} />
                </Link>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] mb-1">{card.label}</h2>
            <p className="text-slate-500 text-xs mb-3">{card.desc}</p>
            <Link to={card.link} className={`flex items-center gap-1.5 text-xs font-black ${card.text} hover:underline`}>
              {card.linkLabel} <FaArrowRight size={9} />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
        <h3 className="font-black text-[#0F172A] mb-3 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { to: '/admin/add-car', icon: FaPlus, label: 'Add Vehicle', color: 'bg-[#F59E0B]/10 text-[#0F172A] border-[#F59E0B]/30' },
            { to: '/admin/manage-cars', icon: FaCar, label: 'Inventory', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { to: '/admin/bookings', icon: FaClipboardList, label: 'Bookings', color: 'bg-green-50 text-green-700 border-green-100' },
            { to: '/admin/users', icon: FaUsers, label: 'Customers', color: 'bg-purple-50 text-purple-700 border-purple-100' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border font-black text-xs hover:scale-105 transition-all ${a.color}`}>
              <a.icon size={16} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;