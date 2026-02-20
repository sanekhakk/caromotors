import { useState, useEffect, useCallback } from 'react';
import {
  FaPlus, FaTimes, FaEdit, FaTrash, FaPhone, FaMapMarkerAlt,
  FaEnvelope, FaStickyNote, FaCheck, FaUser, FaCar, FaSearch,
  FaHandshake, FaPalette
} from 'react-icons/fa';
import axios from 'axios';
import {
  getDealers, saveDealer, updateDealer, deleteDealer,
  seedDemoDealer, DEALER_COLORS
} from '../../dealerStore';

/* ══════ Dealer Form Modal (Add + Edit) ══════ */
const DealerModal = ({ dealer, onClose, onSaved }) => {
  const isEdit = !!dealer?.id;
  const [form, setForm] = useState({
    name: dealer?.name || '',
    place: dealer?.place || '',
    phone: dealer?.phone || '',
    email: dealer?.email || '',
    notes: dealer?.notes || '',
    color: dealer?.color || DEALER_COLORS[0].value,
  });
  const [errors, setErrors] = useState({});

  const avatarInitials = form.name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.place.trim()) e.place = 'Place is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { ...form, avatar: avatarInitials || 'D?' };
    if (isEdit) {
      updateDealer(dealer.id, payload);
    } else {
      saveDealer(payload);
    }
    onSaved();
    onClose();
  };

  const Field = ({ name, label, placeholder, icon: Icon, type = 'text', required }) => (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
        <Icon size={9} /> {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all placeholder:text-slate-300 text-[#0F172A] ${
          errors[name] ? 'border-red-400 bg-red-50' : 'border-slate-200'
        }`}
      />
      {errors[name] && <p className="text-red-400 text-[10px] font-bold mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Live avatar preview */}
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center font-black text-white text-sm shadow-lg`}>
              {avatarInitials || '?'}
            </div>
            <div>
              <h2 className="text-white font-black text-base">{isEdit ? 'Edit Dealer' : 'Add New Dealer'}</h2>
              <p className="text-slate-400 text-[10px] mt-0.5">{isEdit ? 'Update dealer profile' : 'Create a new dealer profile'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name + Place */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field name="name" label="Dealer Name" placeholder="e.g. Rajesh Motors" icon={FaUser} required />
            <Field name="place" label="Location / Place" placeholder="e.g. Mayur Vihar, Delhi" icon={FaMapMarkerAlt} required />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field name="phone" label="Contact Number" placeholder="+91 98100 XXXXX" icon={FaPhone} type="tel" required />
            <Field name="email" label="Email (optional)" placeholder="dealer@example.com" icon={FaEnvelope} type="email" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <FaStickyNote size={9} /> Notes
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Dealer specialisation, area, or any notes..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder:text-slate-300 text-[#0F172A] resize-none"
            />
          </div>

          {/* Avatar colour */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
              <FaPalette size={9} /> Avatar Colour
            </label>
            <div className="grid grid-cols-8 gap-2">
              {DEALER_COLORS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: opt.value }))}
                  title={opt.label}
                  className={`h-8 w-8 rounded-xl bg-gradient-to-br ${opt.value} transition-all hover:scale-110 ${
                    form.color === opt.value ? 'ring-2 ring-[#F59E0B] ring-offset-2 scale-110' : ''
                  } flex items-center justify-center`}
                >
                  {form.color === opt.value && <FaCheck className="text-white" size={10} />}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-black text-sm hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl font-black text-sm hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <FaCheck size={12} /> {isEdit ? 'Save Changes' : 'Add Dealer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ Dealer Card ══════ */
const DealerCard = ({ dealer, carCount, onEdit, onDelete }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    {/* Top colour band */}
    <div className={`h-2 w-full bg-gradient-to-r ${dealer.color}`} />

    <div className="p-5">
      {/* Avatar + name row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${dealer.color} flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0`}>
            {dealer.avatar}
          </div>
          <div>
            <h3 className="font-black text-[#0F172A] text-base leading-tight group-hover:text-[#F59E0B] transition-colors">
              {dealer.name}
            </h3>
            <p className="text-slate-400 text-[10px] font-bold flex items-center gap-1 mt-0.5">
              <FaMapMarkerAlt size={8} /> {dealer.place}
            </p>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onEdit(dealer)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
            title="Edit dealer"
          >
            <FaEdit size={13} />
          </button>
          <button
            onClick={() => onDelete(dealer.id)}
            className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
            title="Delete dealer"
          >
            <FaTrash size={13} />
          </button>
        </div>
      </div>

      {/* Contact details */}
      <div className="space-y-2 mb-4">
        <a
          href={`tel:${dealer.phone}`}
          className="flex items-center gap-2 text-sm text-[#0F172A] font-bold hover:text-[#F59E0B] transition-colors"
        >
          <div className="h-7 w-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <FaPhone className="text-green-500" size={11} />
          </div>
          {dealer.phone}
        </a>
        {dealer.email && (
          <a
            href={`mailto:${dealer.email}`}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#F59E0B] transition-colors font-medium"
          >
            <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FaEnvelope className="text-blue-400" size={11} />
            </div>
            <span className="truncate">{dealer.email}</span>
          </a>
        )}
      </div>

      {/* Notes */}
      {dealer.notes && (
        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
            <FaStickyNote size={8} /> Notes
          </p>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">{dealer.notes}</p>
        </div>
      )}

      {/* Car count badge */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <FaCar className="text-[#F59E0B]" size={12} />
          <span className="text-xs font-black text-[#0F172A]">{carCount} {carCount === 1 ? 'vehicle' : 'vehicles'} assigned</span>
        </div>
        <span className="text-[9px] font-bold text-slate-300">
          Added {new Date(dealer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════
   MAIN ManageDealers PAGE
══════════════════════════════ */
const ManageDealers = () => {
  const [dealers, setDealers] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    seedDemoDealer(); // Only seeds if empty
    setDealers(getDealers());
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('caromotors:dealerUpdated', handler);
    return () => window.removeEventListener('caromotors:dealerUpdated', handler);
  }, [refresh]);

  // Fetch cars to show how many are linked to each dealer
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:4000/api/cars');
        setCars(res.data.cars || res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCars();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this dealer? This will not affect any assigned cars.')) return;
    deleteDealer(id);
    refresh();
  };

  const handleEdit = (dealer) => {
    setEditingDealer(dealer);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDealer(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingDealer(null);
  };

  const getCarCount = (dealerId) => cars.filter(c => c.dealerId === dealerId).length;

  const filtered = dealers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.place?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search)
  );

  const totalCars = cars.length;
  const assignedCars = cars.filter(c => c.dealerId).length;

  return (
    <>
      {modalOpen && (
        <DealerModal
          dealer={editingDealer}
          onClose={handleModalClose}
          onSaved={refresh}
        />
      )}

      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#F59E0B] to-amber-600 p-3 rounded-2xl shadow-lg shadow-amber-200">
              <FaHandshake className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0F172A]">Dealers</h1>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                {dealers.length} {dealers.length === 1 ? 'dealer' : 'dealers'} registered
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-5 py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-200 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
          >
            <FaPlus size={13} /> Add Dealer
          </button>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Dealers', value: dealers.length, color: 'bg-blue-50 text-blue-700 border-blue-100', icon: FaHandshake },
            { label: 'Vehicles Assigned', value: assignedCars, color: 'bg-amber-50 text-amber-700 border-amber-100', icon: FaCar },
            { label: 'Unassigned Cars', value: totalCars - assignedCars, color: 'bg-slate-50 text-slate-600 border-slate-100', icon: FaCar },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 sm:p-4 border text-center`}>
              <s.icon className="mx-auto mb-1 opacity-60" size={16} />
              <p className="text-xl sm:text-2xl font-black">{loading ? '—' : s.value}</p>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide opacity-70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, location, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <FaTimes size={13} />
            </button>
          )}
        </div>

        {/* ── Dealer Cards Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <FaHandshake className="mx-auto text-slate-200 mb-4" size={48} />
            <h3 className="text-xl font-black text-[#0F172A] mb-2">
              {search ? 'No dealers match your search' : 'No dealers yet'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {search ? 'Try a different search term.' : 'Add your first dealer to get started.'}
            </p>
            {!search && (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-5 py-2.5 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-amber-200"
              >
                <FaPlus size={12} /> Add First Dealer
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(dealer => (
              <DealerCard
                key={dealer.id}
                dealer={dealer}
                carCount={getCarCount(dealer.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* ── Quick table view (compact, shows all) ── */}
        {filtered.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-[#0F172A] text-sm flex items-center gap-2">
                <FaHandshake className="text-[#F59E0B]" size={14} />
                Dealer Directory
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">{filtered.length} records</span>
            </div>
            {/* Mobile */}
            <div className="sm:hidden divide-y divide-slate-50">
              {filtered.map(d => (
                <div key={d.id} className="flex items-center gap-3 p-4">
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center font-black text-white text-xs flex-shrink-0`}>
                    {d.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#0F172A] text-sm truncate">{d.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate">{d.place} · {d.phone}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(d)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-all"><FaEdit size={12} /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><FaTrash size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Dealer', 'Location', 'Contact', 'Cars', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center font-black text-white text-xs flex-shrink-0`}>
                            {d.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A] text-sm">{d.name}</p>
                            {d.email && <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{d.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600 font-medium flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[#F59E0B]" size={10} /> {d.place}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <a href={`tel:${d.phone}`} className="text-sm font-bold text-[#0F172A] hover:text-[#F59E0B] transition-colors flex items-center gap-1">
                          <FaPhone className="text-green-500" size={10} /> {d.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-[#F59E0B]/10 text-[#0F172A] px-2.5 py-1 rounded-full">
                          <FaCar size={9} /> {getCarCount(d.id)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(d)}
                            className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => handleDelete(d.id)}
                            className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageDealers;