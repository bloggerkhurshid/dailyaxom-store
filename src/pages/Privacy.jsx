import React from 'react';

const Privacy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>1. Information We Collect</h2>
          <p>When you make a purchase, we collect necessary information to process your order, including your name, email address, and phone number.</p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information exclusively to process payments, deliver your digital products via email, and provide customer support. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2>3. Payment Security</h2>
          <p>Payment processing is handled securely by Razorpay. We do not store or have access to your raw credit card details or banking information.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
