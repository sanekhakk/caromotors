import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaClipboardList, FaCar, FaCheckCircle, FaClock, FaWhatsapp, FaCalendarAlt, FaMapMarkerAlt, FaReceipt, FaChartLine } from 'react-icons/fa';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/bookings/my');
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Token Paid': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Discussion': 'bg-amber-100 text-amber-800 border-amber-200',
      'Deal Closed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Token Paid': <FaClock className="animate-pulse-slow" />,
      'In Discussion': <FaWhatsapp className="animate-wiggle" />,
      'Deal Closed': <FaCheckCircle className="animate-heart-beat" />,
      'Cancelled': <span>✕</span>
    };
    return icons[status] || <FaClock />;
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    tokenPaid: bookings.filter(b => b.status === 'Token Paid').length,
    inDiscussion: bookings.filter(b => b.status === 'In Discussion').length,
    dealClosed: bookings.filter(b => b.status === 'Deal Closed').length,
    totalValue: bookings.reduce((sum, b) => sum + (b.car?.price || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="mb-12 animate-slide-in-top">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#F59E0B] rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-[#F59E0B] p-4 rounded-2xl">
                <FaClipboardList className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-[#0F172A] tracking-tight">My Bookings</h1>
              <p className="text-slate-500 font-medium mt-2">Track all your vehicle enquiries and deals</p>
            </div>
          </div>
          <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 to-[#F59E0B] rounded-full"></div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Bookings */}
          <div className="group animate-fade-in-up" style={{animationDelay: '0s'}}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                    <FaClipboardList className="text-white text-xl" />
                  </div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-4xl font-black text-[#0F172A] mb-1">{stats.total}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Bookings</p>
              </div>
            </div>
          </div>

          {/* Token Paid */}
          <div className="group animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-4xl font-black text-[#0F172A] mb-1">{stats.tokenPaid}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending</p>
              </div>
            </div>
          </div>

          {/* Deal Closed */}
          <div className="group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-4xl font-black text-[#0F172A] mb-1">{stats.dealClosed}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed</p>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="group animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-2xl font-black text-[#0F172A] mb-1">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/50 inline-flex gap-2">
            {['all', 'Token Paid', 'In Discussion', 'Deal Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  filter === status
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] shadow-lg shadow-[#F59E0B]/30'
                    : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-[#F59E0B]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-[#F59E0B] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin-reverse"></div>
            </div>
            <p className="text-slate-600 font-black text-lg animate-pulse">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-300 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <FaCar className="text-blue-400 text-4xl" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#0F172A] mb-3">No bookings found</h3>
            <p className="text-slate-500 text-lg">
              {filter === 'all' 
                ? 'Start your journey by booking your dream car today!'
                : `No bookings with status: ${filter}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <div 
                key={booking._id} 
                className="group animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F59E0B] via-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                      {/* Car Image */}
                      <div className="md:col-span-3">
                        <div className="relative h-48 md:h-full rounded-2xl overflow-hidden group/img">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent z-10"></div>
                          <img 
                            src={booking.car?.images[0]} 
                            alt={booking.car?.title}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute top-3 left-3 z-20">
                            <span className="bg-white/95 backdrop-blur-md text-[#0F172A] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                              {booking.car?.brand}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="md:col-span-6">
                        <h3 className="text-2xl font-black text-[#0F172A] mb-3 group-hover:text-[#F59E0B] transition-colors">
                          {booking.car?.title}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <FaReceipt className="text-[#F59E0B]" />
                            <div>
                              <p className="text-xs text-slate-400 font-bold">Transaction ID</p>
                              <p className="text-sm font-black">{booking.paymentId?.slice(-8)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <FaCalendarAlt className="text-[#F59E0B]" />
                            <div>
                              <p className="text-xs text-slate-400 font-bold">Booked On</p>
                              <p className="text-sm font-black">
                                {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                          <FaMapMarkerAlt className="text-[#F59E0B]" />
                          <span className="text-sm font-bold">{booking.car?.location}</span>
                        </div>
                      </div>

                      {/* Status and Price */}
                      <div className="md:col-span-3 flex flex-col justify-between items-end">
                        <div className={`px-4 py-2 rounded-full border-2 font-black text-sm flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </div>
                        
                        <div className="text-right mt-4">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Vehicle Price</p>
                          <p className="text-3xl font-black text-[#0F172A]">
                            ₹{booking.car?.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 pb-6">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            booking.status === 'Token Paid' ? 'w-1/3 bg-gradient-to-r from-blue-500 to-cyan-500' :
                            booking.status === 'In Discussion' ? 'w-2/3 bg-gradient-to-r from-amber-500 to-orange-500' :
                            booking.status === 'Deal Closed' ? 'w-full bg-gradient-to-r from-green-500 to-emerald-500' :
                            'w-1/4 bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;