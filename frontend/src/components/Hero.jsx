import React from 'react';
import { DEMO, PF } from '../data';

export default function Hero({ onDealClick = () => {} }) {
  const deals = Object.entries(DEMO)
    .slice(0, 5)
    .map(([name, p]) => {
      const avail = Object.entries(p.pf)
        .filter(([, d]) => d.stock && d.p)
        .sort((a, b) => a[1].p - b[1].p);
      if (!avail.length) return null;
      const [bk, bd] = avail[0];
      const pfc = PF[bk] || {};
      return {
        name,
        em: p.em,
        pfKey: bk,
        pfName: pfc.n || bk,
        pfColor: pfc.c || 'var(--ink)',
        disc: bd.disc || 0,
        price: bd.p,
      };
    })
    .filter(Boolean);

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-label">
          <span style={{ animation: 'pulseGlow 2s infinite', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
          India's #1 Price Comparator
        </div>
        <h1 className="hero-h1">
          Compare prices<br />
          across <em>every</em><br />
          platform
        </h1>
        <p className="hero-sub">
          Search any product — we check Amazon, Flipkart, Ajio, Myntra, Meesho &
          Snapdeal instantly using real live data.
        </p>
        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-n">6+</div>
            <div className="hstat-l">PLATFORMS</div>
          </div>
          <div className="hstat">
            <div className="hstat-n">₹0</div>
            <div className="hstat-l">TO USE</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{ color: 'var(--green)' }}>LIVE</div>
            <div className="hstat-l">PRICES</div>
          </div>
        </div>
      </div>
      <div className="hero-right">
        {deals.map((deal, idx) => (
          <button
            key={idx}
            type="button"
            className="hero-deal"
            onClick={() => onDealClick(deal.name)}
            style={{ borderLeft: `3px solid ${deal.pfColor}` }}
          >
            <div
              className="hero-deal-dot"
              style={{ backgroundColor: deal.pfColor }}
            />
            <div className="hero-deal-info">
              <div className="hero-deal-name">
                {deal.em} {deal.name}
              </div>
              <div className="hero-deal-sub">
                {deal.pfName} · {deal.disc}% off
              </div>
            </div>
            <div className="hero-deal-price" style={{ 
              background: 'var(--grn-s)', 
              padding: '3px 10px', 
              borderRadius: '8px',
              border: '1px solid var(--grn-b)'
            }}>
              ₹{deal.price.toLocaleString('en-IN')}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
