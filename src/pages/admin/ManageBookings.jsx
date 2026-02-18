import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaRegClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="w-full px-4 md:px-12 py-10 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0F172A]">Sales & Enquiries</h1>
        <p className="text-slate-500 font-medium">Track token payments and customer discussions</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Customer Details</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Interested Vehicle</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-[#0F172A]">{b.user?.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{b.user?.email}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <img src={b.car?.images[0]} className="w-12 h-10 object-cover rounded-lg" alt="" />
                    <span className="font-bold text-sm text-[#0F172A]">{b.car?.title}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                    ${b.status === 'Deal Closed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-6">
                  <select 
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-xl outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    defaultValue={b.status}
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
      </div>
    </div>
  );
};

export default ManageBookings;