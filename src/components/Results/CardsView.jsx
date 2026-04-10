import React from 'react';
import { PF } from '../../data';

export default function CardsView({ avail, data, activePF, minP, maxP }) {
  const sortedKeys = [...activePF];
  const sorted = [
    ...avail,
    ...sortedKeys
      .filter((k) => !avail.find(([ak]) => ak === k))
      .map((k) => [k, data.pf[k] || {}]),
  ];

  return (
    <div className="cards" style={{ display: 'grid' }}>
      {sorted.map(([k, d], i) => {
        const pfc = PF[k];
        if (!pfc) return null;

        const isBest = d.p && d.p === minP;
        const isMiss = !d.stock || !d.p;
        const bw = d.p ? Math.round(((d.p - minP) / (maxP - minP || 1)) * 60 + 40) : 0;
        const animDelay = `${i * 0.05}s`;

        if (isMiss) {
          return (
            <div key={k} className="pcard miss" style={{ animation: `pop 0.35s ${animDelay} ease both` }}>
              <div className="pcard-topline" style={{ background: 'var(--off3)' }}></div>
              <div className="pcard-img-area">
                <div className="pcard-emoji">{data.em || '📦'}</div>
              </div>
              <div className="pcard-body">
                <div className="pcard-row1">
                  <div className="pcard-logo" style={{ background: pfc.s }}>{pfc.em}</div>
                  <div className="pcard-store">{pfc.n}</div>
                </div>
                <div className="pcard-miss-msg">Not available on {pfc.n}</div>
              </div>
            </div>
          );
        }

        const ratingValue = Number.isFinite(d.r) ? Math.min(5, Math.max(0, Number(d.r))) : 0;
        const fullStars = Math.floor(ratingValue);
        const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

        return (
          <div key={k} className={`pcard ${isBest ? 'best' : ''}`} style={{ animation: `pop 0.35s ${animDelay} ease both` }}>
            <div className="pcard-topline" style={{ background: pfc.c }}></div>
            {isBest && (
              <div className="pcard-crown" style={{ background: pfc.s, color: pfc.c, border: `1.5px solid ${pfc.b}` }}>
                🏆 BEST
              </div>
            )}
            <div className="pcard-img-area">
              {data.img ? (
                <img className="pcard-prod-img" src={data.img} alt="product" />
              ) : (
                <div className="pcard-emoji">{data.em || '📦'}</div>
              )}
              <div className="pcard-store-tag">{pfc.n}</div>
            </div>

            <div className="pcard-body">
              <div className="pcard-row1">
                <div className="pcard-logo" style={{ background: pfc.s }}>{pfc.em}</div>
                <div className="pcard-store" style={{ color: isBest ? pfc.c : undefined }}>{pfc.n}</div>
                <div className="pcard-revs">{(d.rv || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="pcard-rating">
                <span className="stars-y">{stars}</span> {d.r || '—'}
              </div>
              <div>
                <div className="pcard-price" style={{ color: isBest ? pfc.c : 'var(--ink)' }}>
                  ₹{d.p.toLocaleString('en-IN')}
                </div>
                <div className="pcard-price-sub">
                  <span className="pcard-mrp">
                    {typeof data.mrp === 'number' ? `₹${data.mrp.toLocaleString('en-IN')}` : '—'}
                  </span>
                  <span className="pcard-off" style={{ background: pfc.s, color: pfc.c }}>{d.disc || 0}% off</span>
                </div>
              </div>
              <div className="pcard-bar">
                <div
                  className="pcard-bar-f"
                  style={{ width: `${bw}%`, background: pfc.c + '60', borderRight: `2px solid ${pfc.c}`, animationDelay: `${i * 0.1}s` }}
                ></div>
              </div>
              <div className="pcard-tags">
                {d.ship ? <span className="ptag fs">✓ Free ship</span> : <span className="ptag">🚚 Paid</span>}
                {d.ret ? <span className="ptag ret">↩ {d.ret}d</span> : null}
                {d.emi ? <span className="ptag emi">💳 EMI</span> : null}
                {d.of && d.of[0] ? <span className="ptag off_">🏷 {d.of[0]}</span> : null}
              </div>
              {d.emi && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink3)', marginBottom: '.5rem' }}>
                  No-cost EMI from {d.emi}
                </div>
              )}
              { (d.url || pfc.url) ? (
                <a
                  className="pcard-cta"
                  href={d.url || pfc.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: isBest ? '#fff' : pfc.c,
                    background: isBest ? pfc.c : 'transparent',
                    borderColor: pfc.c + '60',
                  }}
                >
                  Buy on {pfc.n} →
                </a>
              ) : (
                <span
                  className="pcard-cta"
                  aria-disabled="true"
                  style={{
                    color: 'var(--ink4)',
                    background: 'transparent',
                    borderColor: 'var(--line)',
                    cursor: 'not-allowed',
                  }}
                >
                  Buy on {pfc.n} →
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
