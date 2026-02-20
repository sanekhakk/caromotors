import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaCamera, FaTimes, FaPlus, FaTag, FaPalette,
  FaSmile, FaCheck, FaHandshake, FaPhone, FaMapMarkerAlt,
  FaChevronDown, FaCog, FaUser
} from 'react-icons/fa';
import {
  getAllCategories, saveCustomCategory, GRADIENT_OPTIONS, EMOJI_OPTIONS
} from '../../categoryStore';
import { getDealers, seedDemoDealer } from '../../dealerStore';

/* ─── New Category Modal ─── */
const NewCategoryModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    label: '', emoji: '🚗',
    gradient: GRADIENT_OPTIONS[0].value, accent: GRADIENT_OPTIONS[0].accent, desc: '',
  });
  const [emojiOpen, setEmojiOpen] = useState(false);

  const handleSubmit = () => {
    if (!form.label.trim()) { alert('Please enter a category name.'); return; }
    const id = form.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCat = { ...form, id, isCustom: true };
    saveCustomCategory(newCat);
    window.dispatchEvent(new Event('caromotors:categoryUpdated'));
    onCreated(newCat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">New Category</h2>
            <p className="text-slate-400 text-xs mt-0.5">Create a custom vehicle category</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><FaTimes size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className={`rounded-2xl overflow-hidden h-20 bg-gradient-to-br ${form.gradient} flex items-center px-5 gap-4 shadow-lg`}>
            <span className="text-4xl">{form.emoji}</span>
            <div>
              <p className="text-white font-black text-base">{form.label || 'Category Name'}</p>
              <p className="text-white/60 text-xs">{form.desc || 'Description'}</p>
            </div>
          </div>
          <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            placeholder="Category name *"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] text-[#0F172A] placeholder:text-slate-300" />
          <input type="text" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            placeholder="Short description"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] text-[#0F172A] placeholder:text-slate-300" />
          <div className="relative">
            <button type="button" onClick={() => setEmojiOpen(o => !o)}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-[#F59E0B]">
              <span className="text-2xl">{form.emoji}</span>
              <span className="text-slate-400 text-xs">Emoji</span>
            </button>
            {emojiOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-10 flex flex-wrap gap-1.5 w-64">
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} type="button" onClick={() => { setForm(f => ({ ...f, emoji: e })); setEmojiOpen(false); }}
                    className={`text-2xl p-1.5 rounded-lg hover:bg-slate-100 ${form.emoji === e ? 'bg-[#F59E0B]/10 ring-2 ring-[#F59E0B]' : ''}`}>{e}</button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_OPTIONS.map(opt => (
              <button key={opt.value} type="button"
                onClick={() => setForm(f => ({ ...f, gradient: opt.value, accent: opt.accent }))}
                className={`h-10 rounded-xl bg-gradient-to-br ${opt.value} transition-all hover:scale-105 ${form.gradient === opt.value ? 'ring-2 ring-[#F59E0B] ring-offset-2 scale-105' : ''} flex items-center justify-center`}>
                {form.gradient === opt.value && <FaCheck className="text-white" size={10} />}
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-black text-sm">Cancel</button>
            <button type="button" onClick={handleSubmit}
              className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl font-black text-sm hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all flex items-center justify-center gap-2">
              <FaPlus size={12} /> Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main AddCar ─── */
const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', price: '', year: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    kmDriven: '', location: '',
    ownership: '',
    description: '',
    tokenAmount: '',
    images: [],
    category: '',
    dealerId: '',
  });
  const [submitting, setSubmitting]         = useState(false);
  const [categories, setCategories]         = useState([]);
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [dealers, setDealers]               = useState([]);
  const [dealerDropdownOpen, setDealerDropdownOpen] = useState(false);

  const refreshCategories = () => setCategories(getAllCategories().filter(c => c.id !== 'all'));

  useEffect(() => {
    refreshCategories();
    seedDemoDealer();
    setDealers(getDealers());
    const catH    = () => refreshCategories();
    const dealerH = () => setDealers(getDealers());
    window.addEventListener('caromotors:categoryUpdated', catH);
    window.addEventListener('caromotors:dealerUpdated', dealerH);
    return () => {
      window.removeEventListener('caromotors:categoryUpdated', catH);
      window.removeEventListener('caromotors:dealerUpdated', dealerH);
    };
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedDealer = dealers.find(d => d.id === formData.dealerId) || null;
      const payload = {
        ...formData,
        dealerId:    selectedDealer?.id    || '',
        dealerName:  selectedDealer?.name  || '',
        dealerPhone: selectedDealer?.phone || '',
        dealerPlace: selectedDealer?.place || '',
      };
      await axios.post('http://localhost:4000/api/cars', payload);
      alert('Vehicle listed successfully!');
      navigate('/admin/manage-cars');
    } catch (err) {
      console.error('Submit Error:', err.response?.data || err.message);
      alert('Error adding car. Check console.');
    } finally {
      setSubmitting(false);
    }
  };

  const openWidget = () => {
    window.cloudinary.createUploadWidget(
      { cloudName: 'djsimcvht', uploadPreset: 'caromotors' },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }));
        }
      }
    ).open();
  };

  const removeImage = idx => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const selectedCat    = categories.find(c => c.id === formData.category);
  const selectedDealer = dealers.find(d => d.id === formData.dealerId);

  const inputCls = "w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all placeholder:text-slate-400";
  const labelCls = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5";

  return (
    <>
      {showNewCatModal && (
        <NewCategoryModal onClose={() => setShowNewCatModal(false)} onCreated={() => refreshCategories()} />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0F172A]">Add New Vehicle</h1>
          <p className="text-slate-500 text-xs mt-0.5">Fill in all details to list a new car in the inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Basic Info ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Ad Title *</label>
                <input name="title" placeholder="e.g. 2019 Honda City — Single Owner" onChange={handleChange} value={formData.title} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Brand *</label>
                <input name="brand" placeholder="e.g. Honda" onChange={handleChange} value={formData.brand} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Model *</label>
                <input name="model" placeholder="e.g. City ZX CVT" onChange={handleChange} value={formData.model} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price (₹) *</label>
                <input name="price" type="number" placeholder="e.g. 650000" onChange={handleChange} value={formData.price} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Token Amount (₹)</label>
                <input name="tokenAmount" type="number" placeholder="e.g. 10000" onChange={handleChange} value={formData.tokenAmount} className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Vehicle Details ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className={labelCls}>Year *</label>
                <input name="year" type="number" placeholder="e.g. 2019" onChange={handleChange} value={formData.year} required className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Fuel Type *</label>
                <div className="relative">
                  <select name="fuelType" onChange={handleChange} value={formData.fuelType} className={`${inputCls} appearance-none pr-8`}>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                  </select>
                  <FaChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* ── NEW: Transmission dropdown ── */}
              <div>
                <label className={labelCls + ' flex items-center gap-1'}>
                  <FaCog size={9} /> Transmission *
                </label>
                <div className="relative">
                  <select name="transmission" onChange={handleChange} value={formData.transmission} className={`${inputCls} appearance-none pr-8`}>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT (Automatic)</option>
                    <option value="AMT">AMT (Auto-Gear Shift)</option>
                    <option value="DCT">DCT (Dual Clutch)</option>
                  </select>
                  <FaChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelCls}>KM Driven *</label>
                <input name="kmDriven" type="number" placeholder="e.g. 45000" onChange={handleChange} value={formData.kmDriven} required className={inputCls} />
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Location *</label>
                <input name="location" placeholder="e.g. Mayur Vihar, Delhi" onChange={handleChange} value={formData.location} required className={inputCls} />
              </div>
            </div>

            {/* ── NEW: Ownership text field ── */}
            <div>
              <label className={labelCls + ' flex items-center gap-1'}>
                <FaUser size={9} /> Ownership
              </label>
              <textarea
                name="ownership"
                placeholder="e.g. 1st Owner — all service records available&#10;2nd Owner — bought from Rajesh Motors in 2021"
                rows={3}
                onChange={handleChange}
                value={formData.ownership}
                className={`${inputCls} resize-none`}
              />
              <p className="text-[10px] text-slate-400 mt-1">Describe owner history, service records, any accidents, etc.</p>
            </div>
          </div>

          {/* ── Dealer Selection (admin-only, not shown publicly) ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FaHandshake size={10} /> Assign Dealer
              </h3>
              <a href="/admin/dealers"
                className="text-[10px] font-black text-[#F59E0B] hover:underline flex items-center gap-1">
                <FaPlus size={9} /> Manage Dealers
              </a>
            </div>
            {/* Privacy note */}
            <p className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3 flex items-center gap-1.5">
              <span className="text-amber-500">🔒</span>
              Dealer info is <strong>admin-only</strong> — it is never shown to website visitors.
            </p>

            {dealers.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <FaHandshake className="mx-auto text-slate-300 mb-2" size={24} />
                <p className="text-slate-400 text-xs font-bold mb-3">No dealers added yet.</p>
                <a href="/admin/dealers"
                  className="inline-flex items-center gap-1.5 bg-[#0F172A] text-white px-4 py-2 rounded-lg font-black text-xs hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all">
                  <FaPlus size={10} /> Add a Dealer First
                </a>
              </div>
            ) : (
              <>
                <div className="relative">
                  <button type="button" onClick={() => setDealerDropdownOpen(o => !o)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                      selectedDealer ? 'border-[#F59E0B] bg-[#F59E0B]/5' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}>
                    {selectedDealer ? (
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${selectedDealer.color} flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow`}>
                          {selectedDealer.avatar}
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A] text-sm">{selectedDealer.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 mt-0.5">
                            <FaMapMarkerAlt size={8} className="text-[#F59E0B]" /> {selectedDealer.place}
                            <span className="text-slate-300">·</span>
                            <FaPhone size={8} className="text-green-500" /> {selectedDealer.phone}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm font-medium">Select a dealer (optional)...</span>
                    )}
                    <FaChevronDown size={13} className={`text-slate-400 flex-shrink-0 transition-transform ${dealerDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dealerDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                      <button type="button"
                        onClick={() => { setFormData(f => ({ ...f, dealerId: '' })); setDealerDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 ${!formData.dealerId ? 'bg-slate-50' : ''}`}>
                        <div className="h-9 w-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0"><FaHandshake size={14} /></div>
                        <div>
                          <p className="font-bold text-slate-500 text-sm">No Dealer / Unassigned</p>
                          <p className="text-[10px] text-slate-400">Leave unassigned for now</p>
                        </div>
                        {!formData.dealerId && <FaCheck className="ml-auto text-[#F59E0B]" size={12} />}
                      </button>
                      {dealers.map(d => (
                        <button key={d.id} type="button"
                          onClick={() => { setFormData(f => ({ ...f, dealerId: d.id })); setDealerDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${formData.dealerId === d.id ? 'bg-[#F59E0B]/5' : ''}`}>
                          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow-sm`}>{d.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[#0F172A] text-sm">{d.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-2 mt-0.5">
                              <FaMapMarkerAlt size={7} /> {d.place} <span className="text-slate-200">·</span> <FaPhone size={7} /> {d.phone}
                            </p>
                          </div>
                          {formData.dealerId === d.id && <FaCheck className="text-[#F59E0B] flex-shrink-0" size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedDealer && (
                  <div className={`mt-3 flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r ${selectedDealer.color} shadow-md`}>
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-white text-sm flex-shrink-0">{selectedDealer.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-sm">{selectedDealer.name}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-white/70 text-[10px] font-bold flex items-center gap-1"><FaMapMarkerAlt size={8} />{selectedDealer.place}</span>
                        <span className="text-white/70 text-[10px] font-bold flex items-center gap-1"><FaPhone size={8} />{selectedDealer.phone}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFormData(f => ({ ...f, dealerId: '' }))}
                      className="text-white/60 hover:text-white p-1 flex-shrink-0"><FaTimes size={13} /></button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Category ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FaTag size={10} /> Category
              </h3>
              <button type="button" onClick={() => setShowNewCatModal(true)}
                className="text-[10px] font-black text-[#F59E0B] hover:underline flex items-center gap-1">
                <FaPlus size={9} /> New Category
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <button type="button" onClick={() => setFormData(f => ({ ...f, category: '' }))}
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left ${formData.category === '' ? 'border-[#F59E0B] bg-[#F59E0B]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                <span className="text-xl">🚗</span>
                <div><p className="text-[10px] font-black text-[#0F172A]">None / Auto</p><p className="text-[8px] text-slate-400">Auto-detect</p></div>
                {formData.category === '' && <FaCheck className="ml-auto text-[#F59E0B]" size={10} />}
              </button>
              {categories.map(cat => (
                <button key={cat.id} type="button" onClick={() => setFormData(f => ({ ...f, category: cat.id }))}
                  className={`relative flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left overflow-hidden ${formData.category === cat.id ? 'border-[#F59E0B] shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  {formData.category === cat.id && <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-10`} />}
                  <span className="text-xl relative z-10">{cat.emoji}</span>
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-[10px] font-black text-[#0F172A] truncate">{cat.label}</p>
                    {cat.isCustom && <p className="text-[8px] text-[#F59E0B] font-bold">Custom</p>}
                  </div>
                  {formData.category === cat.id && <FaCheck className="ml-auto text-[#F59E0B] relative z-10" size={10} />}
                </button>
              ))}
            </div>
            {selectedCat && (
              <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${selectedCat.gradient}`}>
                <span className="text-2xl">{selectedCat.emoji}</span>
                <div>
                  <p className="text-white font-black text-xs">{selectedCat.label}</p>
                  <p className="text-white/60 text-[10px]">{selectedCat.desc || 'This car will appear in this category'}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Photos ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Photos</h3>
            {formData.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {formData.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} className="h-16 w-20 object-cover rounded-xl border border-slate-200" alt="" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all">
                      <FaTimes size={8} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={openWidget}
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#F59E0B]/50 bg-[#F59E0B]/5 py-3.5 rounded-xl font-bold text-sm hover:bg-[#F59E0B]/10 transition-all text-[#0F172A]">
              <FaCamera size={14} className="text-[#F59E0B]" />
              {formData.images.length > 0 ? `${formData.images.length} photo(s) — Add more` : 'Upload Photos'}
            </button>
          </div>

          {/* ── Description ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</h3>
            <textarea name="description" placeholder="Describe the car's condition, features, extras, history..." rows={4}
              onChange={handleChange} value={formData.description} required className={`${inputCls} resize-none`} />
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#F59E0B] hover:text-[#0F172A] active:scale-95 transition-all duration-300 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? 'Publishing...' : (<><FaPlus size={14} /> Publish Listing</>)}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCar;