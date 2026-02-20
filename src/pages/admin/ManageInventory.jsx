import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaCheckCircle, FaPlus, FaSearch } from 'react-icons/fa';

const ManageInventory = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');

  const fetchCars = async () => {
    const res = await axios.get('http://localhost:4000/api/cars');
    const carData = res.data.cars ? res.data.cars : res.data;
    setCars(carData);
  };

  useEffect(() => { fetchCars(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this listing?")) {
      await axios.delete(`http://localhost:4000/api/cars/${id}`);
      fetchCars();
    }
  };

  const markAsSold = async (id) => {
    await axios.put(`http://localhost:4000/api/cars/${id}`, { status: 'sold' });
    fetchCars();
  };

  const filtered = cars.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Inventory</h1>
          <p className="text-slate-500 text-xs mt-0.5">{cars.length} vehicles listed</p>
        </div>
        <Link to="/admin/add-car"
          className="flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-4 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-amber-200 hover:scale-105 transition-all self-start sm:self-auto">
          <FaPlus size={12} /> Add Vehicle
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search by brand or title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-sm"
        />
      </div>

      {/* ── Mobile Card List ── */}
      <div className="sm:hidden space-y-3">
        {filtered.map(car => (
          <div key={car._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex gap-3 p-3">
            <img src={car.images[0]} crossOrigin="anonymous"
              className="h-16 w-24 object-cover rounded-xl flex-shrink-0" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#0F172A] text-sm leading-tight truncate">{car.title}</p>
              <p className="text-[10px] text-slate-400 font-medium mb-1.5">{car.brand} • {car.year}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#0F172A]">₹{(car.price / 100000).toFixed(1)}L</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                    car.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>{car.status}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => markAsSold(car._id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark Sold">
                    <FaCheckCircle size={14} />
                  </button>
                  <button onClick={() => handleDelete(car._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Vehicle', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((car) => (
              <tr key={car._id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={car.images[0]} crossOrigin="anonymous"
                      className="w-14 h-10 object-cover rounded-xl shadow-sm flex-shrink-0" alt="" />
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">{car.title}</p>
                      <p className="text-[10px] text-slate-400">{car.brand} • {car.year}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-black text-[#0F172A] text-sm">₹{car.price.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    car.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>{car.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => markAsSold(car._id)}
                      className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark Sold">
                      <FaCheckCircle size={16} />
                    </button>
                    <button onClick={() => handleDelete(car._id)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No vehicles found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageInventory;