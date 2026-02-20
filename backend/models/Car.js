const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  // ── Core listing fields ────────────────────────────────────────────────────
  title:        { type: String,  required: true },
  brand:        { type: String,  required: true },
  model:        { type: String,  required: true },
  price:        { type: Number,  required: true },
  year:         { type: Number,  required: true },
  fuelType:     { type: String,  required: true },
  kmDriven:     { type: Number,  required: true },
  location:     { type: String,  required: true },
  description:  { type: String,  required: true },
  category:     { type: String,  default: '' },

  // ── New vehicle detail fields (public-facing) ──────────────────────────────
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'CVT', 'AMT', 'DCT'],
    default: 'Manual',
  },
  ownership: {
    type: String,   // e.g. "1st Owner", "2nd Owner — service history available"
    default: '',
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: [{ type: String, required: true }],

  // ── Booking / token ───────────────────────────────────────────────────────
  tokenAmount: {
    type:    Number,
    required: true,
    default: 5000,
  },

  status: {
    type:    String,
    enum:    ['available', 'booked', 'sold'],
    default: 'available',
  },

  // ── ADMIN-ONLY: Dealer fields ──────────────────────────────────────────────
  // These are NEVER returned by the public-facing API endpoints.
  // See carController.js → toPublic() which strips them.
  // dealerId links to the localStorage dealer profile (client side).
  // Name/phone/place are snapshotted at listing time for resilience.
  dealerId:    { type: String, default: '' },
  dealerName:  { type: String, default: '' },
  dealerPhone: { type: String, default: '' },
  dealerPlace: { type: String, default: '' },
  // ──────────────────────────────────────────────────────────────────────────

}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);