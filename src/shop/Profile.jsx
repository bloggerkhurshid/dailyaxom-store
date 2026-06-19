import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id');

  return (
    <div className="profile-page">
      <div className="status-container">
        {status === 'success' ? (
          <>
            <CheckCircle className="status-icon success" size={64} />
            <h1>Order Successful!</h1>
            <p>Your order (<strong>{orderId}</strong>) has been processed successfully.</p>
            <div className="info-box">
              <p>We've sent a secure download link to your email address. The link will expire in 30 days.</p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="status-icon error" size={64} />
            <h1>Order Failed</h1>
            <p>There was an issue processing your order. Please try again.</p>
          </>
        )}
      </div>
    </div>
  );
}
