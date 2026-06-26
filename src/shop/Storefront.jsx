import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products.php')
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          setProducts(data.data);
        }
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map(p => p.category || 'Uncategorized'))];

  return (
    <div className="storefront">
      <header className="page-header" style={{ textAlign: 'center', margin: '5rem 0 6rem', animation: 'modalFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 4.5rem)', 
          marginBottom: '1.5rem', 
          letterSpacing: '-0.05em',
          lineHeight: '1.1',
          background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '0 1rem'
        }}>
          The Ultimate Exam Resource
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '700px', 
          margin: '0 auto',
          lineHeight: '1.6',
          padding: '0 1.5rem'
        }}>
          Get exclusive access to high-quality ebooks, notes, and preparation guides tailored specifically for students in Assam.
        </p>
      </header>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="category-rows">
          {categories.map(cat => {
            const catProducts = products.filter(p => (p.category || 'Uncategorized') === cat);
            if (catProducts.length === 0) return null;
            return (
              <section key={cat} className="category-section">
                <h2 className="category-title">{cat}</h2>
                <div className="product-row">
                  {catProducts.map(product => (
                    <Link key={product.id} to={`/product/${product.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                      <div className="card-img-wrapper">
                        <img src={`/${product.cover_image}`} alt={product.title} className="card-img" />
                      </div>
                      <div className="card-content" style={{ padding: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <h3 className="card-title" title={product.title} style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{product.title}</h3>
                        <div style={{ background: '#f1f5f9', color: '#0f172a', padding: '0.35rem 0.8rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                          ₹{product.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          {products.length === 0 && <div className="empty-state">No products found.</div>}
        </div>
      )}
    </div>
  );
}
