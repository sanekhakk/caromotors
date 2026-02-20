import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import {
  FaSearch, FaArrowRight, FaTimes, FaThLarge, FaList,
  FaGasPump, FaTachometerAlt, FaMapMarkerAlt, FaChevronRight,
  FaChevronDown, FaTrash, FaRupeeSign
} from 'react-icons/fa';
import {
  getAllCategories, carMatchesCategory, getCustomCategories,
  deleteCustomCategory, PRICE_RANGES
} from '../categoryStore';

/* ══════ Mini Car Card ══════ */
const CarCard = ({ car }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/car/${car._id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={car.images?.[0]} alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-2 left-2 bg-white/95 text-[#0F172A] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
          {car.brand}
        </span>
        <span className="absolute top-2 right-2 bg-green-500/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full">✓ Avail</span>
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <FaMapMarkerAlt className="text-[#F59E0B] text-[9px]" />
          <span className="text-white text-[9px] font-bold truncate max-w-[80px]">{car.location}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-black text-[#0F172A] line-clamp-1 mb-1 group-hover:text-[#F59E0B] transition-colors">{car.title}</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-2.5">
          <span className="flex items-center gap-0.5"><FaGasPump size={8} /> {car.fuelType}</span>
          <span className="text-slate-200">•</span>
          <span>{car.year}</span>
          <span className="text-slate-200">•</span>
          <span><FaTachometerAlt className="inline mr-0.5" size={8} />{(car.kmDriven / 1000).toFixed(0)}k</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-base font-black text-[#0F172A]">₹{(car.price / 100000).toFixed(1)}L</p>
          <span className="text-[#F59E0B] text-[10px] font-black flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            View <FaChevronRight size={9} />
          </span>
        </div>
      </div>
    </div>
  );
};

/* ══════ Price Range Accordion ══════ */
const PriceRangeSection = ({ range, cars, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/70 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${range.gradient} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
            {range.emoji}
          </div>
          <div className="text-left">
            <p className="font-black text-[#0F172A] text-sm">{range.label}</p>
            <p className="text-[10px] text-slate-400 font-bold">
              {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {cars.length > 0 && (
            <span
              className="hidden sm:block text-xs font-black px-3 py-1 rounded-full"
              style={{ background: `${range.accent}22`, color: range.accent }}
            >
              {cars.length} cars
            </span>
          )}
          {/* Price range bar preview */}
          <div className="hidden sm:flex items-center gap-1 w-20">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${range.gradient}`}
                style={{ width: cars.length > 0 ? '100%' : '0%', transition: 'width 0.5s ease' }}
              />
            </div>
          </div>
          <div className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            <FaChevronDown size={14} />
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-5 border-t border-slate-100 pt-4">
          {cars.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-3 block">🚫</span>
              <p className="text-slate-400 text-sm font-bold">No vehicles in this price range.</p>
              <p className="text-slate-300 text-xs mt-1">Check back soon or browse other ranges.</p>
            </div>
          ) : (
            <>
              {/* Stats strip */}
              <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100">
                <div className="text-center">
                  <p className="text-lg font-black" style={{ color: range.accent }}>{cars.length}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Cars</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-[#0F172A]">
                    ₹{Math.min(...cars.map(c => c.price / 100000)).toFixed(1)}L
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">From</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-[#0F172A]">
                    ₹{Math.max(...cars.map(c => c.price / 100000)).toFixed(1)}L
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Up to</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-[#0F172A]">
                    ₹{(cars.reduce((s, c) => s + c.price, 0) / cars.length / 100000).toFixed(1)}L
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Avg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {cars.slice(0, 8).map(car => <CarCard key={car._id} car={car} />)}
              </div>
              {cars.length > 8 && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-400">
                    Showing 8 of {cars.length} vehicles
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════
   MAIN CATEGORIES PAGE
══════════════════════════════ */
const Categories = () => {
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [catSearch, setCatSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [customCats, setCustomCats] = useState([]);

  const refreshCategories = useCallback(() => {
    setCategories(getAllCategories());
    setCustomCats(getCustomCategories());
  }, []);

  useEffect(() => {
    refreshCategories();
    const handler = () => refreshCategories();
    window.addEventListener('storage', handler);
    window.addEventListener('caromotors:categoryUpdated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('caromotors:categoryUpdated', handler);
    };
  }, [refreshCategories]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await api.get('/cars', { params: { page: 1 } });
        const total = res.data.totalPages || 1;
        let cars = res.data.cars || [];
        for (let p = 2; p <= Math.min(total, 10); p++) {
          const r = await api.get('/cars', { params: { page: p } });
          cars = [...cars, ...(r.data.cars || [])];
        }
        setAllCars(cars);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const visibleCategories = categories.filter(c =>
    c.label.toLowerCase().includes(catSearch.toLowerCase())
  );

  const displayedCars = allCars
    .filter(car => carMatchesCategory(car, activeCategory))
    .filter(car => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        car.title?.toLowerCase().includes(q) ||
        car.brand?.toLowerCase().includes(q) ||
        car.model?.toLowerCase().includes(q) ||
        car.location?.toLowerCase().includes(q)
      );
    });

  const activecat = categories.find(c => c.id === activeCategory) || categories[0];

  const handleDeleteCustomCat = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this custom category?')) return;
    deleteCustomCategory(id);
    refreshCategories();
    if (activeCategory === id) setActiveCategory('all');
  };

  // Price-search filtered cars
  const priceSearchCars = allCars.filter(car => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      car.title?.toLowerCase().includes(q) ||
      car.brand?.toLowerCase().includes(q) ||
      car.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1a2540] to-[#0F172A] overflow-hidden pt-10 pb-10 px-4">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-4 py-1.5 rounded-full mb-4">
            <FaThLarge className="text-[#F59E0B] text-xs" />
            <span className="text-[#F59E0B] text-[10px] font-black uppercase tracking-widest">Browse by Category</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-amber-300">
              Perfect Match
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Shop by type, budget, or fuel — {allCars.length} vehicles available right now.
          </p>
          <div className="relative max-w-xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model, or location..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-slate-500 pl-11 pr-10 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <FaTimes size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-0">
          {[
            { id: 'browse', label: 'Browse by Type', icon: FaThLarge },
            { id: 'price', label: 'Shop by Price', icon: FaRupeeSign },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 sm:px-8 py-4 text-xs font-black border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#F59E0B] border-[#F59E0B]'
                  : 'text-slate-500 border-transparent hover:text-[#0F172A]'
              }`}
            >
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">

        {/* ══════════════════════════════
            BROWSE BY TYPE
        ══════════════════════════════ */}
        {activeTab === 'browse' && (
          <>
            {/* Category pills row */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-black text-[#0F172A]">Categories</h2>
                  <p className="text-slate-400 text-[11px] font-medium">
                    {categories.length - 1} categories · {customCats.length} custom
                  </p>
                </div>
                <div className="relative w-full sm:w-52">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type="text" value={catSearch}
                    onChange={e => setCatSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {visibleCategories.map(cat => {
                  const count = allCars.filter(c => carMatchesCategory(c, cat.id)).length;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-shrink-0 relative flex flex-col items-start gap-1 px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 min-w-[140px] overflow-hidden ${
                        isActive
                          ? 'border-[#F59E0B] shadow-xl shadow-[#F59E0B]/20'
                          : 'border-slate-200 bg-white hover:border-[#F59E0B]/50 hover:shadow-md'
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient || 'from-[#0F172A] to-[#1E293B]'} opacity-90`} />
                      )}
                      <div className="relative z-10 w-full">
                        <span className="text-2xl leading-none">{cat.emoji}</span>
                        <p className={`text-xs font-black mt-1.5 ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                          {cat.label}
                        </p>
                        <p className={`text-[9px] font-bold mt-0.5 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                          {count} cars
                        </p>
                        {cat.isCustom && (
                          <button
                            onClick={(e) => handleDeleteCustomCat(cat.id, e)}
                            className={`absolute -top-1 -right-1 p-1 rounded-full ${
                              isActive ? 'text-white/60 hover:text-red-300' : 'text-slate-300 hover:text-red-500'
                            }`}
                            title="Delete"
                          >
                            <FaTrash size={9} />
                          </button>
                        )}
                      </div>
                      {isActive && <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-[#F59E0B] rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3 flex-wrap">
                {activecat && (
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r ${activecat.gradient || 'from-[#0F172A] to-[#1E293B]'} shadow-md`}>
                    <span>{activecat.emoji}</span>
                    <span className="text-white text-xs font-black">{activecat.label}</span>
                  </div>
                )}
                <span className="text-slate-500 text-sm font-bold">
                  {loading ? '...' : `${displayedCars.length} results`}
                </span>
                {searchQuery && (
                  <span className="text-[#F59E0B] text-xs font-black bg-[#F59E0B]/10 px-2.5 py-1 rounded-full">
                    "{searchQuery}"
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 self-start sm:self-auto">
                {[{ id: 'grid', icon: FaThLarge }, { id: 'list', icon: FaList }].map(v => (
                  <button key={v.id} onClick={() => setViewMode(v.id)}
                    className={`p-2 rounded-lg transition-all ${viewMode === v.id ? 'bg-[#0F172A] text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                    <v.icon size={12} />
                  </button>
                ))}
              </div>
            </div>

            {/* Car grid or list */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-slate-100">
                    <div className="h-36 bg-slate-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedCars.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-xl font-black text-[#0F172A] mb-2">No vehicles found</h3>
                <p className="text-slate-500 text-sm mb-5">Try a different category or clear your search.</p>
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-5 py-2.5 rounded-xl font-black text-sm hover:scale-105 transition-all"
                >
                  Clear Filters <FaTimes size={10} />
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {displayedCars.map((car, i) => (
                  <div key={car._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayedCars.map((car, i) => (
                  <div
                    key={car._id}
                    onClick={() => navigate(`/car/${car._id}`)}
                    className="group bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer flex gap-3 p-3"
                  >
                    <div className="flex-shrink-0 relative h-24 w-36 rounded-xl overflow-hidden">
                      <img src={car.images?.[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-1 left-1 bg-white/95 text-[9px] font-black px-1.5 py-0.5 rounded-full text-[#0F172A] uppercase">{car.brand}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#F59E0B] transition-colors line-clamp-1">{car.title}</h3>
                        <span className="text-base font-black text-[#0F172A] flex-shrink-0">₹{(car.price / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-bold mt-1">
                        <span><FaGasPump className="inline mr-0.5" size={8} /> {car.fuelType}</span>
                        <span>• {car.year}</span>
                        <span>• {(car.kmDriven / 1000).toFixed(0)}k KM</span>
                        <span><FaMapMarkerAlt className="inline mr-0.5" size={8} /> {car.location}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Available</span>
                        <span className="text-[#F59E0B] text-[10px] font-black group-hover:underline flex items-center gap-0.5">
                          View Details <FaChevronRight size={8} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Explore all categories showcase */}
            {activeCategory === 'all' && !searchQuery && !loading && (
              <div className="mt-14">
                <div className="text-center mb-6">
                  <p className="text-[#F59E0B] text-[10px] font-black uppercase tracking-widest mb-1">All Types</p>
                  <h2 className="text-2xl font-black text-[#0F172A]">Explore Categories</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.filter(c => c.id !== 'all').map(cat => {
                    const count = allCars.filter(c => carMatchesCategory(c, cat.id)).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                        className={`group relative rounded-2xl overflow-hidden h-36 bg-gradient-to-br ${cat.gradient || 'from-slate-800 to-slate-600'} hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 text-left p-4 border border-white/10`}
                      >
                        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full opacity-30 blur-2xl"
                          style={{ background: cat.accent || '#fff' }} />
                        <div className="relative z-10">
                          <span className="text-3xl mb-2 block">{cat.emoji}</span>
                          <p className="text-white font-black text-sm">{cat.label}</p>
                          <p className="text-white/50 text-[10px] font-bold mt-0.5">{count} vehicles</p>
                          {cat.isCustom && (
                            <span className="inline-block mt-1 text-[8px] font-black text-white/60 bg-white/10 px-1.5 py-0.5 rounded-full">Custom</span>
                          )}
                        </div>
                        <FaArrowRight className="absolute bottom-4 right-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" size={13} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════
            SHOP BY PRICE TAB
        ══════════════════════════════ */}
        {activeTab === 'price' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                    <FaRupeeSign className="text-[#F59E0B]" size={16} /> Shop by Price
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    Click any range to see available vehicles with detailed stats
                  </p>
                </div>
                {searchQuery && (
                  <span className="text-[#F59E0B] text-xs font-black bg-[#F59E0B]/10 px-3 py-1 rounded-full flex items-center gap-1">
                    "{searchQuery}" <button onClick={() => setSearchQuery('')}><FaTimes size={9} /></button>
                  </span>
                )}
              </div>

              {/* Summary chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mt-4">
                {PRICE_RANGES.map(range => {
                  const count = priceSearchCars.filter(c => c.price >= range.min && c.price < range.max).length;
                  return (
                    <div key={range.id} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                      <span>{range.emoji}</span>
                      <span className="text-[10px] font-black text-[#0F172A]">{range.label}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: `${range.accent}25`, color: range.accent }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accordion price sections */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-slate-200 rounded" />
                        <div className="h-2.5 w-20 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {PRICE_RANGES.map((range, i) => (
                  <PriceRangeSection
                    key={range.id}
                    range={range}
                    cars={priceSearchCars.filter(c => c.price >= range.min && c.price < range.max)}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            )}

            {/* Price distribution bar chart */}
            {!loading && allCars.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-black text-[#0F172A] mb-4 flex items-center gap-2">
                  <span className="h-4 w-1 bg-[#F59E0B] rounded-full"></span>
                  Inventory Price Distribution
                </h3>
                <div className="space-y-3">
                  {PRICE_RANGES.map(range => {
                    const count = allCars.filter(c => c.price >= range.min && c.price < range.max).length;
                    const pct = allCars.length > 0 ? Math.round((count / allCars.length) * 100) : 0;
                    return (
                      <div key={range.id} className="flex items-center gap-3">
                        <span className="text-base w-5 flex-shrink-0">{range.emoji}</span>
                        <span className="text-[10px] font-black text-slate-500 w-24 sm:w-28 flex-shrink-0 truncate">{range.label}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${range.gradient} transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 w-8 text-right">{count}</span>
                        <span className="text-[10px] text-slate-300 w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;