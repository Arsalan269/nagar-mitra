import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportIssue from './pages/ReportIssue';
import TrackReport from './pages/TrackReport';
import CommunityMap from './pages/CommunityMap';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ReportManagement from './pages/ReportManagement';
import ReportDetails from './pages/ReportDetails';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
          <Route path="/report/:id" element={<ProtectedRoute><ReportDetails /></ProtectedRoute>} />
          <Route path="/track" element={<TrackReport />} />
          <Route path="/map" element={<CommunityMap />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/reports" element={<AdminProtectedRoute><ReportManagement /></AdminProtectedRoute>} />
          <Route path="/admin/reports/:id" element={<AdminProtectedRoute><ReportDetails /></AdminProtectedRoute>} />
          <Route path="/admin/analytics" element={<AdminProtectedRoute><Analytics /></AdminProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
