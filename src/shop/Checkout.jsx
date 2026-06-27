import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [authMode, setAuthMode] = useState('login'); 
  const [authData, setAuthData] = useState({ full_name: '', email: '', whatsapp_number: '', password: '', confirm_password: '' });
  const [authError, setAuthError] = useState('');
  
  const [checkoutData, setCheckoutData] = useState({ customer_name: '', customer_email: '', customer_phone: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products.php?id=${productId}`)
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          setProduct(data.data);
        } else {
          navigate('/');
        }
      })
      .finally(() => setPageLoading(false));
  }, [productId, navigate]);

  useEffect(() => {
    if (user) {
      setAuthMode('checkout');
      setCheckoutData({
        customer_name: user.full_name || '',
        customer_email: user.email || '',
        customer_phone: user.whatsapp_number || ''
      });
    } else {
      setAuthMode('login');
    }
  }, [user]);

  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    const isLogin = authMode === 'login';
    const endpoint = isLogin ? 'https://digital.devkayy.in/api/auth/login.php' : 'https://digital.devkayy.in/api/auth/register.php';

    if (!isLogin && authData.password !== authData.confirm_password) {
      setAuthError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        login(data.user, data.token); 
      } else {
        setAuthError(data.message);
      }
    } catch (err) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://digital.devkayy.in/api/checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          user_id: user.id,
          ...checkoutData
        })
      });
      const data = await response.json();
      if(data.status === 'success' && data.razorpay_order_id) {
        const res = await loadRazorpayScript();
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }

        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: "DailyAxom",
          description: "Ebook Purchase",
          image: "https://lh3.googleusercontent.com/StPwRy2zA-7h655s7Ugj4e1RhfmTQcp-RW7qvp6Q14H72Ps_0f7Dko6j0oWL5l3yLlpvxx4JtBK7XQ5F1pdy",
          order_id: data.razorpay_order_id,
          handler: async function (response) {
            try {
              const verifyRes = await fetch('https://digital.devkayy.in/api/verify.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.status === 'success') {
                navigate('/success?order_id=' + data.razorpay_order_id);
              } else {
                alert('Payment verification failed: ' + verifyData.message);
              }
            } catch (err) {
              alert('Error verifying payment.');
            }
          },
          prefill: {
            name: data.customer_name,
            email: data.customer_email,
            contact: data.customer_phone
          },
          theme: {
            color: "#000000"
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
      } else {
        alert("Checkout failed: " + data.message);
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if(pageLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading product details...</div>;
  if(!product) return null;

  return (
      <div className="checkout-page-container" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Secure Checkout</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Complete your purchase to get instant access.</p>
        </div>

        <div className="checkout-split-layout">
          {/* Left Side: Order Summary */}
          <div className="checkout-summary" style={{ borderRadius: '0px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <img src={product.cover_image?.startsWith('http') ? product.cover_image.replace('http://localhost:7071', 'https://digital.devkayy.in') : `https://digital.devkayy.in/${product.cover_image}`} alt={product.title} style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '0px', border: '1px solid var(--border-color)' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.category || 'Ebook'}</p>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>₹{product.price}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ color: 'var(--text-primary)' }}>
                        <svg strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                        </svg>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', margin: '0 0 0.2rem 0' }}>Instant Delivery</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Instantly download from your profile section.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ color: 'var(--text-primary)' }}>
                        <svg strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', margin: '0 0 0.2rem 0' }}>30-Day Access</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Download within 30 days before link expires.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ color: 'var(--text-primary)' }}>
                        <svg strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 15V3"/>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <path d="m7 10 5 5 5-5"/>
                        </svg>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', margin: '0 0 0.2rem 0' }}>Offline Forever</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Yours to keep and study offline anytime.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="checkout-form-container">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{authMode === 'checkout' ? 'Payment Details' : 'Account Details'}</h2>
            
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '2.5rem', borderRadius: '0px' }}>
              {authMode === 'checkout' ? (
                <form onSubmit={handleCheckoutSubmit}>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Your Name</label>
                    <input type="text" required className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="Full name" value={checkoutData.customer_name} onChange={(e) => setCheckoutData({...checkoutData, customer_name: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Email</label>
                    <input type="email" required className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="Email address" value={checkoutData.customer_email} onChange={(e) => setCheckoutData({...checkoutData, customer_email: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>WhatsApp Number</label>
                    <input type="tel" required pattern="[0-9]{10}" maxLength="10" className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="10-digit number" value={checkoutData.customer_phone} onChange={(e) => setCheckoutData({...checkoutData, customer_phone: e.target.value.replace(/\D/g, '')})} />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '0px' }}>
                    {loading ? 'Processing...' : `Pay Securely — ₹${product.price}`}
                  </button>
                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Secured by Razorpay. 100% encrypted.</p>
                </form>
              ) : (
                <div>
                  {authError && <div style={{ background: authError.includes('created') ? '#dcfce7' : '#fee2e2', color: authError.includes('created') ? '#166534' : '#ef4444', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: `1px solid ${authError.includes('created') ? '#bbf7d0' : '#fecaca'}`, textAlign: 'center', borderRadius: '0px' }}>{authError}</div>}
                  
                  <form onSubmit={handleAuthSubmit}>
                    {authMode === 'register' && (
                      <>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Your Name</label>
                          <input type="text" name="full_name" className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="Full name" value={authData.full_name} onChange={handleAuthChange} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>WhatsApp</label>
                          <input type="tel" name="whatsapp_number" className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" value={authData.whatsapp_number} onChange={(e) => setAuthData({...authData, whatsapp_number: e.target.value.replace(/\D/g, '')})} required />
                        </div>
                      </>
                    )}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Email</label>
                      <input type="email" name="email" className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="Email address" value={authData.email} onChange={handleAuthChange} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Password</label>
                      <input type="password" name="password" className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="Password" value={authData.password} onChange={handleAuthChange} required minLength="6" />
                    </div>
                    {authMode === 'register' && (
                      <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Confirm Password</label>
                        <input type="password" name="confirm_password" className="form-input" style={{ width: '100%', borderRadius: '0px' }} placeholder="Confirm Password" value={authData.confirm_password} onChange={handleAuthChange} required minLength="6" />
                      </div>
                    )}
                    
                    <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '0px' }}>
                      {loading ? 'Please wait...' : (authMode === 'login' ? 'Login to Continue' : 'Create Account')}
                    </button>
                  </form>
                  
                  <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    {authMode === 'login' ? (
                      <>New here? <span style={{color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline'}} onClick={() => {setAuthMode('register'); setAuthError('');}}>Sign up securely</span></>
                    ) : (
                      <>Already have an account? <span style={{color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline'}} onClick={() => {setAuthMode('login'); setAuthError('');}}>Log in</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
