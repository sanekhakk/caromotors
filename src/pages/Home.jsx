import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaSearch, FaFilter, FaGasPump, FaCalendarAlt, FaTachometerAlt, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';
import logolight from '../assets/logolight.png';
import api from '../api';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { user } = useContext(AuthContext);
  
  const [filters, setFilters] = useState({
    brand: '',
    maxPrice: '',
    search: ''
  });

  // Hero carousel content
  const heroSlides = [
    {
      type: 'text',
      title: 'Find Your',
      highlight: 'Dream Drive',
      subtitle: 'Premium quality pre-owned vehicles. Honest deals, exceptional service, and a seamless buying experience.'
    },
    {
      type: 'text',
      title: 'Discover Your',
      highlight: 'Perfect Ride',
      subtitle: 'Carefully curated collection of premium vehicles. Your dream car awaits with transparent pricing and trusted service.'
    },
    {
      type: 'logo',
      // Logo will be displayed
    }
  ];

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars',{ 
        params: { 
          brand: filters.brand, 
          maxPrice: filters.maxPrice,
          page: page 
        } 
      });

      const fetchedCars = res.data.cars || [];
      setTotalPages(res.data.totalPages || 1);

      const filteredData = fetchedCars.filter(car => 
        car.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      );

      setCars(filteredData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (e, carId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.put(`http://localhost:4000/api/auth/wishlist/${carId}`);
      const updatedUser = { ...user, wishlist: res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); 
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters.brand, filters.maxPrice, filters.search, page]);

  useEffect(() => {
    setPage(1);
  }, [filters.brand, filters.maxPrice, filters.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-24 px-4 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
        </div>
        
        {/* Enhanced Floating Orbs with Multiple Layers */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           {/* Large Orbs */}
           <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-radial from-[#F59E0B]/30 to-transparent rounded-full blur-[120px] animate-float"></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-radial from-blue-500/30 to-transparent rounded-full blur-[100px] animate-float-delayed"></div>
           
           {/* Medium Orbs */}
           <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-[80px] animate-float-slow"></div>
           <div className="absolute bottom-[30%] right-[15%] w-[400px] h-[400px] bg-gradient-radial from-pink-500/20 to-transparent rounded-full blur-[90px] animate-float-reverse"></div>
           
           {/* Small Orbs */}
           <div className="absolute top-[40%] right-[25%] w-[250px] h-[250px] bg-gradient-radial from-[#FBBF24]/25 to-transparent rounded-full blur-[60px] animate-float-delayed"></div>
           <div className="absolute bottom-[10%] left-[30%] w-[200px] h-[200px] bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-[70px] animate-float"></div>
        </div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-[#F59E0B]/40 rounded-full animate-particle-float"></div>
          <div className="absolute top-[25%] right-[30%] w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-particle-float-delayed"></div>
          <div className="absolute top-[60%] left-[15%] w-2 h-2 bg-purple-400/40 rounded-full animate-particle-float-slow"></div>
          <div className="absolute top-[70%] right-[20%] w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-particle-float"></div>
          <div className="absolute top-[35%] left-[60%] w-1 h-1 bg-[#FBBF24]/40 rounded-full animate-particle-float-delayed"></div>
          <div className="absolute top-[80%] right-[45%] w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-particle-float-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Animated Title with Carousel */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="text-[#F59E0B] font-black uppercase tracking-[0.3em] text-xs animate-pulse-glow">
                Premium Quality Vehicles
              </span>
            </div>
            
            {/* Hero Carousel Container */}
            <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 md:left-8 z-20 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white hover:text-[#F59E0B] transition-all duration-300 group"
                aria-label="Previous slide"
              >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Next Button */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-4 md:right-8 z-20 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white hover:text-[#F59E0B] transition-all duration-300 group"
                aria-label="Next slide"
              >
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : index < currentSlide
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  {slide.type === 'text' ? (
                    <>
                      <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        {slide.title}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] animate-gradient-x">
                          {slide.highlight}
                        </span>
                      </h1>
                      <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto px-4">
                        {slide.subtitle}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative group">
                        <div className="absolute -inset-4  rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>
                        <img 
                          src={logolight} 
                          alt="Caromotors Logo" 
                          className="h-40 md:h-100 relative z-10 animate-float"
                        />
                      </div>
                      <p className="text-slate-300 text-xl md:text-2xl font-black mt-8 tracking-wide">
                        Your Trusted Car Partner
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Clean Glassmorphism Filter Bar */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="relative group">
              {/* Subtle Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B]/20 via-transparent to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-1000"></div>
              
              <div className="relative bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/20 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Search Input with Animation */}
                  <div className="relative group/input">
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover/input:text-[#F59E0B] transition-colors z-10" />
                    <input 
                      type="text" 
                      placeholder="Search model..." 
                      className="relative w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all placeholder:text-slate-500 hover:bg-white/10"
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                  </div>

                  {/* Brand Select with Animation */}
                  <div className="relative group/select">
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300"></div>
                    <select 
                      className="relative w-full bg-white/5 border border-white/10 text-slate-300 px-4 py-4 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-white/10"
                      onChange={(e) => setFilters({...filters, brand: e.target.value})}
                    >
                      <option value="" className="bg-[#0F172A]">All Brands</option>
                      <option value="Honda" className="bg-[#0F172A]">Honda</option>
                      <option value="Toyota" className="bg-[#0F172A]">Toyota</option>
                      <option value="Maruti" className="bg-[#0F172A]">Maruti</option>
                      <option value="Hyundai" className="bg-[#0F172A]">Hyundai</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Price Input with Animation */}
                  <div className="relative group/price">
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover/price:opacity-100 transition-opacity duration-300"></div>
                    <input 
                      type="number" 
                      placeholder="Max Price (₹)" 
                      className="relative w-full bg-white/5 border border-white/10 text-white px-4 py-4 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all placeholder:text-slate-500 hover:bg-white/10"
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>

                  {/* Animated Filter Button */}
                  <button className="relative bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] font-black rounded-xl hover:shadow-2xl hover:shadow-[#F59E0B]/50 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group/btn">
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                    <FaFilter className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
                    <span className="relative z-10">Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Main Inventory Content */}
      <div className="relative mx-20 px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="animate-slide-in-left">
            <span className="text-[#F59E0B] font-black uppercase tracking-[0.25em] text-xs animate-pulse-glow">Our Inventory</span>
            <h2 className="text-5xl font-black text-[#0F172A] mt-3 tracking-tight">
              Available Vehicles
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#F59E0B] to-transparent mt-4 rounded-full"></div>
          </div>
          <div className="animate-slide-in-right">
            <div className="bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-200/50 shadow-lg">
              <p className="text-slate-600 font-bold text-sm">
                Showing <span className="text-[#F59E0B]">{cars.length}</span> vehicles
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            {/* Advanced Loading Animation */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-[#F59E0B]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-[#F59E0B] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin-reverse"></div>
            </div>
            <p className="text-slate-600 font-black text-lg animate-pulse">Scanning Inventory...</p>
            <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car, index) => (
                <div 
                  key={car._id} 
                  className="group relative animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onMouseEnter={() => setHoveredCard(car._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F59E0B] via-purple-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                  
                  <div className="relative bg-white rounded-3xl border border-slate-200/50 overflow-hidden hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:-translate-y-3 transition-all duration-500 backdrop-blur-sm">
                    {/* Image Container with Parallax Effect */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/0 to-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img 
                        src={car.images[0]} 
                        crossOrigin="anonymous"
                        alt={car.title} 
                        className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-transform duration-700" 
                      />
                      
                      {/* Animated Overlay Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>
                      
                      {/* Premium Badge with Pulse */}
                      <div className="absolute top-4 left-4 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#F59E0B] rounded-full blur-md animate-pulse-slow"></div>
                          <span className="relative block bg-white/95 backdrop-blur-md text-[#0F172A] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                            {car.brand}
                          </span>
                        </div>
                      </div>

                      {/* Wishlist Button with Heart Animation */}
                      {user && user.role !== 'admin' && (
                        <button 
                          onClick={(e) => handleWishlistToggle(e, car._id)}
                          className="absolute top-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl text-slate-400 hover:text-red-500 hover:scale-125 transition-all duration-300 z-20 group/heart"
                        >
                          {user.wishlist?.includes(car._id) ? (
                            <FaHeart className="text-red-500 animate-heart-beat" />
                          ) : (
                            <FaRegHeart className="group-hover/heart:animate-wiggle" />
                          )}
                        </button>
                      )}

                      {/* Hover Stats Overlay */}
                      <div className={`absolute bottom-4 left-4 right-4 z-20 transform transition-all duration-500 ${hoveredCard === car._id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center justify-around">
                          <div className="text-center">
                            <FaStar className="text-[#F59E0B] mx-auto mb-1 text-xs" />
                            <span className="text-[10px] font-bold text-[#0F172A]">Premium</span>
                          </div>
                          <div className="text-center">
                            <FaMapMarkerAlt className="text-slate-400 mx-auto mb-1 text-xs" />
                            <span className="text-[10px] font-bold text-[#0F172A]">{car.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Container with Staggered Animation */}
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-[#0F172A] leading-tight group-hover:text-[#F59E0B] transition-colors line-clamp-1">
                          {car.title}
                        </h3>
                      </div>
                      
                      {/* Animated Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-8">
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
                          <span className="text-[10px] font-black text-slate-600 uppercase">{car.kmDriven.toLocaleString()} KM</span>
                        </div>
                      </div>

                      {/* Price and CTA with Advanced Animation */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Price</p>
                          <p className="text-3xl font-black text-[#0F172A] animate-number-roll">₹{car.price.toLocaleString()}</p>
                        </div>
                        <Link 
                          to={`/car/${car._id}`} 
                          className="relative bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-[#F59E0B]/30 transition-all duration-300 overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                          <span className="relative z-10 group-hover/btn:text-[#0F172A]">View Details</span>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300">
                            →
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Pagination with Advanced Animation */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-24 space-x-3">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 ${
                    page === 1 
                      ? 'text-slate-300 border-slate-200 cursor-not-allowed' 
                      : 'text-[#0F172A] border-slate-300 hover:border-[#F59E0B] hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#FBBF24] hover:text-white shadow-lg hover:shadow-[#F59E0B]/30 hover:scale-110'
                  }`}
                >
                  <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border-2 border-slate-200 shadow-xl">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`min-w-[3rem] h-12 rounded-xl text-sm font-black transition-all duration-300 ${
                        page === i + 1 
                          ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] shadow-lg shadow-[#F59E0B]/40 scale-110' 
                          : 'text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 hover:scale-105'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 ${
                    page === totalPages 
                      ? 'text-slate-300 border-slate-200 cursor-not-allowed' 
                      : 'text-[#0F172A] border-slate-300 hover:border-[#F59E0B] hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#FBBF24] hover:text-white shadow-lg hover:shadow-[#F59E0B]/30 hover:scale-110'
                  }`}
                >
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}

        {!loading && cars.length === 0 && (
          <div className="text-center py-40 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-300 animate-fade-in">
             <div className="relative inline-block mb-8">
               <div className="absolute inset-0 bg-[#F59E0B]/20 blur-2xl rounded-full animate-pulse-slow"></div>
               <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <FaSearch className="text-slate-400 text-4xl" />
               </div>
             </div>
             <h3 className="text-3xl font-black text-[#0F172A] mb-3">No matches found</h3>
             <p className="text-slate-500 text-lg mb-8">Try adjusting your filters or search terms.</p>
             <button 
               onClick={() => setFilters({brand: '', maxPrice: '', search: ''})}
               className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-[#F59E0B]/40 hover:scale-105 transition-all duration-300"
             >
               Clear all filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;