import React, { useState } from 'react';

export default function ReviewAnalysisCard() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeReview = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/analyze-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-glass" style={{ marginTop: '2rem', padding: '1.5rem' }}>
      <div className="card-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="card-icon" style={{ background: 'var(--red-s)', color: 'var(--red)' }}>🛡️</div>
          <h2 className="card-title">AI Fake Review Detector</h2>
        </div>
        <div className="card-tag">ML Powered</div>
      </div>
      
      <p className="card-desc" style={{ marginBottom: '1rem' }}>
        Paste a product review below to check if it's likely to be authentic or AI-generated/spam.
      </p>

      <div className="analysis-box">
        <textarea 
          className="analysis-input"
          placeholder="Paste review text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          className="analysis-btn"
          onClick={analyzeReview}
          disabled={loading || !text.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze Review'}
        </button>
      </div>

      {result && (
        <div className={`analysis-result ${result.is_fake ? 'fake' : 'real'}`}>
          <div className="res-hdr">
            <span className="res-icon">{result.is_fake ? '⚠️' : '✅'}</span>
            <span className="res-label">Result: {result.prediction}</span>
          </div>
          <div className="res-meter">
            <div className="res-bar" style={{ width: `${result.confidence}%` }}></div>
          </div>
          <div className="res-footer">
            Confidence: {result.confidence}%
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .analysis-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .analysis-input {
          width: 100%;
          min-height: 100px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px;
          color: var(--text);
          font-family: inherit;
          resize: vertical;
        }
        .analysis-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .analysis-btn:hover:not(:disabled) {
          filter: brightness(1.2);
          transform: translateY(-2px);
        }
        .analysis-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .analysis-result {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border-left: 4px solid #ccc;
        }
        .analysis-result.fake { border-color: var(--red); }
        .analysis-result.real { border-color: var(--green); }
        
        .res-hdr {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .res-meter {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .res-bar {
          height: 100%;
          background: var(--primary);
          transition: width 0.5s ease;
        }
        .fake .res-bar { background: var(--red); }
        .real .res-bar { background: var(--green); }
        
        .res-footer {
          font-size: 0.8rem;
          color: var(--text-dim);
        }
      `}} />
    </div>
  );
}
