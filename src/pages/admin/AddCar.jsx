import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaTimes, FaPlus } from 'react-icons/fa';

const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', price: '', year: '',
    fuelType: 'Petrol', kmDriven: '', location: '', description: '', tokenAmount: '', images: []
  });
  const [submitting, setSubmitting] = useState(false);

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

  const Field = ({ name, placeholder, type = 'text', required = true, children }) => (
    <div>
      {children || (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          value={formData[name]}
          required={required}
          className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all placeholder:text-slate-400"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[#0F172A]">Add New Vehicle</h1>
        <p className="text-slate-500 text-xs mt-0.5">Fill in the details to list a new car.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section: Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field name="title" placeholder="Ad Title (e.g. 2018 Honda City)" />
            <Field name="brand" placeholder="Brand (e.g. Honda)" />
            <Field name="model" placeholder="Model (e.g. City ZX CVT)" />
            <Field name="price" type="number" placeholder="Price (₹)" />
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

        {/* Section: Vehicle Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field name="year" type="number" placeholder="Year (e.g. 2019)" />
            <select name="fuelType" onChange={handleChange} value={formData.fuelType}
              className="w-full bg-slate-50 border border-slate-200 text-[#0F172A] px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]">
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>
            <Field name="kmDriven" type="number" placeholder="KM Driven" />
            <Field name="location" placeholder="Location (e.g. Delhi)" />
          </div>
        </div>

        {/* Section: Images */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Photos</h3>
          {/* Image previews */}
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
            className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#F59E0B]/50 bg-[#F59E0B]/5 text-[#0F172A] py-3 rounded-xl font-bold text-sm hover:bg-[#F59E0B]/10 transition-all">
            <FaCamera size={14} className="text-[#F59E0B]" />
            {formData.images.length > 0 ? `${formData.images.length} photo(s) — Add more` : 'Upload Photos'}
          </button>
        </div>

        {/* Description */}
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
  );
};

export default AddCar;