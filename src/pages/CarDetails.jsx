import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaWhatsapp, FaCheckCircle, FaGasPump, FaCalendarAlt,
  FaTachometerAlt, FaMapMarkerAlt, FaCar, FaArrowLeft,
  FaShieldAlt, FaChevronLeft, FaChevronRight, FaCog, FaUser
} from 'react-icons/fa';
import api from '../api';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Public endpoint — dealer fields are stripped server-side
    api.get(`/cars/${id}`).then(res => setCar(res.data)).catch(console.error);
  }, [id]);

  if (!car) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-[#F59E0B]/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-[#F59E0B] rounded-full animate-spin" />
      </div>
      <p className="text-slate-600 font-black text-sm animate-pulse">Loading vehicle details...</p>
    </div>
  );

  const handleWhatsAppEnquiry = () => {
    const phoneNumber = "91XXXXXXXXXX";
    const message = `Hi, I am interested in the ${car.title} priced at ₹${car.price.toLocaleString()}. Link: ${window.location.href}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post('http://localhost:4000/api/payment/order', { amount: car.tokenAmount });
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: order.currency,
        name: "Caromotors",
        description: `Token for ${car.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post('http://localhost:4000/api/bookings', {
              carId: car._id, tokenAmount: car.tokenAmount, paymentId: response.razorpay_payment_id
            });
            alert("Booking Successful! We will contact you shortly.");
          } catch { alert("Payment recorded, but booking failed. Contact support."); }
        },
        prefill: { name: "User Name", email: "user@example.com" },
        theme: { color: "#F59E0B" },
      };
      new window.Razorpay(options).open();
    } catch (err) { console.error("Payment Error:", err); }
  };

  const prevImage = () => setSelectedImage(p => (p - 1 + car.images.length) % car.images.length);
  const nextImage = () => setSelectedImage(p => (p + 1) % car.images.length);

  // ── Key feature tiles — dealer info is intentionally excluded ──
  const features = [
    { icon: FaGasPump,       label: 'Fuel Type',     value: car.fuelType },
    { icon: FaCalendarAlt,   label: 'Year',           value: car.year },
    { icon: FaTachometerAlt, label: 'KM Driven',      value: `${car.kmDriven?.toLocaleString()} km` },
    { icon: FaMapMarkerAlt,  label: 'Location',       value: car.location },
    // New fields
    { icon: FaCog,           label: 'Transmission',   value: car.transmission || 'Manual' },
    { icon: FaUser,          label: 'Ownership',      value: car.ownership    || '—', wide: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#F59E0B] transition-colors mb-4 text-sm font-bold">
          <FaArrowLeft size={12} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

          {/* ── Gallery ── */}
          <div className="lg:col-span-3 space-y-3">

            {/* Main image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src={car.images[selectedImage]} alt={car.title}
                className="w-full h-56 sm:h-80 object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-white/95 text-[#0F172A] text-[10px] font-black px-3 py-1 rounded-full shadow">{car.brand}</span>
                <span className="bg-green-500/95 text-white text-[10px] font-black px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <FaCheckCircle size={8} /> Available
                </span>
              </div>
              {car.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-all">
                    <FaChevronLeft size={12} />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-all">
                    <FaChevronRight size={12} />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {car.images.map((_, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`rounded-full transition-all ${i === selectedImage ? 'w-5 h-2 bg-[#F59E0B]' : 'w-2 h-2 bg-white/60'}`} />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {car.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 rounded-xl overflow-hidden transition-all ${selectedImage === i ? 'ring-2 ring-[#F59E0B] scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <img src={img} className="h-14 w-20 sm:h-16 sm:w-24 object-cover" alt="" />
                </button>
              ))}
            </div>

            {/* ── Key Features ── */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-base font-black text-[#0F172A] mb-3">Key Features</h3>

              {/* 4-column grid for the first 4 tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {features.filter(f => !f.wide).map((f, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl text-center">
                    <f.icon className="text-[#F59E0B] mx-auto mb-1 text-sm" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">{f.label}</p>
                    <p className="text-xs font-black text-[#0F172A] truncate">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Wide tile for Ownership (full-width) */}
              {features.filter(f => f.wide).map((f, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <f.icon className="text-[#F59E0B] mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">{f.label}</p>
                      <p className="text-xs font-black text-[#0F172A] leading-relaxed whitespace-pre-wrap">{f.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Info & CTA ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">

              {/* Title */}
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight">{car.title}</h1>
                <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                  <FaCar className="text-[#F59E0B]" /> {car.brand} • {car.model}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 p-4 rounded-xl mb-4 border border-[#F59E0B]/20">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Asking Price</p>
                <p className="text-3xl sm:text-4xl font-black text-[#0F172A]">₹{car.price.toLocaleString()}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <FaShieldAlt className="text-green-500 text-xs" />
                  <span className="text-xs text-slate-500 font-bold">Best price guaranteed</span>
                </div>
              </div>

              {/* Quick spec strip */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  car.fuelType,
                  car.transmission || 'Manual',
                  `${car.year}`,
                  `${(car.kmDriven / 1000).toFixed(0)}k km`,
                ].map(tag => (
                  <span key={tag} className="text-[10px] font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mb-4 pb-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#0F172A] mb-2">Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{car.description}</p>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <button onClick={handleWhatsAppEnquiry}
                  className="w-full bg-green-500 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/30">
                  <FaWhatsapp size={18} /> Enquire on WhatsApp
                </button>
                <button onClick={handlePayment}
                  className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#F59E0B] hover:text-[#0F172A] active:scale-95 transition-all shadow-lg">
                  <FaCheckCircle size={16} />
                  Pay Token (₹{car.tokenAmount?.toLocaleString() || '10,000'})
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                {[{ e: '✓', t: 'Verified' }, { e: '⚡', t: 'Quick Sale' }, { e: '🛡️', t: 'Secure' }].map((b, i) => (
                  <div key={i}>
                    <div className="text-xl mb-0.5">{b.e}</div>
                    <p className="text-[10px] font-bold text-slate-500">{b.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;