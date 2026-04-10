import React from 'react';
import { DEMO, PF } from '../data';

export default function Ticker() {
  const tickerItems = Object.entries(DEMO)
    .map(([name, p]) => {
      const avail = Object.entries(p.pf || {}).filter(([, d]) => d?.stock && d?.p);
      if (!avail.length) return null;
      const best = avail.sort((a, b) => a[1].p - b[1].p)[0];
      return {
        name,
        em: p.em,
        disc: best[1].disc || 0,
        price: best[1].p,
        pfName: PF[best[0]]?.n || 'Unknown',
      };
    })
    .filter(Boolean);

  const itemsContent = tickerItems.map((item, idx) => (
    <div key={`ticker-${item.name}-${idx}`} className="ticker-item">
      {item.em} {item.name} <span className="up">↓ {item.disc}% OFF</span> ₹
      {typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : '—'} on {item.pfName}
    </div>
  ));

  return (
    <div className="ticker">
      <div className="ticker-tag">LIVE DEALS</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {itemsContent}
          {itemsContent.map((item, idx) => React.cloneElement(item, { key: `ticker-copy-${idx}` }))}
        </div>
      </div>
    </div>
  );
}
