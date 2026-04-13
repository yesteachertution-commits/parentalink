// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login'; // if you have a login page
import { StudentProvider } from './context/StudentContext';
import SignupPage from './pages/Signup';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage/>} /> {/* Assuming you have a signup page */}
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