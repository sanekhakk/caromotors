import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

const ManageInventory = () => {
  const [cars, setCars] = useState([]);

 const fetchCars = async () => {
  const res = await axios.get('http://localhost:4000/api/cars');
  // Check if data is paginated (object) or plain array
  const carData = res.data.cars ? res.data.cars : res.data; 
  setCars(carData);
};

  useEffect(() => { fetchCars(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await axios.delete(`http://localhost:4000/api/cars/${id}`);
      fetchCars();
    }
  };

  const markAsSold = async (id) => {
    await axios.put(`http://localhost:4000/api/cars/${id}`, { status: 'sold' });
    fetchCars();
  };

  return (
  <div className="w-full animate-fade-in">
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-3xl font-black text-[#0F172A]">Inventory Management</h1>
      <Link to="/admin/add-car" className="bg-[#F59E0B] text-[#0F172A] px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-200 hover:scale-105 transition-all">
        + Add New Vehicle
      </Link>
    </div>

    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Vehicle</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Price</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {cars.map((car) => (
            <tr key={car._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <img src={car.images[0]} crossOrigin="anonymous" className="w-16 h-12 object-cover rounded-xl shadow-sm" alt="" />
                  <div>
                    <p className="font-bold text-[#0F172A]">{car.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{car.brand} • {car.year}</p>
                  </div>
                </div>
              </td>
              <td className="p-6 font-black text-[#0F172A]">₹{car.price.toLocaleString()}</td>
              <td className="p-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  car.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {car.status}
                </span>
              </td>
              <td className="p-6 text-right space-x-3">
                <button onClick={() => markAsSold(car._id)} className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark as Sold">
                  <FaCheckCircle size={18} />
                </button>
                <button onClick={() => handleDelete(car._id)} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Listing">
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default ManageInventory;