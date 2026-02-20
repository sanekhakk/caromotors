import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext , { AuthProvider } from './context/AuthContext';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import AddCar from './pages/admin/AddCar';
import CarDetails from './pages/CarDetails';
import UserDashboard from './pages/UserDashboard';
import ManageBookings from './pages/admin/ManageBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ManageInventory from './pages/admin/ManageInventory';
import AdminLayout from './pages/admin/AdminLayout';
import Wishlist from './pages/Wishlist';
import Footer from './components/Footer';
import Categories from './pages/Categories';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Caromotors...</div>;

  return (
    <Routes>
      {/* 1. ADMIN BRANCH - Simplified for direct access */}
      {user && user.role === 'admin' ? (
        <>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageInventory />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          {/* Redirect any root access to admin dashboard */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </>
      ) : (
        /* 2. USER/GUEST BRANCH */
        <Route element={<><Navbar /><Outlet /><Footer /></>}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
};

// 2. The main App component only provides the context 
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
export default App;