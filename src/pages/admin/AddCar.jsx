import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaTimes, FaPlus, FaTag, FaPalette, FaSmile, FaCheck } from 'react-icons/fa';
import {
  getAllCategories, saveCustomCategory, GRADIENT_OPTIONS, EMOJI_OPTIONS
} from '../../categoryStore';

/* ─── New Category Modal ─── */
const NewCategoryModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    label: '',
    emoji: '🚗',
    gradient: GRADIENT_OPTIONS[0].value,
    accent: GRADIENT_OPTIONS[0].accent,
    desc: '',
  });
  const [emojiOpen, setEmojiOpen] = useState(false);

  const handleGradientChange = (opt) => {
    setForm(f => ({ ...f, gradient: opt.value, accent: opt.accent }));
  };

  const handleSubmit = () => {
    if (!form.label.trim()) { alert('Please enter a category name.'); return; }
    const id = form.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCat = { ...form, id, isCustom: true };
    saveCustomCategory(newCat);
    // Dispatch custom event so Categories page picks it up immediately
    window.dispatchEvent(new Event('caromotors:categoryUpdated'));
    onCreated(newCat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">New Category</h2>
            <p className="text-slate-400 text-xs mt-0.5">Create a custom category for your inventory</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Preview card */}
          <div className={`relative rounded-2xl overflow-hidden h-24 bg-gradient-to-br ${form.gradient} flex items-center px-5 gap-4 shadow-lg`}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%)' }} />
            <span className="text-4xl relative z-10">{form.emoji}</span>
            <div className="relative z-10">
              <p className="text-white font-black text-lg leading-tight">{form.label || 'Category Name'}</p>
              <p className="text-white/60 text-xs">{form.desc || 'Description'}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Family Cars, Off-Road..."
              maxLength={30}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#F59E0B] text-[#0F172A] placeholder:text-slate-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={form.desc}
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
              placeholder="e.g. Perfect for family trips"
              maxLength={50}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#F59E0B] text-[#0F172A] placeholder:text-slate-300"
            />
          </div>

          {/* Emoji picker */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <FaSmile size={10} /> Emoji
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setEmojiOpen(o => !o)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-[#F59E0B] transition-all"
              >
                <span className="text-2xl">{form.emoji}</span>
                <span className="text-slate-400 text-xs">Change emoji</span>
              </button>
              {emojiOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-10 flex flex-wrap gap-1.5 w-64">
                  {EMOJI_OPTIONS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, emoji: e })); setEmojiOpen(false); }}
                      className={`text-2xl p-1.5 rounded-lg hover:bg-slate-100 transition-all ${form.emoji === e ? 'bg-[#F59E0B]/10 ring-2 ring-[#F59E0B]' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color/Gradient picker */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <FaPalette size={10} /> Color Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleGradientChange(opt)}
                  className={`relative h-10 rounded-xl bg-gradient-to-br ${opt.value} transition-all hover:scale-105 ${form.gradient === opt.value ? 'ring-2 ring-[#F59E0B] ring-offset-2 scale-105' : ''}`}
                  title={opt.label}
                >
                  {form.gradient === opt.value && (
                    <FaCheck className="absolute inset-0 m-auto text-white" size={10} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
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
              className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl font-black text-sm hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all flex items-center justify-center gap-2"
            >
              <FaPlus size={12} /> Create Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main AddCar Component ─── */
const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', price: '', year: '',
    fuelType: 'Petrol', kmDriven: '', location: '', description: '',
    tokenAmount: '', images: [], category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showNewCatModal, setShowNewCatModal] = useState(false);

  const refreshCategories = () => {
    // Exclude 'all' from the dropdown
    setCategories(getAllCategories().filter(c => c.id !== 'all'));
  };

  useEffect(() => {
    refreshCategories();
    const handler = () => refreshCategories();
    window.addEventListener('caromotors:categoryUpdated', handler);
    return () => window.removeEventListener('caromotors:categoryUpdated', handler);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:4000/api/cars', formData);
      alert('Vehicle listed successfully!');
      navigate('/admin/manage-cars');
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
      alert('Error adding car. Check console.');
    } finally {
      setSubmitting(false);
    }
  };

  const openWidget = () => {
    window.cloudinary.createUploadWidget(
      { cloudName: 'djsimcvht', uploadPreset: 'caromotors' },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }));
        }
      }
    ).open();
  };

  const removeImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleCategoryCreated = (newCat) => {
    refreshCategories();
    setFormData(f => ({ ...f, category: newCat.id }));
  };

  const selectedCat = categories.find(c => c.id === formData.category);

  return (
    <>
      {showNewCatModal && (
        <NewCategoryModal
          onClose={() => setShowNewCatModal(false)}
          onCreated={handleCategoryCreated}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl font-black text-[#0F172A]">Add New Vehicle</h1>
          <p className="text-slate-500 text-xs mt-0.5">Fill in the details to list a new car.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Section: Basic Info ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'title', placeholder: 'Ad Title (e.g. 2018 Honda City)' },
                { name: 'brand', placeholder: 'Brand (e.g. Honda)' },
                { name: 'model', placeholder: 'Model (e.g. City ZX CVT)' },
                { name: 'price', placeholder: 'Price (₹)', type: 'number' },
              ].map(f => (
                <input
                  key={f.name}
                  name={f.name}
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  onChange={handleChange}
                  value={formData[f.name]}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              ))}
            </div>
            <input
              name="tokenAmount"
              type="number"
              placeholder="Token Amount (₹) — e.g. 10000"
              onChange={handleChange}
              value={formData.tokenAmount}
              className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder:text-slate-400"
            />
          </div>

          {/* ── Section: Vehicle Details ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="year"
                type="number"
                placeholder="Year (e.g. 2019)"
                onChange={handleChange}
                value={formData.year}
                required
                className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder:text-slate-400"
              />
              <select
                name="fuelType"
                onChange={handleChange}
                value={formData.fuelType}
                className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>Electric</option>
              </select>
              <input
                name="kmDriven"
                type="number"
                placeholder="KM Driven"
                onChange={handleChange}
                value={formData.kmDriven}
                required
                className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder:text-slate-400"
              />
              <input
                name="location"
                placeholder="Location (e.g. Delhi)"
                onChange={handleChange}
                value={formData.location}
                required
                className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* ── Section: Category ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FaTag size={10} /> Category
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCatModal(true)}
                className="flex items-center gap-1.5 text-[10px] font-black text-[#F59E0B] hover:underline"
              >
                <FaPlus size={9} /> New Category
              </button>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {/* None option */}
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, category: '' }))}
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left ${
                  formData.category === ''
                    ? 'border-[#F59E0B] bg-[#F59E0B]/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-xl">🚗</span>
                <div>
                  <p className="text-[10px] font-black text-[#0F172A]">None / Auto</p>
                  <p className="text-[8px] text-slate-400">Auto-detect</p>
                </div>
                {formData.category === '' && <FaCheck className="ml-auto text-[#F59E0B]" size={10} />}
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, category: cat.id }))}
                  className={`relative flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left overflow-hidden ${
                    formData.category === cat.id
                      ? 'border-[#F59E0B] shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {formData.category === cat.id && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient || 'from-slate-800 to-slate-600'} opacity-10`} />
                  )}
                  <span className="text-xl relative z-10">{cat.emoji}</span>
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-[10px] font-black text-[#0F172A] truncate">{cat.label}</p>
                    {cat.isCustom && <p className="text-[8px] text-[#F59E0B] font-bold">Custom</p>}
                  </div>
                  {formData.category === cat.id && <FaCheck className="ml-auto text-[#F59E0B] relative z-10 flex-shrink-0" size={10} />}
                </button>
              ))}
            </div>

            {/* Selected category preview */}
            {selectedCat && (
              <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${selectedCat.gradient || 'from-slate-800 to-slate-600'} mt-2`}>
                <span className="text-2xl">{selectedCat.emoji}</span>
                <div>
                  <p className="text-white font-black text-xs">{selectedCat.label}</p>
                  <p className="text-white/60 text-[10px]">{selectedCat.desc || 'This car will appear in this category'}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Section: Photos ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Photos</h3>
            {formData.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {formData.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} className="h-16 w-20 object-cover rounded-xl border border-slate-200" alt="" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={openWidget}
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#F59E0B]/50 bg-[#F59E0B]/5 text-[#0F172A] py-3 rounded-xl font-bold text-sm hover:bg-[#F59E0B]/10 transition-all"
            >
              <FaCamera size={14} className="text-[#F59E0B]" />
              {formData.images.length > 0 ? `${formData.images.length} photo(s) — Add more` : 'Upload Photos'}
            </button>
          </div>

          {/* ── Section: Description ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</h3>
            <textarea
              name="description"
              placeholder="Describe the car's condition, features, history..."
              rows={4}
              onChange={handleChange}
              value={formData.description}
              required
              className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#F59E0B] hover:text-[#0F172A] active:scale-95 transition-all duration-300 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? 'Publishing...' : (<><FaPlus size={14} /> Publish Listing</>)}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCar;