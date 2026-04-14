import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import { StudentProvider } from './context/StudentContext';
import SignupPage from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
          <Route path="/pricing" element={<Pricing />} /> {/* Pricing already wraps itself in MainLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudentProvider>
                <Dashboard />
              </StudentProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;