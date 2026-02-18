import { Link } from 'react-router-dom';
import { FaCar, FaUsers, FaClipboardList, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Control Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Car Management Card [cite: 130] */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <FaCar className="text-3xl text-blue-500" />
            <Link to="/admin/add-car" className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
              <FaPlus />
            </Link>
          </div>
          <h2 className="text-xl font-semibold">Inventory</h2>
          <p className="text-gray-600 text-sm mt-2">Manage car listings, edit details, and mark as sold [cite: 131-135].</p>
          <Link to="/admin/manage-cars" className="mt-4 block text-blue-600 font-medium hover:underline">View All Cars →</Link>
        </div>

        {/* Booking Management Card [cite: 140] */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <FaClipboardList className="text-3xl text-green-500 mb-4" />
          <h2 className="text-xl font-semibold">Bookings</h2>
          <p className="text-gray-600 text-sm mt-2">Track token payments, transaction IDs, and update status [cite: 141-143].</p>
          <Link to="/admin/bookings" className="mt-4 block text-green-600 font-medium hover:underline">Manage Bookings →</Link>
        </div>

        {/* User Management Card [cite: 136] */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <FaUsers className="text-3xl text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-gray-600 text-sm mt-2">View registered customers and manage roles [cite: 137-139].</p>
          <Link to="/admin/users" className="mt-4 block text-purple-600 font-medium hover:underline">View Users →</Link>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Business Overview</h2>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Status:</span>
              <span className="text-green-400">Live</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Mode:</span>
              <span>Single Vendor [cite: 18]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;