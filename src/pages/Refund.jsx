import React from 'react';

const Refund = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Refund Policy</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>Digital Goods Policy</h2>
          <p>Due to the nature of digital goods (eBooks), all sales are considered final once the download link has been sent and accessed. We generally do not offer refunds.</p>
        </section>

        <section>
          <h2>Exceptions</h2>
          <p>Refunds may be considered under the following circumstances:</p>
          <ul>
            <li>You were charged multiple times for the same transaction.</li>
            <li>The file you received is corrupted or significantly different from the product description.</li>
          </ul>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you believe you are eligible for a refund, please contact our support team within 7 days of your purchase.</p>
        </section>
      </div>
    </div>
  );
};

export default Refund;
