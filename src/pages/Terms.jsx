import React from 'react';

const Terms = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to DailyAxom Shop. By accessing our website and purchasing our digital products, you agree to be bound by these Terms of Service.</p>
        </section>

        <section>
          <h2>2. Digital Products</h2>
          <p>All products sold on this platform are digital goods (eBooks). Upon successful payment, you will receive a secure download link. These links are valid for 30 days from the time of purchase.</p>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>The content of our eBooks is protected by copyright. You may not distribute, reproduce, or resell any part of the purchased material without explicit permission.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
