import React, { useState, useEffect } from 'react';
import { PF } from '../../data';

export default function AIPredictionCard({ data }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data?.name) return;

    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/predict?product=${encodeURIComponent(data.name)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to predict');
        setInsight(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [data?.name]);

  if (loading) {
    return (
      <div className="alerts-card" style={{ padding: '20px', textAlign: 'center', background: 'var(--off)', border: '1.5px solid var(--line)', borderRadius: 'var(--r-s)' }}>
        <div style={{ color: 'var(--ink)' }}>🧠 AI is analyzing 30-day trends...</div>
      </div>
    );
  }

  if (error || !insight) {
    return null; 
  }

  const pfc = PF[insight.best_platform] || { n: insight.best_platform, c: 'var(--ink)' };
  
  return (
    <div className="alerts-card" style={{ display: 'block', border: '1.5px solid var(--ink)', background: 'var(--w)', borderRadius: 'var(--r-s)', overflow: 'hidden', marginBottom: '1.5rem' }}>
      <div className="card-hd" style={{ borderBottom: '1px solid var(--ink)', background: 'var(--ink)' }}>
        <span className="card-hd-title" style={{ color: 'var(--w)', fontFamily: 'var(--head)' }}>🧠 Cortex AI Insights</span>
        <span className="card-hd-sub" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--mono)', fontSize: '10px' }}>LINEAR REGRESSION & RANDOM FOREST</span>
      </div>
      <div className="card-body" style={{ padding: '20px' }}>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', padding: '16px', background: 'var(--off)', borderRadius: '8px', borderLeft: insight.recommendation === 'Buy Now' ? '4px solid var(--green)' : '4px solid var(--red)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ink3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--head)' }}>Price Trend Analysis</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: insight.recommendation === 'Buy Now' ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--head)' }}>
              {insight.recommendation === 'Buy Now' ? '✅ BUY NOW' : '⏳ WAIT'}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink2)' }}>
              Current Avg: ₹{insight.current_avg?.toLocaleString('en-IN')} <br/>
              Predicted Tomorrow: ₹{insight.predicted_price?.toLocaleString('en-IN')}
            </p>
          </div>

          <div style={{ flex: '1 1 200px', padding: '16px', background: 'var(--off)', borderRadius: '8px', borderLeft: `4px solid ${pfc.c || 'var(--ink)'}` }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ink3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--head)' }}>Next Target Platform</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ink)', fontFamily: 'var(--head)' }}>
              {pfc.n}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink2)' }}>
              Probability Confidence: 
              <span style={{ 
                color: insight.confidence === 'High' ? 'var(--green)' : 
                       insight.confidence === 'Medium' ? 'var(--amber)' : 'var(--red)',
                marginLeft: '4px', fontWeight: 'bold'
              }}>
                 {insight.confidence}
              </span>
            </p>
          </div>
        </div>

        <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--ink3)', fontStyle: 'italic', textAlign: 'center', fontFamily: 'var(--mono)' }}>
          *AI Predictions are probabilistically generated using 30 days of historical data and simulated noise modeling to assess market volatility.
        </div>
      </div>
    </div>
  );
}
