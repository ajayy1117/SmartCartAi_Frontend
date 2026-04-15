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
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/predict?product=${encodeURIComponent(data.name)}`);
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(`Server returned non-JSON response: ${text.substring(0, 30)}...`);
        }
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
      <div className="alerts-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-hd" style={{ borderBottom: '1px solid var(--line)', background: 'var(--off)' }}>
          <span className="card-hd-title">🧠 Cortex AI Insights</span>
          <span className="card-hd-sub">ANALYZING...</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ 
                flex: '1 1 200px', padding: '20px', borderRadius: 'var(--r-s)', 
                background: 'var(--off)', overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '60%', height: '10px', borderRadius: '6px', marginBottom: '12px',
                  background: 'linear-gradient(90deg, var(--off2), var(--off3), var(--off2))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear',
                }}></div>
                <div style={{ 
                  width: '40%', height: '28px', borderRadius: '8px', marginBottom: '10px',
                  background: 'linear-gradient(90deg, var(--off2), var(--off3), var(--off2))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear',
                  animationDelay: '0.3s',
                }}></div>
                <div style={{ 
                  width: '80%', height: '10px', borderRadius: '6px',
                  background: 'linear-gradient(90deg, var(--off2), var(--off3), var(--off2))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear',
                  animationDelay: '0.6s',
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return null; 
  }

  const pfc = PF[insight.best_platform] || { n: insight.best_platform, c: 'var(--ink)' };
  const isBuy = insight.recommendation === 'Buy Now';
  
  return (
    <div className="alerts-card" style={{ 
      display: 'block', 
      border: `2px solid ${isBuy ? 'var(--grn-b)' : 'var(--amb-b)'}`, 
      background: 'var(--w)', 
      borderRadius: 'var(--r)', 
      overflow: 'hidden', 
      marginTop: '1.5rem',
      boxShadow: isBuy ? 'var(--sh-green)' : 'var(--sh)',
    }}>
      <div className="card-hd" style={{ 
        borderBottom: `1px solid ${isBuy ? 'var(--grn-b)' : 'var(--amb-b)'}`, 
        background: isBuy ? 'var(--grn-s)' : 'var(--amb-s)',
      }}>
        <span className="card-hd-title" style={{ color: 'var(--ink)' }}>🧠 Cortex AI Insights</span>
        <span className="card-hd-sub" style={{ color: 'var(--ink3)' }}>LINEAR REGRESSION & RANDOM FOREST</span>
      </div>
      <div className="card-body" style={{ padding: '24px' }}>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            flex: '1 1 220px', padding: '20px', background: 'var(--off)', 
            borderRadius: 'var(--r-s)', 
            borderLeft: isBuy ? '4px solid var(--green)' : '4px solid var(--amber)',
            transition: 'all .2s',
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', color: 'var(--ink3)', fontSize: '11px', 
              textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--mono)', fontWeight: 600,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span>Price Trend Analysis</span>
              <span style={{ 
                padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
                background: insight.trend === 'DROPPING' ? 'var(--red-s)' : (insight.trend === 'RISING' ? 'var(--grn-s)' : 'var(--off2)'),
                color: insight.trend === 'DROPPING' ? 'var(--red)' : (insight.trend === 'RISING' ? 'var(--green)' : 'var(--ink3)'),
                border: `1px solid ${insight.trend === 'DROPPING' ? 'var(--red-b)' : (insight.trend === 'RISING' ? 'var(--grn-b)' : 'var(--line)')}`
              }}>
                {insight.trend === 'DROPPING' ? '📉 DROPPING' : (insight.trend === 'RISING' ? '📈 RISING' : '📊 STABLE')}
              </span>
            </h4>
            <div style={{ 
              fontSize: '28px', fontWeight: 800, fontFamily: 'var(--head)',
              color: isBuy ? 'var(--green)' : 'var(--amber)',
              display: 'flex', alignItems: 'center', gap: '8px',
              letterSpacing: '-.02em',
            }}>
              {isBuy ? '✅ BUY NOW' : '⏳ WAIT'}
              {isBuy && (
                <span style={{ 
                  display: 'inline-block', width: '10px', height: '10px', 
                  borderRadius: '50%', background: 'var(--green)',
                  animation: 'pulseGlow 2s infinite',
                }}></span>
              )}
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: 'var(--ink2)', lineHeight: '1.6' }}>
              Current: <strong>₹{insight.current_avg?.toLocaleString('en-IN')}</strong> <br/>
              Predicted: <strong>₹{insight.predicted_price?.toLocaleString('en-IN')}</strong> 
              <span style={{ 
                marginLeft: '8px', fontSize: '12px', fontWeight: 600,
                color: insight.change_pct < 0 ? 'var(--red)' : 'var(--green)'
              }}>
                ({insight.change_pct > 0 ? '+' : ''}{insight.change_pct}%)
              </span>
            </p>
          </div>

          <div style={{ 
            flex: '1 1 220px', padding: '20px', background: 'var(--off)', 
            borderRadius: 'var(--r-s)', 
            borderLeft: `4px solid ${pfc.c || 'var(--ink)'}`,
            transition: 'all .2s',
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', color: 'var(--ink3)', fontSize: '11px', 
              textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--mono)', fontWeight: 600 
            }}>
              Best Platform
            </h4>
            <div style={{ 
              fontSize: '26px', fontWeight: 800, fontFamily: 'var(--head)',
              color: pfc.c || 'var(--ink)', letterSpacing: '-.02em',
            }}>
              {pfc.n}
            </div>
            <div style={{ margin: '12px 0 0 0', fontSize: '14px', color: 'var(--ink2)' }}>
              Confidence: 
              <span style={{ 
                display: 'inline-block',
                marginLeft: '8px',
                padding: '3px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'var(--mono)',
                color: insight.confidence === 'High' ? 'var(--green)' : 
                       insight.confidence === 'Medium' ? 'var(--amber)' : 'var(--red)',
                background: insight.confidence === 'High' ? 'var(--grn-s)' : 
                            insight.confidence === 'Medium' ? 'var(--amb-s)' : 'var(--red-s)',
                border: `1.5px solid ${insight.confidence === 'High' ? 'var(--grn-b)' : 
                            insight.confidence === 'Medium' ? 'var(--amb-b)' : 'var(--red-b)'}`,
              }}>
                {insight.confidence}
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', fontSize: '11px', color: 'var(--ink4)', 
          textAlign: 'center', fontFamily: 'var(--mono)', lineHeight: '1.5' 
        }}>
          *AI predictions are generated using 30 days of historical data and simulated noise modeling.
        </div>
      </div>
    </div>
  );
}
