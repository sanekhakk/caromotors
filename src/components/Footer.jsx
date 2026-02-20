import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../assets/logolight.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] pt-12 pb-6 relative overflow-hidden mt-12">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent"></div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Brand + Socials */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
          <div>
            <img src={logo} alt="Caromotors" className="h-14 brightness-0 invert mb-3" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your premier destination for high-quality pre-owned vehicles. Transparent pricing, exceptional service.
            </p>
            <div className="flex gap-3 mt-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-white/5 hover:bg-[#F59E0B] rounded-xl text-slate-300 hover:text-[#0F172A] transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links — 3 columns on mobile as well */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            {[
              { title: 'Shop', links: ['All Inventory', 'New Arrivals', 'Luxury', 'Offers'] },
              { title: 'Company', links: ['About Us', 'Our Team', 'Reviews', 'Contact'] },
              { title: 'Support', links: ['Financing', 'Trade-In', 'Test Drive', 'Privacy'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-black text-[10px] uppercase tracking-widest border-l-2 border-[#F59E0B] pl-2 mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link to="/" className="text-slate-500 hover:text-[#F59E0B] text-xs font-bold transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-white/5 mb-6">
          {[
            { icon: FaPhoneAlt, label: 'Call Us', value: '+91 6238433075' },
            { icon: FaEnvelope, label: 'Email Us', value: 'caromotors@gmail.com' },
            { icon: FaMapMarkerAlt, label: 'Visit Us', value: 'Mayur Vihar, Phase III, Delhi' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 text-slate-300">
              <div className="p-2.5 bg-white/5 rounded-xl flex-shrink-0">
                <Icon className="text-[#F59E0B]" size={14} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">{label}</p>
                <p className="font-bold text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs font-medium">
            © {currentYear} <span className="text-white font-bold">Caromotors</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { src: "https://img.icons8.com/color/48/visa.png", alt: "Visa" },
              { src: "https://img.icons8.com/color/48/mastercard.png", alt: "Mastercard" },
              { src: "https://img.icons8.com/color/48/razorpay.png", alt: "Razorpay" },
            ].map(p => (
              <img key={p.alt} src={p.src} className="h-5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all" alt={p.alt} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;