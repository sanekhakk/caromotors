import { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchAllBookings = async () => {
    const res = await axios.get('http://localhost:4000/api/bookings');
    setBookings(res.data);
  };

  useEffect(() => { fetchAllBookings(); }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/bookings/${id}`, { status: newStatus });
      fetchAllBookings();
    } catch { alert("Failed to update status"); }
  };

  const statusColor = (s) => ({
    'Deal Closed': 'bg-green-50 text-green-700',
    'Token Paid': 'bg-blue-50 text-blue-700',
    'In Discussion': 'bg-amber-50 text-amber-700',
    'Cancelled': 'bg-red-50 text-red-700',
  }[s] || 'bg-slate-50 text-slate-700');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[#0F172A]">Enquiries & Bookings</h1>
        <p className="text-slate-500 text-xs mt-0.5">{bookings.length} total bookings</p>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="sm:hidden space-y-3">
        {bookings.map(b => (
          <div key={b._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Car image + title */}
            <div className="flex gap-3 p-3">
              <img src={b.car?.images[0]} className="h-14 w-20 object-cover rounded-xl flex-shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#0F172A] text-sm leading-tight line-clamp-1">{b.car?.title}</p>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{b.user?.name}</p>
                <p className="text-[10px] text-slate-400">{b.user?.email}</p>
              </div>
            </div>
            {/* Status + action */}
            <div className="flex items-center justify-between px-3 pb-3 gap-2">
              <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColor(b.status)}`}>
                {b.status}
              </span>
              <select
                onChange={(e) => updateStatus(b._id, e.target.value)}
                defaultValue={b.status}
                className="bg-slate-50 border border-slate-200 text-xs font-bold py-1.5 px-2 rounded-xl outline-none focus:ring-2 focus:ring-[#F59E0B] flex-1 max-w-[160px]"
              >
                <option value="Token Paid">Token Paid</option>
                <option value="In Discussion">In Discussion</option>
                <option value="Deal Closed">Deal Closed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No bookings yet.</div>
        )}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Customer', 'Vehicle', 'Status', 'Update'].map(h => (
                <th key={h} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map(b => (
              <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-[#0F172A] text-sm">{b.user?.name}</p>
                  <p className="text-[10px] text-slate-400">{b.user?.email}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={b.car?.images[0]} className="w-12 h-9 object-cover rounded-lg flex-shrink-0" alt="" />
                    <span className="font-bold text-sm text-[#0F172A] line-clamp-1">{b.car?.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColor(b.status)}`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    defaultValue={b.status}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-xl outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  >
                    <option value="Token Paid">Token Paid</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Deal Closed">Deal Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No bookings yet.</div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;