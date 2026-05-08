import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

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

function App() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Subscription logic to backend would go here
          }
        }
      }
    };
    requestNotificationPermission();
  }, []);

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;