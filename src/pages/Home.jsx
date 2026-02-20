import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight,
  FaSearch, FaGasPump, FaCalendarAlt, FaTachometerAlt,
  FaMapMarkerAlt, FaSlidersH, FaTimes, FaShieldAlt,
  FaHandshake, FaWhatsapp, FaCheckCircle, FaStar,
  FaPhoneAlt, FaArrowRight
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import logolight from '../assets/logolight.png';
import api from '../api';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({ brand: '', maxPrice: '', search: '' });

  const heroSlides = [
    { type: 'text', title: 'Find Your', highlight: 'Dream Drive', subtitle: 'Premium pre-owned vehicles. Honest deals, exceptional service.' },
    { type: 'text', title: 'Discover Your', highlight: 'Perfect Ride', subtitle: 'Carefully curated collection with transparent pricing.' },
    { type: 'image', src: logolight, caption: 'Trusted. Transparent. Premium.' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars', {
        params: { brand: filters.brand, maxPrice: filters.maxPrice, page }
      });
      const fetchedCars = res.data.cars || [];
      setTotalPages(res.data.totalPages || 1);
      const filtered = fetchedCars.filter(car =>
        car.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      );
      setCars(filtered);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
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

  const clearFilters = () => {
    setFilters({ brand: '', maxPrice: '', search: '' });
    setShowFilters(false);
  };

  const hasActiveFilters = filters.brand || filters.maxPrice || filters.search;

  useEffect(() => { fetchCars(); }, [filters.brand, filters.maxPrice, filters.search, page]);
  useEffect(() => { setPage(1); }, [filters.brand, filters.maxPrice, filters.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">

      {/* ══════════════════════════════
          HERO SECTION
      ══════════════════════════════ */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern animate-grid-move pointer-events-none"></div>
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-[#F59E0B]/20 rounded-full blur-[100px] animate-float pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[80px] animate-float-delayed pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8 md:pt-16 md:pb-12">

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="text-[#F59E0B] font-black uppercase tracking-[0.25em] text-[10px] sm:text-xs animate-pulse-glow">
              Premium Quality Vehicles
            </span>
          </div>

          {/* ── Carousel ── */}
          <div className="relative min-h-[160px] sm:min-h-[200px] md:min-h-[260px] flex items-center justify-center overflow-hidden">
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 px-4 ${
                  i === currentSlide ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                {slide.type === 'image' ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={slide.src}
                      alt="Caromotors"
                      className="h-20 sm:h-28 md:h-36 object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-float"
                    />
                    <p className="text-slate-300 font-black text-base sm:text-lg md:text-2xl tracking-wide">
                      {slide.caption}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                      {slide.title}{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] animate-gradient-x">
                        {slide.highlight}
                      </span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-3 max-w-xl mx-auto">
                      {slide.subtitle}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 h-2 bg-[#F59E0B]' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>

          {/* ── Filter Bar ── */}
          <div className="mt-8 md:mt-10">

            {/* MOBILE: search + toggle button */}
            <div className="flex gap-2 md:hidden">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search model or title..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:outline-none text-sm"
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  value={filters.search}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all duration-200 flex-shrink-0 ${
                  showFilters || filters.brand || filters.maxPrice
                    ? 'bg-[#F59E0B] border-[#F59E0B] text-[#0F172A]'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <FaSlidersH size={14} />
                <span>Filter</span>
              </button>
            </div>

            {/* MOBILE: Collapsible extra filters */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-48 mt-2' : 'max-h-0'}`}>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <select
                  className="w-full bg-white/10 border border-white/20 text-slate-300 px-3 py-3 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:outline-none text-sm appearance-none"
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  value={filters.brand}
                >
                  <option value="" className="bg-[#0F172A]">All Brands</option>
                  <option value="Honda" className="bg-[#0F172A]">Honda</option>
                  <option value="Toyota" className="bg-[#0F172A]">Toyota</option>
                  <option value="Maruti" className="bg-[#0F172A]">Maruti</option>
                  <option value="Hyundai" className="bg-[#0F172A]">Hyundai</option>
                </select>
                <input
                  type="number"
                  placeholder="Max Price (₹)"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 px-3 py-3 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:outline-none text-sm"
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  value={filters.maxPrice}
                />
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-xs text-red-400 font-bold flex items-center gap-1.5">
                  <FaTimes size={9} /> Clear all filters
                </button>
              )}
            </div>

            {/* DESKTOP: Full 4-column filter bar */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3">
                <div className="grid grid-cols-4 gap-3">
                  {/* Search — spans 2 cols */}
                  <div className="relative col-span-2">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search by model or title..."
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 pl-11 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:outline-none text-sm transition-all hover:bg-white/10"
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      value={filters.search}
                    />
                  </div>
                  {/* Brand */}
                  <select
                    className="w-full bg-white/5 border border-white/10 text-slate-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:outline-none text-sm appearance-none cursor-pointer hover:bg-white/10 transition-all"
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    value={filters.brand}
                  >
                    <option value="" className="bg-[#0F172A]">All Brands</option>
                    <option value="Honda" className="bg-[#0F172A]">Honda</option>
                    <option value="Toyota" className="bg-[#0F172A]">Toyota</option>
                    <option value="Maruti" className="bg-[#0F172A]">Maruti</option>
                    <option value="Hyundai" className="bg-[#0F172A]">Hyundai</option>
                  </select>
                  {/* Max Price */}
                  <input
                    type="number"
                    placeholder="Max Price (₹)"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#F59E0B] focus:outline-none text-sm hover:bg-white/10 transition-all"
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    value={filters.maxPrice}
                  />
                </div>
                {hasActiveFilters && (
                  <div className="mt-2 px-1">
                    <button onClick={clearFilters} className="text-xs text-red-400 font-bold flex items-center gap-1.5 hover:text-red-300 transition-colors">
                      <FaTimes size={9} /> Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          INVENTORY SECTION
      ══════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Section header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[#F59E0B] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs animate-pulse-glow">
              Our Inventory
            </span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-[#0F172A] mt-1 tracking-tight">
              Recently Added
            </h2>
            <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-[#F59E0B] to-transparent rounded-full mt-2"></div>
          </div>
          {!loading && (
            <div className="flex items-center gap-2">
              {filters.brand && (
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-black bg-[#F59E0B]/15 text-[#0F172A] px-3 py-1.5 rounded-full border border-[#F59E0B]/30">
                  {filters.brand}
                  <button onClick={() => setFilters({ ...filters, brand: '' })}><FaTimes size={8} /></button>
                </span>
              )}
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200 px-3 sm:px-5 py-2 rounded-full shadow-sm">
                <p className="text-slate-600 font-bold text-xs sm:text-sm">
                  <span className="text-[#F59E0B] font-black">{cars.length}</span> vehicles
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Car Row Carousel ── */}
        <CarRowCarousel
          cars={cars}
          loading={loading}
          user={user}
          clearFilters={clearFilters}
          handleWishlistToggle={handleWishlistToggle}
        />

      </div>

      {/* ══════════════════════════════
          ABOUT CAROMOTORS SECTION
      ══════════════════════════════ */}
      <AboutSection />

    </div>
  );
};

/* ─────────────────────────────────────────
   CAR ROW CAROUSEL — one row at a time,
   arrows to navigate prev/next row
───────────────────────────────────────── */
const CarCard = ({ car, user, handleWishlistToggle }) => (
  <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
    {/* Image */}
    <div className="relative h-28 sm:h-40 md:h-44 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/0 to-[#0F172A]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
      <img
        src={car.images[0]}
        crossOrigin="anonymous"
        alt={car.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      {/* Brand */}
      <span className="absolute top-2 left-2 z-20 bg-white/95 text-[#0F172A] text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
        {car.brand}
      </span>

      {/* Wishlist */}
      {user && user.role !== 'admin' && (
        <button
          onClick={(e) => handleWishlistToggle(e, car._id)}
          className="absolute top-2 right-2 z-20 p-1.5 sm:p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition-all"
        >
          {user.wishlist?.includes(car._id)
            ? <FaHeart className="text-red-500 text-[10px] sm:text-xs" />
            : <FaRegHeart className="text-slate-400 text-[10px] sm:text-xs" />}
        </button>
      )}

      {/* Location */}
      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1">
        <FaMapMarkerAlt className="text-[#F59E0B] text-[9px]" />
        <span className="text-white text-[9px] font-bold truncate max-w-[70px] sm:max-w-[90px]">{car.location}</span>
      </div>
    </div>

    {/* Body */}
    <div className="p-2.5 sm:p-3 md:p-4">
      <h3 className="text-xs sm:text-sm md:text-base font-black text-[#0F172A] leading-tight mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-[#F59E0B] transition-colors duration-200">
        {car.title}
      </h3>

      {/* Stats */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-slate-500 font-bold mb-2.5 sm:mb-3 flex-wrap">
        <span className="flex items-center gap-0.5">
          <FaGasPump className="text-slate-400" /> {car.fuelType}
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-0.5">
          <FaCalendarAlt className="text-slate-400" /> {car.year}
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-0.5">
          <FaTachometerAlt className="text-slate-400" /> {(car.kmDriven / 1000).toFixed(0)}k km
        </span>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-slate-100">
        <div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Price</p>
          <p className="text-sm sm:text-base md:text-lg font-black text-[#0F172A]">
            ₹{(car.price / 100000).toFixed(1)}L
          </p>
        </div>
        <Link
          to={`/car/${car._id}`}
          className="relative bg-[#0F172A] text-white text-[10px] sm:text-xs font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl overflow-hidden group/btn hover:shadow-lg transition-all duration-200"
        >
          <span className="absolute inset-0 bg-[#F59E0B] scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 rounded-xl"></span>
          <span className="relative z-10 group-hover/btn:text-[#0F172A] transition-colors flex items-center gap-1">
            View <span className="hidden sm:inline">Details</span> →
          </span>
        </Link>
      </div>
    </div>
  </div>
);

const CarRowCarousel = ({ cars, loading, user, clearFilters, handleWishlistToggle }) => {
  const [rowIndex, setRowIndex] = useState(0);

  // Reset to first row whenever the car list changes (e.g. filter applied)
  useEffect(() => { setRowIndex(0); }, [cars]);

  // Determine columns per row based on viewport — we use CSS grid col count
  // Mobile: 2, sm: 3, lg: 4  →  we snapshot the largest (4) as JS default
  // but visually the grid handles it; we simply slice by the *visible* column count.
  // We expose 4 as the chunk size (lg), which means on mobile 2-col grid it wraps
  // to 2 visible rows — still one logical "row" from the carousel's perspective.
  const COLS = 4; // matches lg:grid-cols-4
  const totalRows = Math.ceil(cars.length / COLS);

  const visibleCars = cars.slice(rowIndex * COLS, rowIndex * COLS + COLS);

  const canPrev = rowIndex > 0;
  const canNext = rowIndex < totalRows - 1;

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
            <div className="h-28 sm:h-40 md:h-44 bg-slate-200"></div>
            <div className="p-3 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded-xl w-full mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <FaSearch className="mx-auto text-slate-200 text-5xl mb-4" />
        <h3 className="text-xl font-black text-[#0F172A] mb-2">No matches found</h3>
        <p className="text-slate-500 text-sm mb-6">Try adjusting your search or filters.</p>
        <button
          onClick={clearFilters}
          className="bg-[#F59E0B] text-[#0F172A] px-6 py-2.5 rounded-2xl font-black text-sm hover:scale-105 transition-all"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Row display with side arrows ── */}
      <div className="relative">

        {/* LEFT ARROW */}
        <button
          onClick={() => setRowIndex(r => r - 1)}
          disabled={!canPrev}
          className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-xl border-2 transition-all duration-200 ${
            canPrev
              ? 'bg-white border-slate-200 text-[#0F172A] hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:text-white hover:scale-110 active:scale-95'
              : 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed'
          }`}
          aria-label="Previous row"
        >
          <FaChevronLeft size={13} />
        </button>

        {/* CARS GRID — one row of 4 (wraps to 2×2 on mobile) */}
        <div className="px-5 sm:px-7">
          <div
            key={rowIndex}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 animate-fade-in"
          >
            {visibleCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                user={user}
                handleWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => setRowIndex(r => r + 1)}
          disabled={!canNext}
          className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-xl border-2 transition-all duration-200 ${
            canNext
              ? 'bg-white border-slate-200 text-[#0F172A] hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:text-white hover:scale-110 active:scale-95'
              : 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed'
          }`}
          aria-label="Next row"
        >
          <FaChevronRight size={13} />
        </button>
      </div>

      {/* ── Row indicator dots ── */}
      {totalRows > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {[...Array(totalRows)].map((_, i) => (
            <button
              key={i}
              onClick={() => setRowIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === rowIndex
                  ? 'w-6 h-2 bg-[#F59E0B]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to row ${i + 1}`}
            />
          ))}
          <span className="ml-2 text-[10px] text-slate-400 font-bold">
            {rowIndex + 1} / {totalRows}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   ABOUT SECTION — extracted for cleanliness
───────────────────────────────────────── */
const AboutSection = () => {
  const stats = [
    { value: '500+', label: 'Cars Sold', icon: '🚗' },
    { value: '1000+', label: 'Happy Customers', icon: '😊' },
    { value: '5★', label: 'Avg. Rating', icon: '⭐' },
    { value: '5+', label: 'Years Experience', icon: '📅' },
  ];

  const pillars = [
    {
      icon: FaShieldAlt,
      title: 'Verified Vehicles',
      desc: 'Every car in our inventory is thoroughly inspected and verified before listing. No hidden surprises — just honest facts.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      icon: FaHandshake,
      title: 'Transparent Deals',
      desc: 'We believe in clear pricing, no hidden fees. The price you see is the price you pay — period.',
      color: 'from-[#F59E0B] to-amber-400',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      icon: FaWhatsapp,
      title: 'Instant Support',
      desc: 'Reach us directly on WhatsApp for any question. Real people, real answers — no bots or long wait times.',
      color: 'from-green-500 to-emerald-400',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      icon: FaCheckCircle,
      title: 'Secure Booking',
      desc: 'Book your favourite car with a refundable token via Razorpay. Your money is safe until you\'re sure.',
      color: 'from-purple-500 to-violet-400',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
  ];

  return (
    <section className="relative overflow-hidden">

      {/* ── TOP WAVE DIVIDER ── */}
      <div className="w-full overflow-hidden leading-none bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0F172A" />
        </svg>
      </div>

      {/* ── DARK HERO BAND ── */}
      <div className="relative bg-[#0F172A] overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern animate-grid-move pointer-events-none"></div>
        {/* Orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 md:w-[400px] md:h-[400px] bg-[#F59E0B]/15 rounded-full blur-[100px] animate-float pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-56 h-56 md:w-80 md:h-80 bg-blue-500/15 rounded-full blur-[80px] animate-float-delayed pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {/* Label + heading */}
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block text-[#F59E0B] font-black uppercase tracking-[0.25em] text-[10px] sm:text-xs mb-3 animate-pulse-glow">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] animate-gradient-x">
                Caromotors
              </span>
            </h2>
            <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-[#F59E0B] to-transparent rounded-full mx-auto mt-4"></div>
          </div>

          {/* ── Two-column layout: text left, stats right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 md:mb-20">

            {/* Left: story copy */}
            <div className="space-y-5">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                <span className="text-white font-black">Caromotors</span> is Delhi's trusted destination for premium pre-owned vehicles. Based in{' '}
                <span className="text-[#F59E0B] font-bold">Mayur Vihar, Phase III</span>, we've been helping buyers find their perfect car with total transparency and zero compromises.
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We're not a marketplace — we're a single dealership that personally curates every vehicle in our inventory. That means every car you see here has been hand-picked, inspected, and priced fairly by us.
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you're buying your first car or upgrading to something better, we make the process simple: browse online, enquire on WhatsApp, and secure your car with a refundable token — all from your phone.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://wa.me/916238433075"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/30"
                >
                  <FaWhatsapp size={16} /> Chat on WhatsApp
                </a>
                <a
                  href="tel:+916238433075"
                  className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-3 rounded-xl font-black text-sm hover:bg-white/20 active:scale-95 transition-all"
                >
                  <FaPhoneAlt size={13} /> Call Us
                </a>
              </div>
            </div>

            {/* Right: stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-center hover:bg-white/10 hover:border-[#F59E0B]/40 transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#F59E0B] transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4 Pillars ── */}
          <div>
            <p className="text-center text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-6">
              Why Customers Trust Us
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {pillars.map((p, i) => (
                <div
                  key={p.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${p.color} mb-4 shadow-lg`}>
                    <p.icon className="text-white" size={18} />
                  </div>
                  <h3 className="text-white font-black text-sm sm:text-base mb-2 group-hover:text-[#F59E0B] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHT BAND: How it works ── */}
      <div className="bg-white py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-[#F59E0B] font-black uppercase tracking-[0.25em] text-[10px] sm:text-xs">
              Simple Process
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight">
              How It Works
            </h3>
            <div className="h-1 w-14 bg-gradient-to-r from-[#F59E0B] to-transparent rounded-full mx-auto mt-3"></div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-[#F59E0B]/30 via-[#F59E0B] to-[#F59E0B]/30 z-0"></div>

            {[
              {
                step: '01',
                title: 'Browse & Shortlist',
                desc: 'Explore our curated inventory. Filter by brand, price or model. Save favourites to your wishlist.',
                icon: FaSearch,
              },
              {
                step: '02',
                title: 'Enquire or Book',
                desc: 'Chat directly on WhatsApp for questions, or pay a small refundable token online to secure the car.',
                icon: FaHandshake,
              },
              {
                step: '03',
                title: 'Drive Home Happy',
                desc: 'Visit us, inspect the car, complete the deal. Token is adjusted in the final price — no extra charges.',
                icon: FaCheckCircle,
              },
            ].map((s, i) => (
              <div key={s.step} className="relative z-10 flex flex-col items-center text-center group">
                {/* Step number circle */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-[#F59E0B]/20 rounded-full blur-xl animate-pulse-slow"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-2 border-[#F59E0B]/40 group-hover:border-[#F59E0B] flex flex-col items-center justify-center transition-all duration-300 shadow-xl">
                    <span className="text-[9px] font-black text-[#F59E0B] uppercase tracking-widest">{s.step}</span>
                    <s.icon className="text-white mt-0.5" size={16} />
                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-black text-[#0F172A] mb-2 group-hover:text-[#F59E0B] transition-colors">
                  {s.title}
                </h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-[220px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BAND ── */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1a2540] to-[#0F172A] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#F59E0B]/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[#F59E0B]" size={16} />
            ))}
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Ready to find your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]">
              dream car?
            </span>
          </h3>
          <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Browse our inventory, shortlist your favourites, and reach out — we'll take it from there.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inventory"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center  justify-center gap-2 bg-[#F59E0B] text-[#0F172A] px-7 py-3.5 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F59E0B]/30"
            >
              Browse Inventory <FaArrowRight size={13} />
            </a>
            <a
              href="https://wa.me/916238433075"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-7 py-3.5 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/30"
            >
              <FaWhatsapp size={16} /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Home;