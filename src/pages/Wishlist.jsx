import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaEye, FaGasPump, FaCalendarAlt, FaTachometerAlt, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlistCars, setWishlistCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/api/auth/me')
      .then(res => { setWishlistCars(res.data.wishlist); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (carId) => {
    setRemovingId(carId);
    try {
      await axios.put(`http://localhost:4000/api/auth/wishlist/${carId}`);
      setTimeout(() => {
        setWishlistCars(prev => prev.filter(c => c._id !== carId));
        setRemovingId(null);
      }, 300);
    } catch { setRemovingId(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-gradient-to-r from-[#F59E0B] to-pink-500 p-3 rounded-xl">
            <FaHeart className="text-white text-lg animate-heart-beat" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">My Wishlist</h1>
            <p className="text-slate-400 text-xs font-medium">Your saved vehicles</p>
          </div>
        </div>

        {/* Stats strip */}
        {!loading && wishlistCars.length > 0 && (
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm mb-5 flex items-center gap-5">
            <div className="text-center">
              <p className="text-2xl font-black text-[#F59E0B]">{wishlistCars.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Saved</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-lg font-black text-[#0F172A]">
                ₹{(wishlistCars.reduce((s, c) => s + (c.price || 0), 0) / 100000).toFixed(1)}L
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Value</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 bg-slate-200"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlistCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <FaHeart className="mx-auto text-pink-200 text-5xl mb-4" />
            <h3 className="text-xl font-black text-[#0F172A] mb-2">Your wishlist is empty</h3>
            <p className="text-slate-500 text-sm mb-6">Save your favourite cars here.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F59E0B] to-pink-500 text-white px-6 py-3 rounded-2xl font-black text-sm">
              Browse Vehicles <FaArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {wishlistCars.map((car, index) => (
              <div
                key={car._id}
                className={`group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${removingId === car._id ? 'opacity-0 scale-95' : 'opacity-100'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative h-28 sm:h-36 overflow-hidden">
                  <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute top-2 left-2 bg-white/95 text-[#0F172A] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    {car.brand}
                  </span>
                  <button
                    onClick={() => handleRemove(car._id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow text-pink-500 hover:text-red-600 hover:scale-110 transition-all"
                  >
                    <FaTrash size={10} />
                  </button>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[#F59E0B] text-[9px]" />
                    <span className="text-white text-[9px] font-bold truncate max-w-[70px]">{car.location}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-2.5 sm:p-3">
                  <h3 className="text-xs sm:text-sm font-black text-[#0F172A] line-clamp-1 mb-1.5 group-hover:text-[#F59E0B] transition-colors">
                    {car.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-500 font-bold mb-2.5">
                    <span><FaGasPump className="inline mr-0.5" />{car.fuelType}</span>
                    <span className="text-slate-300">•</span>
                    <span>{car.year}</span>
                    <span className="text-slate-300">•</span>
                    <span>{(car.kmDriven / 1000).toFixed(0)}k KM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold">Price</p>
                      <p className="text-sm font-black text-[#0F172A]">₹{(car.price / 100000).toFixed(1)}L</p>
                    </div>
                    <Link
                      to={`/car/${car._id}`}
                      className="bg-[#0F172A] text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all flex items-center gap-1"
                    >
                      <FaEye size={9} /> View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlistCars.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F59E0B] to-pink-500 text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all">
              Browse More <FaArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;