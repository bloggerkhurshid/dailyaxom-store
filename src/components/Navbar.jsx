import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="https://lh3.googleusercontent.com/StPwRy2zA-7h655s7Ugj4e1RhfmTQcp-RW7qvp6Q14H72Ps_0f7Dko6j0oWL5l3yLlpvxx4JtBK7XQ5F1pdy" alt="Logo" style={{ height: '32px', borderRadius: '10px' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span><span style={{ fontWeight: 300 }}>Daily</span><span style={{ fontWeight: 700 }}>Axom</span></span>
            <span style={{ background: '#000', color: '#fff', fontSize: '0.4em', padding: '0.2em 0.4em', borderRadius: '0px', letterSpacing: '0.05em', fontWeight: 600 }}>STORE</span>
          </span>
        </Link>
        <div className="navbar-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <Link to="/profile" className="nav-link" style={{ marginLeft: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShoppingBag size={18} /> Orders
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
