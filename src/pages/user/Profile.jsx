import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://digital.devkayy.in/api/user/profile.php', {
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
        <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary">Logout</button>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>My Ebooks</h2>
      
      {loading ? (
        <div>Loading your purchases...</div>
      ) : purchases.length > 0 ? (
        <div style={{ overflowX: 'auto', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', borderRadius: '0px', border: '1px solid rgba(0, 0, 0, 0.15)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.4)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>Ebook Title</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>Purchased On</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>Expires In</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, textAlign: 'right', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(item => {
                const expiryStatus = calculateExpiry(item.expires_at);
                const isExpired = expiryStatus === 'Expired';
                
                return (
                  <tr key={item.order_id}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500, border: '1px solid var(--glass-border)' }}>{item.title}</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>{new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: isExpired ? '#b91c1c' : 'var(--text-secondary)', fontWeight: isExpired ? 600 : 400, border: '1px solid var(--glass-border)' }}>
                      {expiryStatus}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', border: '1px solid var(--glass-border)' }}>
                      {isExpired ? (
                        <button disabled className="btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0px', background: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' }}>
                          Expired
                        </button>
                      ) : (
                        <a href={`https://digital.devkayy.in/api/download.php?token=${item.token}`} download target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0px' }}>
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '0px', border: '1px dashed #ccc' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>You haven't purchased any ebooks yet.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Browse Store</button>
        </div>
      )}
    </div>
  );
}
