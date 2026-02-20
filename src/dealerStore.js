/**
 * dealerStore.js
 * Single source of truth for dealer profiles.
 * All dealer data is persisted in localStorage.
 * Used by: ManageDealers, AddCar, ManageInventory
 */

const STORAGE_KEY = 'caromotors_dealers';

/** Generate a simple unique ID */
const genId = () => `dealer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/** Get all dealers from localStorage */
export const getDealers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Save a new dealer. Returns the full updated list. */
export const saveDealer = (dealer) => {
  const existing = getDealers();
  const newDealer = {
    ...dealer,
    id: genId(),
    createdAt: new Date().toISOString(),
  };
  const updated = [...existing, newDealer];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  _dispatch();
  return updated;
};

/** Update an existing dealer by id. Returns full updated list. */
export const updateDealer = (id, patch) => {
  const existing = getDealers();
  const updated = existing.map(d => d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  _dispatch();
  return updated;
};

/** Delete a dealer by id. Returns full updated list. */
export const deleteDealer = (id) => {
  const existing = getDealers();
  const updated = existing.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  _dispatch();
  return updated;
};

/** Get a single dealer by id */
export const getDealerById = (id) => {
  return getDealers().find(d => d.id === id) || null;
};

/** Fire a custom event so all listening components re-render */
const _dispatch = () => {
  window.dispatchEvent(new Event('caromotors:dealerUpdated'));
};

/** Seed some example dealers if none exist (for demo purposes) */
export const seedDemoDealer = () => {
  if (getDealers().length === 0) {
    const demo = [
      {
        id: genId(),
        name: 'Caro motors',
        place: 'Mayur Vihar, Delhi',
        phone: '+91 6238433075',
        email: 'santhosh@caromotors.com',
        notes: 'Primary dealer. Handles all luxury vehicles.',
        color: 'from-blue-600 to-blue-800',
        avatar: 'RM',
        createdAt: new Date().toISOString(),
      },
      
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  }
};

/** Colour options for dealer avatars */
export const DEALER_COLORS = [
  { label: 'Navy', value: 'from-blue-600 to-blue-800' },
  { label: 'Emerald', value: 'from-emerald-600 to-emerald-800' },
  { label: 'Amber', value: 'from-amber-500 to-amber-700' },
  { label: 'Rose', value: 'from-rose-600 to-rose-800' },
  { label: 'Violet', value: 'from-violet-600 to-violet-800' },
  { label: 'Slate', value: 'from-slate-600 to-slate-800' },
  { label: 'Teal', value: 'from-teal-600 to-teal-800' },
  { label: 'Orange', value: 'from-orange-500 to-orange-700' },
];