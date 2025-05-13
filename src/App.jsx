// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './models/Login'; // if you have a login page
import SignupModal from './models/Signup'; // if you have a signup page
import { StudentProvider } from './context/StudentContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupModal/>} /> {/* Assuming you have a signup page */}
          <Route path="/dashboard" element={
            <StudentProvider>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </StudentProvider>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;