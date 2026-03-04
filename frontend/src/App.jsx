import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/layout/MainLayout';
import DashboardHome from './pages/DashboardHome';
import MembershipManagement from './pages/MembershipManagement';
import ComplaintList from './pages/ComplaintList';
import NoticeBoard from './pages/NoticeBoard';
import UserManagement from './pages/UserManagement';
import VisitorDashboard from './pages/VisitorDashboard';
import SocietySetup from './pages/SocietySetup';
import StaffManagement from './pages/StaffManagement';
import Polls from './pages/Polls';
import Amenities from './pages/Amenities';
import MaintenanceBills from './pages/MaintenanceBills';
import Visitors from './pages/Visitors';
import SecurityGuardRegistration from './pages/SecurityGuardRegistration';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Marketplace from './pages/Marketplace';

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="membership" element={<MembershipManagement />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="notices" element={<NoticeBoard />} />
        <Route path="visitors" element={<VisitorDashboard />} />
        <Route path="society-setup" element={<SocietySetup />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="polls" element={<Polls />} />
        <Route path="amenities" element={<Amenities />} />
        <Route path="maintenance" element={<MaintenanceBills />} />
        <Route path="my-visitors" element={<Visitors />} />
        <Route path="register-guard" element={<SecurityGuardRegistration />} />
        <Route path="marketplace" element={<Marketplace />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
// Force rebuild 1
