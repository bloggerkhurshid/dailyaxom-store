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
      const res = await fetch('https://digital.devkayy.in/api/auth/login.php', {
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
    <div className="auth-split-layout">
      <div className="auth-split-left">
        <img src="https://lh3.googleusercontent.com/StPwRy2zA-7h655s7Ugj4e1RhfmTQcp-RW7qvp6Q14H72Ps_0f7Dko6j0oWL5l3yLlpvxx4JtBK7XQ5F1pdy" alt="Logo" style={{ height: '60px', borderRadius: '8px', marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>DailyAxom Store</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '300px' }}>Your premium destination for the best study materials and preparation guides.</p>
      </div>

      <div className="auth-split-right">
        <div className="auth-form-wrapper">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Welcome back</h2>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Login to access your premium ebooks.</p>

          {successMsg && <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{successMsg}</div>}
          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Your password" className="form-input" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '1rem', padding: '1rem' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Don't have an account? <Link to="/register" style={{ color: '#000', fontWeight: '600' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
