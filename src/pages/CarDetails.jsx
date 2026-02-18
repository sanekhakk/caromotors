import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp, FaCheckCircle, FaGasPump, FaCalendarAlt, FaTachometerAlt, FaMapMarkerAlt, FaCar, FaArrowLeft, FaStar, FaShieldAlt } from 'react-icons/fa';
import api from '../api';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCar();
  }, [id]);

  if (!car) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-[#F59E0B]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#F59E0B] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin-reverse"></div>
      </div>
      <p className="text-slate-600 font-black text-lg animate-pulse">Loading vehicle details...</p>
    </div>
  );

  const handleWhatsAppEnquiry = () => {
    const phoneNumber = "91XXXXXXXXXX";
    const message = `Hi, I am interested in the ${car.title} priced at ₹${car.price}. Link: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post('http://localhost:4000/api/payment/order', {
        amount: car.tokenAmount
      });

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: order.currency,
        name: "Caromotors",
        description: `Token for ${car.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const bookingData = {
              carId: car._id,
              tokenAmount: car.tokenAmount,
              paymentId: response.razorpay_payment_id
            };
            await axios.post('http://localhost:4000/api/bookings', bookingData);
            alert("Booking Successful! The dealer will contact you.");
          } catch (err) {
            alert("Payment recorded, but booking failed. Contact support.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: { color: "#F59E0B" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Back Button with Animation */}
        <button 
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-3 text-slate-600 hover:text-[#F59E0B] transition-all duration-300"
        >
          <div className="p-3 bg-white rounded-full shadow-lg group-hover:shadow-xl group-hover:shadow-[#F59E0B]/20 transition-all">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-bold">Back to listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image Gallery Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Image with Loading Effect */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F59E0B] via-purple-500 to-blue-500 rounded-3xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                )}
                <img 
                  src={car.images[selectedImage]} 
                  alt={car.title} 
                  className="w-full h-[500px] object-cover rounded-2xl"
                  onLoad={() => setImageLoading(false)}
                />
                
                {/* Image Overlay Info */}
                <div className="absolute top-8 left-8 flex gap-3">
                  <span className="bg-white/95 backdrop-blur-md text-[#0F172A] text-xs font-black px-4 py-2 rounded-full shadow-lg">
                    {car.brand}
                  </span>
                  <span className="bg-green-500/95 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <FaCheckCircle /> Available
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {car.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setImageLoading(true);
                  }}
                  className={`relative group/thumb overflow-hidden rounded-2xl transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-4 ring-[#F59E0B] scale-105' 
                      : 'hover:scale-105 ring-2 ring-transparent hover:ring-slate-300'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity"></div>
                  <img 
                    src={img} 
                    className="h-24 w-full object-cover"
                    alt={`View ${index + 1}`}
                  />
                </button>
              ))}
            </div>

            {/* Features Section */}
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 shadow-xl">
              <h3 className="text-2xl font-black text-[#0F172A] mb-6 flex items-center gap-3">
                <FaStar className="text-[#F59E0B]" />
                Key Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FaGasPump, label: 'Fuel Type', value: car.fuelType },
                  { icon: FaCalendarAlt, label: 'Year', value: car.year },
                  { icon: FaTachometerAlt, label: 'KM Driven', value: car.kmDriven.toLocaleString() },
                  { icon: FaMapMarkerAlt, label: 'Location', value: car.location },
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl text-center transform hover:scale-105 hover:rotate-2 transition-all duration-300 group/feature"
                  >
                    <feature.icon className="text-2xl text-slate-400 group-hover/feature:text-[#F59E0B] mx-auto mb-2 transition-colors" />
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">{feature.label}</p>
                    <p className="text-lg font-black text-[#0F172A]">{feature.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info & CTA Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-3xl opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-black text-[#0F172A] mb-2">{car.title}</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                      <FaCar className="text-[#F59E0B]" />
                      {car.brand} • {car.model}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 p-6 rounded-2xl mb-6">
                  <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-2">Asking Price</p>
                  <p className="text-5xl font-black text-[#0F172A]">₹{car.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <FaShieldAlt className="text-green-500" />
                    <span className="text-xs text-slate-600 font-bold">Best price guaranteed</span>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-slate-100 pt-6 mb-6">
                  <h3 className="text-lg font-black text-[#0F172A] mb-3">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{car.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* WhatsApp Button */}
                  <button 
                    onClick={handleWhatsAppEnquiry}
                    className="relative w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-500/30 overflow-hidden group/whatsapp"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover/whatsapp:scale-x-100 transition-transform origin-left duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <FaWhatsapp className="text-2xl group-hover/whatsapp:scale-125 transition-transform" />
                      <span>Enquire on WhatsApp</span>
                    </div>
                  </button>

                  {/* Token Payment Button */}
                  <button 
                    onClick={handlePayment}
                    className="relative w-full bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/30 overflow-hidden group/pay"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transform scale-x-0 group-hover/pay:scale-x-100 transition-transform origin-left duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3 group-hover/pay:text-[#0F172A] transition-colors">
                      <FaCheckCircle className="text-xl" />
                      <span>Pay Token (₹{car.tokenAmount?.toLocaleString() || '10,000'})</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/pay:opacity-100 transition-opacity duration-300 blur-xl bg-[#F59E0B]/50"></div>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                  {[
                    { icon: '✓', text: 'Verified' },
                    { icon: '⚡', text: 'Quick Sale' },
                    { icon: '🛡️', text: 'Secure' }
                  ].map((badge, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <p className="text-xs font-bold text-slate-600">{badge.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;