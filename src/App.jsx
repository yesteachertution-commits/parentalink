import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { PusherProvider } from './context/PusherProvider';
import { FiWifiOff } from 'react-icons/fi';
import ReloadPrompt from './components/ReloadPrompt';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const SignupPage = lazy(() => import('./pages/Signup'));
const Superadmin = lazy(() => import('./pages/Superadmin'));

// Fallback loader
const FallbackLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-orange-600 text-white z-[9999] py-2 flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all duration-300">
      <FiWifiOff size={18} /> No Internet Connection - Viewing Offline Data
    </div>
  );
};

function App() {

  return (
    <>
      <OfflineBanner />
      <ReloadPrompt />
      <AuthProvider>
      <PusherProvider>
        <Router>
          <Suspense fallback={<FallbackLoader />}>
            <Routes>
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
              <Route path="/pricing" element={<Pricing />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupPage/>} />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'parent']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/superadmin" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Superadmin />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </Router>
      </PusherProvider>
    </AuthProvider>
    </>
  );
}

export default App;