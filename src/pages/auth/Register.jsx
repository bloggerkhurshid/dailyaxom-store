import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp_number: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch('https://digital.devkayy.in/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        const returnUrl = location.state?.returnUrl;
        navigate('/login', { state: { message: 'Registration successful! Please login.', returnUrl } });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
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
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Create account</h2>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Start your exam preparation today.</p>

          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="full_name" placeholder="Your full name" className="form-input" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Whatsapp Number</label>
              <input type="tel" name="whatsapp_number" placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" className="form-input" value={formData.whatsapp_number} onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value.replace(/\D/g, '')})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Minimum 6 characters" className="form-input" value={formData.password} onChange={handleChange} minLength="6" required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm_password" placeholder="Confirm password" className="form-input" value={formData.confirm_password} onChange={handleChange} minLength="6" required />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '1rem', padding: '1rem' }}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: '#000', fontWeight: '600' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
