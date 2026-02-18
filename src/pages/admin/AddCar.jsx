import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', price: '', year: '',
    fuelType: 'Petrol', kmDriven: '', location: '', description: '',
    images: '' // We will accept comma-separated URLs for now
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // src/pages/admin/AddCar.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Since Cloudinary widget already makes formData.images an array, 
      // we don't need to split it like a string anymore.
      await axios.post('http://localhost:4000/api/cars', formData);
      alert('Car Added Successfully!');
      navigate('/');
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
      alert('Error adding car. Check server console.');
    }
  };

  const openWidget = () => {
  window.cloudinary.createUploadWidget(
    {
      cloudName: 'djsimcvht', 
      uploadPreset: 'caromotors',
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        // Save the URL to your form state
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, result.info.secure_url] 
        }));
      }
    }
  ).open();
};

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 mt-10 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Car</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        
        {/* Title & Brand */}
        <div className="grid grid-cols-2 gap-4">
          <input name="title" placeholder="Ad Title (e.g. 2018 Honda City)" onChange={handleChange} className="border p-2 rounded" required />
          <input name="brand" placeholder="Brand (e.g. Honda)" onChange={handleChange} className="border p-2 rounded" required />
        </div>

        {/* Model & Price */}
        <div className="grid grid-cols-2 gap-4">
          <input name="model" placeholder="Model (e.g. ZX CVT)" onChange={handleChange} className="border p-2 rounded" required />
          <input name="price" type="number" placeholder="Price (₹)" onChange={handleChange} className="border p-2 rounded" required />
        </div>

        {/* Year & Fuel */}
        <div className="grid grid-cols-2 gap-4">
          <input name="year" type="number" placeholder="Year" onChange={handleChange} className="border p-2 rounded" required />
          <select name="fuelType" onChange={handleChange} className="border p-2 rounded">
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* KM & Location */}
        <div className="grid grid-cols-2 gap-4">
          <input name="kmDriven" type="number" placeholder="KM Driven" onChange={handleChange} className="border p-2 rounded" required />
          <input name="location" placeholder="Location" onChange={handleChange} className="border p-2 rounded" required />
        </div>

        {/* Images */}
        <button type="button" onClick={openWidget} className="bg-gray-200 p-2 rounded cursor-pointer">
          Upload Photos
        </button>

        {/* Description */}
        <textarea name="description" placeholder="Car Description" rows="4" onChange={handleChange} className="border p-2 rounded" required></textarea>

        <button type="submit" className="bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">
          Post Ad
        </button>
      </form>
    </div>
  );
};

export default AddCar;