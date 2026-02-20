import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaSearch } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/api/auth')
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[#0F172A]">Customers</h1>
        <p className="text-slate-500 text-xs mt-0.5">{users.length} registered users</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm"
        />
      </div>

      {/* ── Mobile list ── */}
      <div className="sm:hidden space-y-2">
        {filtered.map(u => (
          <div key={u._id} className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-300 flex items-center justify-center font-black text-[#0F172A] text-sm flex-shrink-0">
              {u.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#0F172A] text-sm truncate">{u.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
            </div>
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase flex-shrink-0 ${
              u.role === 'admin' ? 'bg-[#F59E0B]/15 text-[#0F172A]' : 'bg-slate-100 text-slate-600'
            }`}>
              {u.role}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No users found.</div>
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['User', 'Email', 'Role'].map(h => (
                <th key={h} className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(u => (
              <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-300 flex items-center justify-center font-black text-[#0F172A] text-sm flex-shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="font-bold text-[#0F172A] text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{u.email}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                    u.role === 'admin' ? 'bg-[#F59E0B]/15 text-[#0F172A]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;