import React, { useState, useEffect } from 'react';

export default function RecommendationsCard({ data }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data?.name) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/recommendations?product=${encodeURIComponent(data.name)}`);
        const json = await res.json();
        setRecommendations(json.recommendations || []);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [data?.name]);

  // Removed early return to ensure the section is always visible to the user as requested

  return (
    <div className="card-glass premium-recs" style={{ marginTop: '2rem' }}>
      <div className="rec-header">
        <div>
          <h2 className="card-title" style={{ fontSize: '1.4rem' }}>You might also like</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Inspired by your search for {data.name}</p>
        </div>
        <div className="rec-badge-ai">AI Curated</div>
      </div>

      <div className="rec-grid-wrapper">
        {loading ? (
          <div className="rec-loading-shimmer">
            {[1, 2, 3, 4].map(i => <div key={i} className="shimmer-card"></div>)}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="rec-horizontal-scroll">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="rec-premium-card">
                <div className="rec-image-wrap">
                  <img src={rec.image || 'https://via.placeholder.com/150'} alt={rec.name} />
                  {rec.is_trending && <span className="trending-tag">Trending</span>}
                </div>
                <div className="rec-body">
                  <div className="rec-cat-row">
                    <div className="rec-cat-label">{rec.category}</div>
                    {rec.rec_type && <div className="rec-type-tag">{rec.rec_type}</div>}
                  </div>
                  <h3 className="rec-item-name">{rec.name}</h3>
                  <div className="rec-price-box">
                    <span className="price-now">₹{rec.price?.toLocaleString('en-IN')}</span>
                    {rec.similarity && <span className="match-score">{Math.round(rec.similarity * 100)}% Match</span>}
                  </div>
                  <button className="rec-view-btn">View Deals</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rec-empty-msg" style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
            🔍 No direct matches found. Try searching for more popular items like "iPhone 15" to see AI recommendations!
          </div>
        )}
      </div>

      {/* Frequently Bought Together Bundle */}
      {!loading && recommendations.length >= 2 && (
        <div className="bundle-box">
          <h4 className="bundle-title">Frequently Bought Together</h4>
          <div className="bundle-items">
            <div className="bundle-item-thumb main"><img src={data.img} alt="Main" /></div>
            <div className="plus">+</div>
            <div className="bundle-item-thumb"><img src={recommendations[0].image} alt="Rec1" /></div>
            <div className="plus">+</div>
            <div className="bundle-item-thumb"><img src={recommendations[1].image} alt="Rec2" /></div>
            <div className="bundle-total">
                <div className="total-label">Total Bundle Price</div>
                <div className="total-val">₹{(data.mrp / 1.5 + recommendations[0].price + recommendations[1].price).toLocaleString('en-IN')}</div>
                <button className="bundle-btn">Add Bundle to Cart</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-recs { padding: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
        .rec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .rec-badge-ai {
          background: linear-gradient(135deg, var(--primary), #8b5cf6);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .rec-horizontal-scroll {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          padding-bottom: 1.25rem;
          scrollbar-width: thin;
        }
        .rec-premium-card {
          min-width: 200px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          transition: 0.3s;
        }
        .rec-premium-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.06); }
        
        .rec-image-wrap { height: 140px; background: white; padding: 0.75rem; position: relative; }
        .rec-image-wrap img { width: 100%; height: 100%; object-fit: contain; }
        .trending-tag {
          position: absolute; top: 8px; right: 8px;
          background: #ef4444; color: white; padding: 2px 6px;
          font-size: 0.6rem; font-weight: 800; border-radius: 4px; text-transform: uppercase;
        }

        .rec-cat-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .rec-cat-label { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; }
        .rec-type-tag { font-size: 0.6rem; background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; font-weight: 700; color: var(--primary); }
        .rec-item-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; height: 2.4em; overflow: hidden; }
        .rec-price-box { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .price-now { font-weight: 800; color: var(--green); }
        .match-score { font-size: 0.7rem; color: var(--primary); font-weight: 700; }
        
        .rec-view-btn {
          width: 100%; background: transparent; border: 1px solid var(--primary);
          color: var(--primary); padding: 6px; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .rec-view-btn:hover { background: var(--primary); color: white; }

        .bundle-box {
          margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05);
        }
        .bundle-title { margin-bottom: 1rem; font-size: 1rem; font-weight: 700; }
        .bundle-items { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .bundle-item-thumb {
          width: 60px; height: 60px; background: white; border-radius: 8px; padding: 4px;
          border: 2px solid transparent;
        }
        .bundle-item-thumb.main { border-color: var(--primary); }
        .bundle-item-thumb img { width: 100%; height: 100%; object-fit: contain; }
        .plus { font-size: 1.2rem; font-weight: 700; color: var(--text-dim); }
        
        .bundle-total { margin-left: auto; text-align: right; }
        .total-label { font-size: 0.75rem; color: var(--text-dim); }
        .total-val { font-size: 1.4rem; font-weight: 900; color: var(--green); margin-bottom: 8px; }
        .bundle-btn {
          background: var(--primary); color: white; border: none; padding: 10px 20px;
          border-radius: 10px; font-weight: 700; cursor: pointer;
        }
      `}} />
    </div>
  );
}
