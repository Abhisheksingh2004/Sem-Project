import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import Contact from './pages/Contact';

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Router>
      <AuthProvider>
        <DeviceProvider>
          <div className={`app ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
            <Navbar isMobile={isMobile} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
          </div>
        </DeviceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
