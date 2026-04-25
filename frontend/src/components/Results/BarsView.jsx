import React from 'react';
import { PF } from '../../data';

export default function BarsView({ avail }) {
  if (!avail || avail.length === 0) {
    return null;
  }

  const prices = avail.map(([, d]) => d.p).filter((p) => typeof p === 'number');
  if (!prices.length) {
    return null;
  }

  const maxP = Math.max(...prices);
  const minP = Math.min(...prices);

  return (
    <div className="bars-card" style={{ display: 'block' }}>
      <div className="bars-title">Visual Price Comparison</div>
      {avail.map(([k, d], i) => {
        const pfc = PF[k];
        if (!pfc) return null;
        const price = typeof d.p === 'number' ? d.p : 0;
        const pct = maxP ? Math.round((price / maxP) * 100) : 0;
        const isBest = price === minP;
        const animDelay = `${i * 0.06}s`;

        return (
          <div key={k} className="bar-row" style={{ animation: `up 0.4s ${animDelay} ease both` }}>
            <div className="bar-lbl" style={{ color: pfc.c }}>
              {pfc.em} {pfc.n}
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${pct}%`, background: pfc.c, animationDelay: `${i * 0.08}s` }}
              ></div>
            </div>
            <div className="bar-price" style={{ color: isBest ? 'var(--green)' : 'var(--ink)' }}>
              ₹{d.p.toLocaleString('en-IN')}{isBest ? ' 🏆' : ''}
            </div>
            <div className="bar-disc">-{d.disc || 0}%</div>
          </div>
        );
      })}
    </div>
  );
}
