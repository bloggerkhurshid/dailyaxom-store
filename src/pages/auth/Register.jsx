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
      const res = await fetch('/api/auth/register.php', {
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
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem 2.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center', color: 'var(--text-primary)' }}>Create account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem', textAlign: 'center' }}>Start your exam preparation today.</p>

        {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Full Name</label>
            <input type="text" name="full_name" placeholder="Your full name" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Email</label>
            <input type="email" name="email" placeholder="you@example.com" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Whatsapp Number</label>
            <input type="tel" name="whatsapp_number" placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.whatsapp_number} onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value.replace(/\D/g, '')})} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Password</label>
            <input type="password" name="password" placeholder="Minimum 6 characters" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.password} onChange={handleChange} minLength="6" required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Confirm Password</label>
            <input type="password" name="confirm_password" placeholder="Confirm password" className="form-input" style={{ width: '100%', borderRadius: '0px' }} value={formData.confirm_password} onChange={handleChange} minLength="6" required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '0px' }}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '600', textDecoration: 'underline' }}>Login here</Link>
        </p>
    </div>
  );
}
