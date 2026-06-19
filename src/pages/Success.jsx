import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId) {
      navigate('/');
      return;
    }
    
    // With Razorpay, the signature is securely verified in Checkout.jsx
    // before the user is ever navigated to this success page.
    setTimeout(() => navigate('/profile'), 3000);

  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: '#dcfce7', color: '#166534', padding: '2rem', borderRadius: '0px', border: '1px solid #bbf7d0' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: '1.1rem' }}>Your payment has been securely verified.</p>
        <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Redirecting to your profile so you can download your ebook...</p>
      </div>
    </div>
  );
}
