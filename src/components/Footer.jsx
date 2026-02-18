// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import logo from '../assets/logolight.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Inventory', path: '/' },
      { name: 'New Arrivals', path: '/' },
      { name: 'Luxury Collection', path: '/' },
      { name: 'Special Offers', path: '/' },
    ],
    company: [
      { name: 'About Us', path: '#' },
      { name: 'Our Team', path: '#' },
      { name: 'Customer Reviews', path: '#' },
      { name: 'Contact Us', path: '#' },
    ],
    support: [
      { name: 'Financing', path: '#' },
      { name: 'Trade-In', path: '#' },
      { name: 'Test Drive', path: '#' },
      { name: 'Privacy Policy', path: '#' },
    ]
  };

  return (
    <footer className="relative bg-[#0F172A] pt-20 pb-10 overflow-hidden mt-20">
      {/* Animated Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent"></div>
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-10 left-[-5%] w-[400px] h-[400px] bg-[#F59E0B]/5 rounded-full blur-[100px] animate-float-delayed"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block group">
              <img src={logo} alt="Caromotors" className="h-16 brightness-0 invert group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Caromotors is your premier destination for high-quality pre-owned vehicles. 
              We combine transparent pricing with exceptional service to deliver your dream drive.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white/5 hover:bg-[#F59E0B] rounded-xl text-slate-300 hover:text-[#0F172A] transition-all duration-300 hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links with Hover Effects */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-xs border-l-4 border-[#F59E0B] pl-4">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-slate-400 hover:text-[#F59E0B] text-sm font-bold flex items-center gap-2 group transition-all duration-300">
                      <FaChevronRight className="text-[10px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-white/5">
          <div className="flex items-center gap-4 text-slate-300 group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#F59E0B]/10 transition-colors">
              <FaPhoneAlt className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Call Us</p>
              <p className="font-bold">+91 6238433075</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300 group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#F59E0B]/10 transition-colors">
              <FaEnvelope className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Email Us</p>
              <p className="font-bold">caromotors@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300 group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#F59E0B]/10 transition-colors">
              <FaMapMarkerAlt className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Visit Us</p>
              <p className="font-bold">Mayur Vihar, Phase III , Delhi</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs font-medium tracking-wide">
            © {currentYear} <span className="text-white font-bold">Caromotors</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://img.icons8.com/color/48/visa.png" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/razorpay.png" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all" alt="Razorpay" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;