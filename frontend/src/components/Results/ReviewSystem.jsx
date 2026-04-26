import React, { useState, useEffect } from 'react';

export default function ReviewSystem({ data }) {
  const [reviews, setReviews] = useState([]);
  const [genuinity, setGenuinity] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', body: '', name: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data?.name) return;
    fetchReviews();
  }, [data?.name]);

  const fetchReviews = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/reviews?product=${encodeURIComponent(data.name)}`);
      const json = await res.json();
      setReviews(json.reviews || []);
      
      // Amazon/Flipkart mix: Analyze aggregate authenticity
      if (json.reviews?.length > 0) {
        const sampleText = json.reviews.map(r => r.body).join(' ').substring(0, 1000);
        analyzeGenuinity(sampleText);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const analyzeGenuinity = async (text) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/analyze-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const result = await res.json();
      setGenuinity(result);
    } catch (err) {
      console.error("Genuinity check failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: data.name,
          name: newReview.name || 'Anonymous',
          rating: newReview.rating,
          title: newReview.title,
          body: newReview.body,
          verified: true
        })
      });
      if (res.ok) {
        setNewReview({ rating: 5, title: '', body: '', name: '' });
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      console.error("Failed to post review", err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="card-glass premium-reviews" style={{ marginTop: '2rem' }}>
      <div className="rev-top-section">
        <div className="rev-rating-summary">
          <h2 className="card-title">Customer Reviews</h2>
          <div className="rev-flex-hdr">
            <div className="rev-big-num">{avgRating}</div>
            <div className="rev-stars-col">
              <div className="stars-row">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</div>
              <div className="rev-count-text">{reviews.length} total ratings</div>
            </div>
          </div>
          
          {/* Rating Bars */}
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map(num => {
                const count = reviews.filter(r => r.rating === num).length;
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                    <div key={num} className="rbar-row">
                        <span>{num} star</span>
                        <div className="rbar-bg"><div className="rbar-fill" style={{ width: `${percent}%` }}></div></div>
                        <span className="rbar-perc">{Math.round(percent)}%</span>
                    </div>
                );
            })}
          </div>
        </div>

        {/* AI Authenticity Gauge */}
        <div className="rev-authenticity-card">
          <div className="auth-header">
            <span className="auth-icon">🛡️</span>
            <span className="auth-title">Authenticity Analysis</span>
          </div>
          {genuinity ? (
            <div className="auth-content">
              <div className="gauge-wrap">
                <svg className="gauge" viewBox="0 0 100 50">
                  <path className="gauge-bg" d="M 10 50 A 40 40 0 0 1 90 50" />
                  <path 
                    className={`gauge-fill ${genuinity.is_fake ? 'fake' : 'real'}`} 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    style={{ strokeDasharray: `${genuinity.confidence * 1.26}, 126` }}
                  />
                </svg>
                <div className="gauge-val">{genuinity.confidence}%</div>
              </div>
              <div className={`auth-status ${genuinity.is_fake ? 'fake' : 'real'}`}>
                {genuinity.prediction === "Genuine" ? "Trusted Reviews" : "Suspicious Activity Detected"}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 600 }}>
                Ratio: {genuinity.confidence}% Real · {100 - genuinity.confidence}% Suspicious
              </div>
              <p className="auth-desc">Our AI analyzed {reviews.length} reviews and found patterns consistent with {genuinity.prediction.toLowerCase()} feedback.</p>
            </div>
          ) : (
            <div className="auth-loading">Analyzing sentiment...</div>
          )}
        </div>
      </div>

      {/* Review Highlights */}
      <div className="rev-highlights">
          <h4 className="high-title">Review Highlights</h4>
          <div className="high-tags">
              <span className="htag positive">Excellent Sound</span>
              <span className="htag positive">Fast Delivery</span>
              <span className="htag negative">Pricey</span>
              <span className="htag positive">Premium Build</span>
          </div>
      </div>

      {/* Media Scroller */}
      <div className="rev-media-belt">
          {reviews.length > 0 && [1,2,3,4].map(i => (
              <div key={i} className="media-item"><img src={`https://picsum.photos/200/200?random=${i}`} alt="User" /></div>
          ))}
      </div>

      <div className="rev-list-container">
        {reviews.length === 0 ? (
          <div className="empty-state">No reviews yet. Share your experience!</div>
        ) : (
          <div className="rev-items">
            {reviews.map((rev, idx) => (
              <div key={idx} className="rev-item-card">
                <div className="rev-item-hdr">
                  <div className="rev-user-avatar">{rev.user_name?.[0] || 'U'}</div>
                  <div className="rev-user-info">
                    <div className="rev-user-name">{rev.user_name} {rev.verified && <span className="verified-badge">✓ Verified Buyer</span>}</div>
                    <div className="rev-item-meta">
                        <span className="rev-item-stars">{'★'.repeat(rev.rating)}</span>
                        <span className="rev-item-title">{rev.title}</span>
                    </div>
                  </div>
                  <div className="rev-date">{rev.date || 'Today'}</div>
                </div>
                <p className="rev-item-body">{rev.body}</p>
                <div className="rev-item-actions">
                  <button className="helpful-btn">Helpful ({rev.helpful || 0})</button>
                  <button className="report-btn">Report</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rev-footer-action">
        {!showForm ? (
          <button className="write-btn" onClick={() => setShowForm(true)}>Write a Product Review</button>
        ) : (
          <form className="rev-form-premium" onSubmit={handleSubmit}>
            <h3>Submit Your Feedback</h3>
            <div className="rating-select">
                {[1,2,3,4,5].map(n => (
                    <span key={n} onClick={() => setNewReview({...newReview, rating: n})} className={newReview.rating >= n ? 'on' : ''}>★</span>
                ))}
            </div>
            <input placeholder="Your Name" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} required />
            <input placeholder="Review Title" value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} required />
            <textarea placeholder="How is the product quality? Is it worth the price?" value={newReview.body} onChange={e => setNewReview({...newReview, body: e.target.value})} required />
            <div className="form-btns">
              <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Review'}</button>
              <button type="button" className="cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-reviews { padding: 2rem; }
        .rev-top-section { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; margin-bottom: 2rem; }
        
        .rev-flex-hdr { display: flex; align-items: center; gap: 1rem; margin: 1rem 0; }
        .rev-big-num { font-size: 3.5rem; font-weight: 900; color: var(--text); }
        .stars-row { color: #fbbf24; font-size: 1.2rem; }
        .rev-count-text { font-size: 0.85rem; color: var(--text-dim); }
        
        .rating-bars { display: flex; flex-direction: column; gap: 8px; }
        .rbar-row { display: flex; align-items: center; gap: 12px; font-size: 0.8rem; }
        .rbar-row span { width: 50px; }
        .rbar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .rbar-fill { height: 100%; background: #fbbf24; border-radius: 4px; }
        .rbar-perc { width: 30px; text-align: right; color: var(--text-dim); }

        .rev-authenticity-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
        }
        .auth-header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 1rem; }
        .auth-title { font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        
        .gauge-wrap { position: relative; width: 150px; margin: 0 auto; }
        .gauge { width: 100%; fill: none; stroke-width: 10; stroke-linecap: round; }
        .gauge-bg { stroke: rgba(255,255,255,0.1); }
        .gauge-fill { transition: 1s ease-out; }
        .gauge-fill.real { stroke: var(--green); }
        .gauge-fill.fake { stroke: var(--red); }
        .gauge-val { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 1.5rem; font-weight: 900; }

        .auth-status { margin-top: 1rem; font-weight: 800; font-size: 1.1rem; }
        .auth-status.real { color: var(--green); }
        .auth-status.fake { color: var(--red); }
        .auth-desc { font-size: 0.75rem; color: var(--text-dim); margin-top: 0.5rem; line-height: 1.4; }

        .rev-highlights { margin-bottom: 2rem; }
        .high-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem; }
        .high-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .htag { padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); }
        .htag.positive { background: rgba(34, 197, 94, 0.1); color: var(--green); }
        .htag.negative { background: rgba(239, 68, 68, 0.1); color: var(--red); }

        .rev-media-belt { display: flex; gap: 1rem; overflow-x: auto; margin-bottom: 2rem; }
        .media-item { width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
        .media-item img { width: 100%; height: 100%; object-fit: cover; }

        .rev-item-card { padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .rev-item-hdr { display: flex; gap: 1rem; margin-bottom: 1rem; position: relative; }
        .rev-user-avatar { width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .rev-user-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; }
        .verified-badge { font-size: 0.65rem; color: var(--green); background: rgba(34, 197, 94, 0.1); padding: 2px 6px; border-radius: 4px; margin-left: 8px; }
        .rev-item-stars { color: #fbbf24; font-size: 0.8rem; }
        .rev-item-title { font-weight: 700; margin-left: 10px; font-size: 0.9rem; }
        .rev-date { margin-left: auto; font-size: 0.75rem; color: var(--text-dim); }
        .rev-item-body { font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 1rem; }
        .rev-item-actions { display: flex; gap: 1.5rem; }
        .helpful-btn, .report-btn { background: none; border: none; color: var(--text-dim); font-size: 0.8rem; cursor: pointer; font-weight: 600; }
        .helpful-btn:hover { color: var(--primary); }

        .write-btn { 
          width: 100%; 
          padding: 1rem; 
          border-radius: 4px; 
          background: white; 
          border: 1px solid #dbdbdb; 
          color: #2874f0; 
          font-weight: 700; 
          cursor: pointer; 
          transition: 0.3s;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .write-btn:hover { background: #f9f9f9; box-shadow: 0 2px 4px 0 rgba(0,0,0,.2); }

        .rev-form-premium { background: rgba(255,255,255,0.03); padding: 2rem; border-radius: 20px; display: flex; flex-direction: column; gap: 1rem; }
        .rating-select { font-size: 1.5rem; color: rgba(255,255,255,0.1); cursor: pointer; display: flex; gap: 5px; }
        .rating-select span.on { color: #fbbf24; }
        .rev-form-premium input, .rev-form-premium textarea { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; color: white; }
        .rev-form-premium textarea { min-height: 120px; }
      `}} />
    </div>
  );
}
