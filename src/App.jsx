import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Shop Pages
import Storefront from './shop/Storefront';
import ProductDetails from './shop/ProductDetails';
import Checkout from './shop/Checkout';
import Profile from './pages/user/Profile';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Success from './pages/Success';
import { AuthProvider } from './context/AuthContext';
import PixelTracker from './components/PixelTracker';

// Policy Pages
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PixelTracker />
        <div className="app-container">
          <Routes>
            {/* Main Application Routes */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Storefront />} />
                    <Route path="/product/:productId" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/checkout/:productId" element={<Checkout />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refund" element={<Refund />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
