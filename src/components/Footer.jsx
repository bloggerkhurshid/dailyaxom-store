import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/refund">Refunds</Link>
        </div>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} DailyAxom. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
