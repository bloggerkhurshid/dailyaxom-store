import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your payment...');

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId) {
      navigate('/');
      return;
    }

    // Call verify.php to sync status instead of relying solely on webhook
    fetch('https://digital.devkayy.in/api/verify.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        if (data.payment_status === 'SUCCESS' || data.payment_status === 'PAID') {
          setStatus('Payment verified successfully! Redirecting to your profile...');
          setTimeout(() => navigate('/profile'), 3000);
        } else if (data.payment_status === 'FAILED' || data.payment_status === 'USER_DROPPED' || data.payment_status === 'ACTIVE') {
          setStatus('Payment was incomplete, cancelled, or failed. Please try again.');
        } else {
          setStatus('Payment status is unconfirmed. Please check your profile later.');
        }
      } else {
        setStatus('Payment failed or was cancelled. Please try again.');
      }
    })
    .catch(err => {
      setStatus('Error verifying payment status. Please check your profile.');
    });

  }, [searchParams, navigate]);

  const isFailed = status.toLowerCase().includes('failed') || status.toLowerCase().includes('cancelled');

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: isFailed ? '#fee2e2' : '#dcfce7', color: isFailed ? '#b91c1c' : '#166534', padding: '2rem', borderRadius: '12px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {isFailed ? 'Payment Failed' : 'Processing...'}
        </h1>
        <p>{status}</p>
        {isFailed && (
          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => navigate('/')} className="btn btn-primary">Return to Store</button>
          </div>
        )}
      </div>
    </div>
  );
}
