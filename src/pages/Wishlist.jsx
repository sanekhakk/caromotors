import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaEye, FaGasPump, FaCalendarAlt, FaTachometerAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlistCars, setWishlistCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/auth/me'); 
        setWishlistCars(res.data.wishlist);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (carId) => {
    setRemovingId(carId);
    try {
      await axios.put(`http://localhost:4000/api/auth/wishlist/${carId}`);
      setTimeout(() => {
        setWishlistCars(wishlistCars.filter(car => car._id !== carId));
        setRemovingId(null);
      }, 300);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="mb-12 animate-slide-in-top">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-r from-[#F59E0B] to-pink-500 p-4 rounded-2xl">
                <FaHeart className="text-white text-3xl animate-heart-beat" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-[#0F172A] tracking-tight">My Wishlist</h1>
              <p className="text-slate-500 font-medium mt-2">Your favorite vehicles in one place</p>
            </div>
          </div>
          <div className="h-1.5 w-32 bg-gradient-to-r from-[#F59E0B] to-pink-500 rounded-full"></div>
        </div>

        {/* Stats Card */}
        <div className="mb-12 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-black text-[#F59E0B]">{wishlistCars.length}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Saved Cars</p>
                </div>
                <div className="h-12 w-px bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-4xl font-black text-[#0F172A]">
                    ₹{wishlistCars.reduce((sum, car) => sum + (car.price || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Value</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600 font-bold">Updated Live</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-[#F59E0B]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-[#F59E0B] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin-reverse"></div>
            </div>
            <p className="text-slate-600 font-black text-lg animate-pulse">Loading wishlist...</p>
          </div>
        ) : wishlistCars.length === 0 ? (
          <div className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-300 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                <FaHeart className="text-pink-400 text-4xl" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#0F172A] mb-3">Your wishlist is empty</h3>
            <p className="text-slate-500 text-lg mb-8">Start adding your favorite cars to keep track of them!</p>
            <Link 
              to="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F59E0B] to-pink-500 text-white px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
            >
              Browse Vehicles <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistCars.map((car, index) => (
              <div 
                key={car._id} 
                className={`group relative animate-fade-in-up ${removingId === car._id ? 'animate-fade-out scale-95' : ''}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Animated Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F59E0B] via-pink-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                
                <div className="relative bg-white rounded-3xl border border-slate-200/50 overflow-hidden hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:-translate-y-3 transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/0 to-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    <img 
                      src={car.images[0]} 
                      alt={car.title} 
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-transform duration-700" 
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>
                    
                    {/* Brand Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#F59E0B] rounded-full blur-md animate-pulse-slow"></div>
                        <span className="relative block bg-white/95 backdrop-blur-md text-[#0F172A] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                          {car.brand}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => handleRemove(car._id)}
                      className="absolute top-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl text-pink-500 hover:text-red-600 hover:scale-125 hover:rotate-12 transition-all duration-300 z-20 group/remove"
                    >
                      <FaTrash className="group-hover/remove:animate-wiggle" />
                    </button>

                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center gap-2 shadow-lg">
                        <FaMapMarkerAlt className="text-[#F59E0B] text-sm" />
                        <span className="text-xs font-bold text-[#0F172A]">{car.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-[#0F172A] leading-tight group-hover:text-[#F59E0B] transition-colors mb-4 line-clamp-1">
                      {car.title}
                    </h3>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="flex flex-col items-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-300 group/stat">
                        <FaGasPump className="text-slate-400 text-sm mb-2 group-hover/stat:text-[#F59E0B] transition-colors" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">{car.fuelType}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-300 group/stat">
                        <FaCalendarAlt className="text-slate-400 text-sm mb-2 group-hover/stat:text-[#F59E0B] transition-colors" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">{car.year}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-300 group/stat">
                        <FaTachometerAlt className="text-slate-400 text-sm mb-2 group-hover/stat:text-[#F59E0B] transition-colors" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">{car.kmDriven.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-black text-[#0F172A]">₹{car.price.toLocaleString()}</p>
                      </div>
                      <Link 
                        to={`/car/${car._id}`} 
                        className="relative bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-[#F59E0B]/30 transition-all duration-300 overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-pink-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                        <span className="relative z-10 group-hover/btn:text-[#0F172A] flex items-center gap-2">
                          <FaEye /> View
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Footer */}
        {wishlistCars.length > 0 && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="bg-gradient-to-r from-[#F59E0B]/10 via-pink-500/10 to-purple-500/10 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50">
              <p className="text-slate-600 font-bold mb-4">Ready to schedule a viewing?</p>
              <Link 
                to="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F59E0B] to-pink-500 text-white px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
              >
                Browse More Vehicles <FaArrowRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;