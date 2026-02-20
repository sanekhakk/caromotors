/**
 * categoryStore.js
 * Single source of truth for car categories.
 * Built-in categories are hardcoded; custom categories are persisted in localStorage.
 * Both AddCar (admin) and Categories (public) page import from here.
 */

export const BUILT_IN_CATEGORIES = [
  {
    id: 'sedan',
    label: 'Sedans',
    emoji: '🚙',
    desc: 'Comfort meets elegance',
    gradient: 'from-blue-900 to-blue-700',
    accent: '#60A5FA',
    isCustom: false,
    matchFn: (car) => {
      const t = (car.title + ' ' + car.model).toLowerCase();
      const b = car.brand?.toLowerCase() || '';
      const sedanBrands = ['honda', 'toyota', 'maruti', 'hyundai', 'skoda', 'volkswagen'];
      const sedanKw = ['city', 'verna', 'ciaz', 'dzire', 'rapid', 'octavia', 'camry', 'civic', 'sedan', 'amaze', 'aspire', 'tigor'];
      return sedanBrands.some(b2 => b.includes(b2)) && sedanKw.some(k => t.includes(k));
    },
  },
  {
    id: 'suv',
    label: 'SUVs & MUVs',
    emoji: '🛻',
    desc: 'Power, space and versatility',
    gradient: 'from-emerald-900 to-emerald-700',
    accent: '#34D399',
    isCustom: false,
    matchFn: (car) => {
      const t = (car.title + ' ' + car.model).toLowerCase();
      const b = car.brand?.toLowerCase() || '';
      const suvBrands = ['mahindra', 'tata', 'jeep', 'kia', 'mg', 'ford', 'toyota', 'isuzu'];
      const suvKw = ['suv', 'xuv', 'creta', 'seltos', 'hector', 'ecosport', 'fortuner', 'endeavour', 'compass', 'harrier', 'safari', 'scorpio', 'bolero', 'ertiga', 'innova', 'hexa'];
      return suvBrands.some(b2 => b.includes(b2)) || suvKw.some(k => t.includes(k));
    },
  },
  {
    id: 'hatchback',
    label: 'Hatchbacks',
    emoji: '🏎️',
    desc: 'Zippy, affordable & city-ready',
    gradient: 'from-violet-900 to-violet-700',
    accent: '#A78BFA',
    isCustom: false,
    matchFn: (car) => {
      const t = (car.title + ' ' + car.model).toLowerCase();
      const hbKw = ['swift', 'i20', 'jazz', 'polo', 'altroz', 'baleno', 'santro', 'brio', 'hatchback', 'punch', 'kwid', 'celerio', 'wagon', 'ignis', 'grand i10', 'venue', 'sonet'];
      return hbKw.some(k => t.includes(k));
    },
  },
  {
    id: 'luxury',
    label: 'Luxury',
    emoji: '💎',
    desc: 'Premium & prestige vehicles',
    gradient: 'from-amber-900 to-yellow-700',
    accent: '#F59E0B',
    isCustom: false,
    matchFn: (car) => {
      const b = car.brand?.toLowerCase() || '';
      const t = (car.title + ' ' + car.model).toLowerCase();
      const luxBrands = ['bmw', 'mercedes', 'audi', 'jaguar', 'volvo', 'land rover', 'porsche', 'lexus', 'bentley', 'rolls'];
      return luxBrands.some(b2 => b.includes(b2) || t.includes(b2));
    },
  },
  {
    id: 'electric',
    label: 'Electric',
    emoji: '⚡',
    desc: 'Clean, green, future-ready',
    gradient: 'from-cyan-900 to-cyan-700',
    accent: '#22D3EE',
    isCustom: false,
    matchFn: (car) => car.fuelType === 'Electric',
  },
  {
    id: 'diesel',
    label: 'Diesel',
    emoji: '🛢️',
    desc: 'Fuel-efficient long haulers',
    gradient: 'from-slate-800 to-slate-600',
    accent: '#94A3B8',
    isCustom: false,
    matchFn: (car) => car.fuelType === 'Diesel',
  },
  {
    id: 'petrol',
    label: 'Petrol',
    emoji: '⛽',
    desc: 'Smooth, responsive & popular',
    gradient: 'from-orange-900 to-orange-700',
    accent: '#FB923C',
    isCustom: false,
    matchFn: (car) => car.fuelType === 'Petrol',
  },
  {
    id: 'cng',
    label: 'CNG',
    emoji: '🌿',
    desc: 'Low running cost & eco-friendly',
    gradient: 'from-green-900 to-green-700',
    accent: '#4ADE80',
    isCustom: false,
    matchFn: (car) => car.fuelType === 'CNG',
  },
];

// Price range buckets for "Shop by Price"
export const PRICE_RANGES = [
  { id: 'under3', label: 'Under ₹3L', emoji: '💰', min: 0, max: 300000, gradient: 'from-green-800 to-emerald-600', accent: '#34D399' },
  { id: '3to5', label: '₹3L – ₹5L', emoji: '💵', min: 300000, max: 500000, gradient: 'from-teal-800 to-teal-600', accent: '#2DD4BF' },
  { id: '5to8', label: '₹5L – ₹8L', emoji: '💳', min: 500000, max: 800000, gradient: 'from-blue-800 to-blue-600', accent: '#60A5FA' },
  { id: '8to12', label: '₹8L – ₹12L', emoji: '🏷️', min: 800000, max: 1200000, gradient: 'from-violet-800 to-purple-600', accent: '#A78BFA' },
  { id: '12to20', label: '₹12L – ₹20L', emoji: '💫', min: 1200000, max: 2000000, gradient: 'from-amber-800 to-yellow-600', accent: '#FCD34D' },
  { id: 'above20', label: 'Above ₹20L', emoji: '👑', min: 2000000, max: Infinity, gradient: 'from-rose-900 to-pink-700', accent: '#FB7185' },
];

const STORAGE_KEY = 'caromotors_custom_categories';

/** Get custom categories from localStorage */
export const getCustomCategories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Save a new custom category */
export const saveCustomCategory = (cat) => {
  const existing = getCustomCategories();
  // Avoid duplicates by id
  const deduped = existing.filter(c => c.id !== cat.id);
  const updated = [...deduped, cat];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/** Delete a custom category by id */
export const deleteCustomCategory = (id) => {
  const existing = getCustomCategories();
  const updated = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/** Get ALL categories (built-in + custom), with 'all' prepended */
export const getAllCategories = () => {
  const custom = getCustomCategories();
  return [
    {
      id: 'all',
      label: 'All Vehicles',
      emoji: '🚗',
      desc: 'Browse the complete collection',
      gradient: 'from-[#0F172A] to-[#1E293B]',
      accent: '#F59E0B',
      isCustom: false,
      matchFn: () => true,
    },
    ...BUILT_IN_CATEGORIES,
    ...custom.map(c => ({
      ...c,
      isCustom: true,
      // Custom categories match by the category id stored on the car object
      matchFn: (car) => car.category === c.id,
    })),
  ];
};

/** Match a single car to a category */
export const carMatchesCategory = (car, categoryId) => {
  if (categoryId === 'all') return true;
  const all = getAllCategories();
  const cat = all.find(c => c.id === categoryId);
  if (!cat) return false;
  // Also check car.category field for direct assignment
  if (car.category === categoryId) return true;
  if (cat.matchFn) return cat.matchFn(car);
  return false;
};

/** Gradient pool for new custom categories */
export const GRADIENT_OPTIONS = [
  { label: 'Ocean', value: 'from-blue-900 to-cyan-700', accent: '#22D3EE' },
  { label: 'Forest', value: 'from-green-900 to-emerald-700', accent: '#34D399' },
  { label: 'Sunset', value: 'from-orange-900 to-amber-700', accent: '#FB923C' },
  { label: 'Violet', value: 'from-violet-900 to-purple-700', accent: '#A78BFA' },
  { label: 'Rose', value: 'from-rose-900 to-pink-700', accent: '#FB7185' },
  { label: 'Slate', value: 'from-slate-800 to-zinc-600', accent: '#94A3B8' },
  { label: 'Gold', value: 'from-amber-900 to-yellow-700', accent: '#FCD34D' },
  { label: 'Teal', value: 'from-teal-900 to-cyan-700', accent: '#2DD4BF' },
];

export const EMOJI_OPTIONS = ['🚗','🛻','🏎️','🚙','⚡','💎','🛢️','⛽','🌿','🔥','🏁','🚘','🚐','🚌','🏍️','✨','🌟','💫'];