import React, { useState } from 'react';
import { PKS, PF } from '../data';

const QUERIES = [
  'Sony WH-1000XM5',
  'Nike Air Force 1',
  'Apple iPhone 15',
  'boAt Airdopes 141',
  'Samsung Galaxy S24',
  'Dyson Airwrap',
  'Lakme lipstick',
  'JBL speaker',
];

export default function SearchZone({ activePF, togglePF, onSearch }) {
  const [query, setQuery] = useState('');
  const MAX_PF = 6;

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div className="search-zone">
      <div className="search-zone-inner">
        <div className="search-wrap">
          <div className="search-icon">🔍</div>
          <input
            className="search-field"
            type="text"
            placeholder="Search any product — headphones, shoes, phone, makeup…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {query && (
            <button
              type="button"
              className="search-clr"
              style={{ display: 'flex' }}
              onClick={clearQuery}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <div className="search-sep"></div>
          <button className="search-btn" onClick={handleSearch}>
            COMPARE →
          </button>
        </div>

        <div className="pf-row">
          {PKS.slice(0, MAX_PF).map((k) => {
            const isActive = activePF.has(k);
            const pfc = PF[k] || {};
            return (
              <button
                key={k}
                className={`pfbtn ${isActive ? 'on' : ''}`}
                style={{ backgroundColor: isActive ? pfc.c : undefined }}
                onClick={() => togglePF(k)}
              >
                <div
                  className="dot"
                  style={{ background: 'rgba(255,255,255,.8)' }}
                ></div>
                {pfc.n || k}
                <span className="ck">✓</span>
              </button>
            );
          })}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', alignSelf: 'center' }}>
            {activePF.size}/6
          </span>
        </div>

        <div className="qrow">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '.06em', fontWeight: 500 }}>
            TRENDING →
          </span>
          {QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              className="qbtn"
              onClick={() => {
                setQuery(q);
                onSearch(q);
              }}
              aria-label={`Search ${q}`}
            >
              {q.replace('Apple ', '').replace('Samsung ', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
