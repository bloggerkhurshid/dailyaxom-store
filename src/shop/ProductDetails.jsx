import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // We fetch all products and find the specific one. 
    // Ideally, we'd have a specific /api/public/products.php?id=... endpoint.
    fetch('https://digital.devkayy.in/api/products.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const found = data.data.find(p => parseInt(p.id) === parseInt(productId));
          setProduct(found);
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-secondary)' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Product Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-secondary">Return to Shop</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}
      >
        <ArrowLeft size={18} /> Back to Store
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
        {/* Left Side: Image */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem', overflow: 'hidden' }}>
            <img 
              src={`https://digital.devkayy.in/${product.cover_image}`} 
              alt={product.title} 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Right Side: Details */}
        <div style={{ flex: '2 1 400px' }}>
          <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, display: 'inline-block', marginBottom: '1rem' }}>
            {product.category || 'Uncategorized'}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 1rem 0', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {product.title}
          </h1>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '2rem' }}>
            ₹{product.price}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate(`/checkout/${product.id}`)} 
              className="btn btn-primary" 
              style={{ flex: 1, minWidth: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
            >
              <ShoppingCart size={20} /> Buy Now
            </button>
            
            {product.sample_pdf_path && (
              <a 
                href={`https://digital.devkayy.in/${product.sample_pdf_path}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary" 
                style={{ flex: 1, minWidth: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', textDecoration: 'none' }}
              >
                <Download size={20} /> Sample PDF
              </a>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              About this Ebook
            </h3>
            <div 
              className="rich-text"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
