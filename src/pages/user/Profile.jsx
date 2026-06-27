import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReceiptModal from '../../components/ReceiptModal';

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptToken, setSelectedReceiptToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('/api/user/profile.php', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setPurchases(data.purchases);
      } else {
        if (data.message.includes('Unauthorized')) {
          logout();
          navigate('/login');
        }
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [token, navigate, logout]);

  if (!user) return null;

  const calculateExpiry = (expiresAt) => {
    if (!expiresAt) return 'Unknown';
    // Replace hyphens with slashes for Safari compatibility
    const expiryDate = new Date(expiresAt.replace(/-/g, '/'));
    const now = new Date();
    const diffTime = expiryDate - now;
    
    if (diffTime <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} days`;
    
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hours`;
    
    return 'Less than an hour';
  };

  return (
    <div className="profile-container" style={{ width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid #eaeaea' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif' }}>My Profile</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Welcome back, {user.full_name}</p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5', background: '#fef2f2' }}>Logout</button>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>My Ebooks</h2>
      
      {loading ? (
        <div>Loading your purchases...</div>
      ) : purchases.length > 0 ? (
        <div className="purchase-list-container">
          {purchases.map(item => {
            const expiryStatus = calculateExpiry(item.expires_at);
            const isExpired = expiryStatus === 'Expired';
            
            return (
              <div key={item.order_id} className="purchase-item">
                <div className="purchase-item-details">
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 600 }}>{item.title}</h3>
                  <div style={{ fontSize: '0.9rem', color: isExpired ? '#b91c1c' : 'var(--text-secondary)', fontWeight: isExpired ? 600 : 400 }}>
                    Expires: {expiryStatus}
                  </div>
                </div>
                
                <div className="purchase-item-actions">
                  <button onClick={() => setSelectedReceiptToken(item.token)} className="btn" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', borderRadius: '0px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    Receipt
                  </button>
                  {isExpired ? (
                    <button disabled className="btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0px', background: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed', border: 'none' }}>
                      Expired
                    </button>
                  ) : (
                    <a href={`/api/download.php?token=${item.token}`} download target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0px', textDecoration: 'none' }}>
                      Download
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '0px', border: '1px dashed #ccc' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>You haven't purchased any ebooks yet.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Browse Store</button>
        </div>
      )}

      {selectedReceiptToken && (
        <ReceiptModal token={selectedReceiptToken} onClose={() => setSelectedReceiptToken(null)} />
      )}
    </div>
  );
}
