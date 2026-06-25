import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        login(data.user, data.token);
        const returnUrl = location.state?.returnUrl || '/profile';
        navigate(returnUrl);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem 2.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center', color: 'var(--text-primary)' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem', textAlign: 'center' }}>Login to access your premium ebooks.</p>

        {successMsg && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>{successMsg}</div>}
        {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Email</label>
            <input type="email" name="email" placeholder="you@example.com" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Password</label>
            <input type="password" name="password" placeholder="Your password" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '0px' }}>
            {loading ? 'Logging in...' : 'Login to Continue'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: '600', textDecoration: 'underline' }}>Register here</Link>
        </p>
    </div>
  );
}
