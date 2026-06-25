import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

export default function ReceiptModal({ token, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    fetch(`https://digital.devkayy.in/api/receipt.php?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setOrder(data.data);
        } else {
          setError(data.message || 'Failed to load receipt data.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Network error loading receipt.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = () => {
    if (!order || !receiptRef.current) return;
    setIsDownloading(true);

    const element = receiptRef.current;
    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `Receipt_${order.razorpay_order_id || order.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch(err => {
      console.error(err);
      setIsDownloading(false);
      alert('Failed to generate PDF. Please try again.');
    });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '95%', background: '#f4f4f5', padding: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button onClick={onClose} className="btn" style={{ background: 'white', border: '1px solid #e4e4e7', color: '#18181b', padding: '0.5rem 1rem' }}>
            Close
          </button>
          {order && (
            <button onClick={handleDownload} disabled={isDownloading} className="btn btn-primary" style={{ background: '#18181b', color: 'white' }}>
              {isDownloading ? 'Saving PDF...' : 'Download PDF'}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading receipt...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
        ) : order ? (
          <div ref={receiptRef} style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#18181b', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f4f4f5', paddingBottom: '2rem', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://lh3.googleusercontent.com/StPwRy2zA-7h655s7Ugj4e1RhfmTQcp-RW7qvp6Q14H72Ps_0f7Dko6j0oWL5l3yLlpvxx4JtBK7XQ5F1pdy" alt="DailyAxom Logo" style={{ width: '38px', height: '38px', borderRadius: '10px' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>Daily<span style={{ fontWeight: 300 }}>Axom</span></div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#71717a', marginTop: '0.75rem' }}>
                  contact@projuktisoft.com<br/>www.dailyaxom.in
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receipt</h1>
                <p style={{ margin: '0.5rem 0 0', color: '#71717a', fontSize: '1.1rem' }}>
                  Date: {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', color: '#71717a', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billed To</h3>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 500, fontSize: '1.1rem' }}>{order.customer_name}</p>
                <p style={{ margin: '0 0 0.25rem', color: '#52525b' }}>{order.customer_email}</p>
                <p style={{ margin: 0, color: '#52525b' }}>{order.customer_phone}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#71717a', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Details</h3>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 500, fontSize: '1.1rem' }}>Order ID: {order.razorpay_order_id || order.id}</p>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '1.1rem' }}>Payment Status: <span style={{ color: '#16a34a' }}>Success</span></p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#f4f4f5', padding: '1rem', textAlign: 'left', color: '#52525b', textTransform: 'uppercase', fontSize: '0.85rem' }}>Description</th>
                  <th style={{ backgroundColor: '#f4f4f5', padding: '1rem', textAlign: 'right', color: '#52525b', textTransform: 'uppercase', fontSize: '0.85rem' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #e4e4e7' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{order.product_title}</div>
                    <div style={{ color: '#71717a', fontSize: '0.9rem' }}>Digital Ebook Download</div>
                  </td>
                  <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #e4e4e7', textAlign: 'right', fontWeight: 500 }}>
                    ₹{parseFloat(order.amount).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: 700, fontSize: '1.2rem', borderTop: '2px solid #18181b' }}>Total Paid</td>
                  <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: 700, fontSize: '1.2rem', color: '#16a34a', borderTop: '2px solid #18181b' }}>
                    ₹{parseFloat(order.amount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'center', color: '#71717a', fontSize: '0.9rem', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e4e4e7' }}>
              <p style={{ margin: '0 0 0.5rem' }}>Thank you for shopping with DailyAxom!</p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>This is a computer-generated receipt and does not require a physical signature.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
