import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaTrash, FaCheckCircle, FaPlus, FaSearch, FaHandshake,
  FaPhone, FaMapMarkerAlt, FaFilter, FaTimes, FaTag,
  FaChevronDown, FaCar, FaEye
} from 'react-icons/fa';
import { getDealers, getDealerById, seedDemoDealer } from '../../dealerStore';

/* ── Dealer Badge (small inline pill) ── */
const DealerBadge = ({ car, dealers }) => {
  const dealer = dealers.find(d => d.id === car.dealerId) ||
    (car.dealerName ? { name: car.dealerName, phone: car.dealerPhone, place: car.dealerPlace, color: 'from-slate-600 to-slate-800', avatar: car.dealerName?.slice(0, 2).toUpperCase() } : null);

  if (!dealer) return (
    <span className="text-[9px] font-bold text-slate-300 italic">Unassigned</span>
  );

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-5 w-5 rounded-md bg-gradient-to-br ${dealer.color || 'from-slate-600 to-slate-800'} flex items-center justify-center font-black text-white text-[8px] flex-shrink-0`}>
        {dealer.avatar || dealer.name?.slice(0,2).toUpperCase()}
      </div>
      <span className="text-[11px] font-black text-[#0F172A] truncate">{dealer.name}</span>
    </div>
  );
};

/* ── Dealer Detail Panel (expanded row) ── */
const DealerDetailPanel = ({ car, dealers }) => {
  const dealer = dealers.find(d => d.id === car.dealerId) ||
    (car.dealerName ? { name: car.dealerName, phone: car.dealerPhone, place: car.dealerPlace, color: 'from-slate-600 to-slate-800', avatar: car.dealerName?.slice(0, 2).toUpperCase() } : null);

  if (!dealer) return (
    <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
      <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
        <FaHandshake size={12} /> No dealer assigned to this vehicle.
        <Link to="/admin/dealers" className="text-[#F59E0B] underline ml-1">Manage Dealers →</Link>
      </p>
    </div>
  );

  return (
    <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <FaHandshake size={9} /> Assigned Dealer
      </p>
      <div className="flex items-center gap-4 flex-wrap">
        {/* Avatar */}
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${dealer.color} flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0`}>
          {dealer.avatar}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-black text-[#0F172A] text-sm">{dealer.name}</p>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            {dealer.place && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                <FaMapMarkerAlt className="text-[#F59E0B]" size={9} /> {dealer.place}
              </span>
            )}
            {dealer.phone && (
              <a href={`tel:${dealer.phone}`}
                className="flex items-center gap-1 text-[10px] text-slate-500 font-bold hover:text-green-600 transition-colors">
                <FaPhone className="text-green-500" size={9} /> {dealer.phone}
              </a>
            )}
          </div>
        </div>
        <Link to="/admin/dealers"
          className="flex-shrink-0 text-[10px] font-black text-[#F59E0B] hover:underline flex items-center gap-1">
          <FaEye size={10} /> View Profile
        </Link>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN ManageInventory
════════════════════════════════════════ */
const ManageInventory = () => {
  const [cars, setCars]       = useState([]);
  const [dealers, setDealers] = useState([]);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dealerFilter, setDealerFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null); // car._id of expanded dealer panel

  const fetchCars = async () => {
    const res = await axios.get('http://localhost:4000/api/cars');
    setCars(res.data.cars ? res.data.cars : res.data);
  };

  useEffect(() => {
    fetchCars();
    seedDemoDealer();
    setDealers(getDealers());
    const handler = () => setDealers(getDealers());
    window.addEventListener('caromotors:dealerUpdated', handler);
    return () => window.removeEventListener('caromotors:dealerUpdated', handler);
  }, []);

  const handleDelete = async id => {
    if (window.confirm('Delete this listing?')) {
      await axios.delete(`http://localhost:4000/api/cars/${id}`);
      fetchCars();
    }
  };

  const markAsSold = async id => {
    await axios.put(`http://localhost:4000/api/cars/${id}`, { status: 'sold' });
    fetchCars();
  };

  const toggleRow = id => setExpandedRow(prev => prev === id ? null : id);

  const filtered = cars.filter(car => {
    const matchSearch = car.title?.toLowerCase().includes(search.toLowerCase()) ||
      car.brand?.toLowerCase().includes(search.toLowerCase()) ||
      car.dealerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || car.status === statusFilter;
    const matchDealer = dealerFilter === 'all' || car.dealerId === dealerFilter || (!car.dealerId && dealerFilter === 'none');
    return matchSearch && matchStatus && matchDealer;
  });

  const statusColors = {
    available: 'bg-green-50 text-green-700',
    booked:    'bg-amber-50 text-amber-700',
    sold:      'bg-red-50 text-red-600',
  };

  const clearFilters = () => { setSearch(''); setStatusFilter('all'); setDealerFilter('all'); };
  const hasFilters   = search || statusFilter !== 'all' || dealerFilter !== 'all';

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Inventory</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {cars.length} vehicles · {cars.filter(c => c.status === 'available').length} available
          </p>
        </div>
        <Link to="/admin/add-car"
          className="flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-4 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-amber-200 hover:scale-105 transition-all self-start sm:self-auto">
          <FaPlus size={12} /> Add Vehicle
        </Link>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total',     value: cars.length,                                    color: 'bg-slate-50 border-slate-200 text-slate-600' },
          { label: 'Available', value: cars.filter(c=>c.status==='available').length,  color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Booked',    value: cars.filter(c=>c.status==='booked').length,     color: 'bg-amber-50 border-amber-100 text-amber-700' },
          { label: 'Sold',      value: cars.filter(c=>c.status==='sold').length,       color: 'bg-red-50 border-red-100 text-red-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} border rounded-2xl py-3 text-center`}>
            <p className="text-xl font-black leading-none">{s.value}</p>
            <p className="text-[9px] font-black uppercase tracking-wide opacity-60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input type="text" placeholder="Search by brand, title or dealer..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <FaTimes size={12} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 pl-3 pr-8 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm appearance-none font-bold text-slate-600 cursor-pointer">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="sold">Sold</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={11} />
        </div>

        {/* Dealer filter */}
        <div className="relative">
          <select value={dealerFilter} onChange={e => setDealerFilter(e.target.value)}
            className="bg-white border border-slate-200 pl-3 pr-8 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm appearance-none font-bold text-slate-600 cursor-pointer max-w-[180px]">
            <option value="all">All Dealers</option>
            <option value="none">Unassigned</option>
            {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={11} />
        </div>

        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-black hover:bg-red-100 transition-all border border-red-100 whitespace-nowrap">
            <FaTimes size={10} /> Clear
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <FaCar className="mx-auto text-slate-200 mb-3" size={40} />
          <p className="text-slate-400 font-bold text-sm">No vehicles match your filters.</p>
        </div>
      )}

      {/* ══════ MOBILE CARDS ══════ */}
      <div className="sm:hidden space-y-3">
        {filtered.map(car => (
          <div key={car._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="flex gap-3 p-3">
              <img src={car.images[0]} crossOrigin="anonymous"
                className="h-16 w-24 object-cover rounded-xl flex-shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#0F172A] text-sm leading-tight truncate">{car.title}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{car.brand} · {car.year}</p>

                {/* Dealer badge */}
                <div className="mt-1.5">
                  <DealerBadge car={car} dealers={dealers} />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-[#0F172A]">₹{(car.price / 100000).toFixed(1)}L</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${statusColors[car.status] || 'bg-slate-50 text-slate-500'}`}>
                      {car.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleRow(car._id)}
                      className={`p-2 rounded-xl transition-all ${expandedRow === car._id ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-slate-400 hover:bg-slate-100'}`}
                      title="Toggle dealer details">
                      <FaHandshake size={13} />
                    </button>
                    <button onClick={() => markAsSold(car._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark Sold">
                      <FaCheckCircle size={14} />
                    </button>
                    <button onClick={() => handleDelete(car._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable dealer detail */}
            {expandedRow === car._id && <DealerDetailPanel car={car} dealers={dealers} />}
          </div>
        ))}
      </div>

      {/* ══════ DESKTOP TABLE ══════ */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Vehicle', 'Dealer', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(car => (
              <>
                <tr key={car._id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">

                  {/* Vehicle */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={car.images[0]} crossOrigin="anonymous"
                        className="w-14 h-10 object-cover rounded-xl shadow-sm flex-shrink-0" alt="" />
                      <div>
                        <p className="font-bold text-[#0F172A] text-sm leading-tight">{car.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{car.brand} · {car.year} · {car.fuelType}</p>
                      </div>
                    </div>
                  </td>

                  {/* Dealer */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleRow(car._id)}
                      className={`flex items-center gap-2 group transition-all ${expandedRow === car._id ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                      title="Click to see dealer details"
                    >
                      <DealerBadge car={car} dealers={dealers} />
                      <FaChevronDown
                        size={9}
                        className={`text-slate-300 group-hover:text-[#F59E0B] transition-all ${expandedRow === car._id ? 'rotate-180 text-[#F59E0B]' : ''}`}
                      />
                    </button>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5">
                    <p className="font-black text-[#0F172A] text-sm">₹{(car.price / 100000).toFixed(1)}L</p>
                    <p className="text-[10px] text-slate-400">{car.price.toLocaleString('en-IN')}</p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusColors[car.status] || 'bg-slate-50 text-slate-500'}`}>
                      {car.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => markAsSold(car._id)}
                        className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark Sold">
                        <FaCheckCircle size={15} />
                      </button>
                      <button onClick={() => handleDelete(car._id)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                        <FaTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded dealer detail row */}
                {expandedRow === car._id && (
                  <tr key={`${car._id}-dealer`} className="border-b border-slate-100">
                    <td colSpan={5} className="p-0">
                      <DealerDetailPanel car={car} dealers={dealers} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No vehicles match your filters.</div>
        )}
      </div>

      {/* Dealer filter summary bar at the bottom */}
      {dealerFilter !== 'all' && (
        <div className="mt-4 flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
          <FaHandshake className="text-[#F59E0B]" size={13} />
          <p className="text-xs font-black text-[#0F172A]">
            Showing {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} for{' '}
            {dealerFilter === 'none' ? 'unassigned' : dealers.find(d => d.id === dealerFilter)?.name || 'selected dealer'}
          </p>
          <button onClick={() => setDealerFilter('all')}
            className="ml-auto text-[10px] text-slate-400 hover:text-red-500 font-bold flex items-center gap-1">
            <FaTimes size={9} /> Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageInventory;