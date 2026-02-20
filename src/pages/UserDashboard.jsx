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
    axios.get('http://localhost:4000/api/bookings/my')
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => ({
    'Token Paid': 'bg-blue-100 text-blue-700 border-blue-200',
    'In Discussion': 'bg-amber-100 text-amber-700 border-amber-200',
    'Deal Closed': 'bg-green-100 text-green-700 border-green-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
  }[status] || 'bg-slate-100 text-slate-700 border-slate-200');

  const getProgressWidth = (status) => ({
    'Token Paid': 'w-1/3 bg-blue-500',
    'In Discussion': 'w-2/3 bg-amber-500',
    'Deal Closed': 'w-full bg-green-500',
    'Cancelled': 'w-1/4 bg-red-500',
  }[status] || 'w-0');

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Token Paid').length,
    closed: bookings.filter(b => b.status === 'Deal Closed').length,
  };

  const filterTabs = ['all', 'Token Paid', 'In Discussion', 'Deal Closed', 'Cancelled'];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-gradient-to-r from-blue-500 to-[#F59E0B] p-3 rounded-xl">
            <FaClipboardList className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">My Bookings</h1>
            <p className="text-slate-400 text-xs font-medium">Track your vehicle enquiries</p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700 border-amber-100' },
            { label: 'Closed', value: stats.closed, color: 'bg-green-50 text-green-700 border-green-100' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 sm:p-4 border text-center`}>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 ${
                filter === tab
                  ? 'bg-[#F59E0B] text-[#0F172A] shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#F59E0B]'
              }`}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse flex gap-3 p-3">
                <div className="h-20 w-28 bg-slate-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <FaCar className="mx-auto text-slate-200 text-5xl mb-4" />
            <h3 className="text-xl font-black text-[#0F172A] mb-2">No bookings found</h3>
            <p className="text-slate-500 text-sm">
              {filter === 'all' ? 'Start your journey by booking your dream car!' : `No "${filter}" bookings yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Card layout: row on mobile too */}
                <div className="flex gap-3 p-3 sm:p-4">
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    <div className="relative h-20 w-28 sm:h-24 sm:w-36 rounded-xl overflow-hidden">
                      <img
                        src={booking.car?.images[0]}
                        alt={booking.car?.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-white/95 text-[#0F172A] text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                        {booking.car?.brand}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-tight line-clamp-2">
                        {booking.car?.title}
                      </h3>
                      <span className={`flex-shrink-0 text-[9px] font-black px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-lg font-black text-[#0F172A] mb-1.5">
                      ₹{(booking.car?.price / 100000)?.toFixed(1)}L
                    </p>

                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 font-bold">
                      {booking.car?.location && (
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[#F59E0B]" size={8} />
                          {booking.car.location}
                        </span>
                      )}
                      {booking.createdAt && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[#F59E0B]" size={8} />
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                      {booking.paymentId && (
                        <span className="flex items-center gap-1">
                          <FaReceipt className="text-[#F59E0B]" size={8} />
                          #{booking.paymentId.slice(-6)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100 mx-3 mb-3 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${getProgressWidth(booking.status)}`}></div>
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