import React from 'react';
import { PF } from '../../data';

export default function TableView({ avail, data, minP, maxP, sortMode, setSortMode }) {
  return (
    <div className="table-wrap" style={{ display: 'block' }}>
      <table className="ctbl">
        <thead>
          <tr>
            <th>Platform</th>
            <th
              className={sortMode === 'price' ? 'sorted' : ''}
              role="button"
              tabIndex={0}
              onClick={() => setSortMode('price')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSortMode('price');
                }
              }}
            >
              Price ↕
            </th>
            <th
              className={sortMode === 'disc' ? 'sorted' : ''}
              role="button"
              tabIndex={0}
              onClick={() => setSortMode('disc')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSortMode('disc');
                }
              }}
            >
              Discount ↕
            </th>
            <th>Bar</th>
            <th
              className={sortMode === 'rating' ? 'sorted' : ''}
              role="button"
              tabIndex={0}
              onClick={() => setSortMode('rating')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSortMode('rating');
                }
              }}
            >
              Rating ↕
            </th>
            <th
              className={sortMode === 'ship' ? 'sorted' : ''}
              role="button"
              tabIndex={0}
              onClick={() => setSortMode('ship')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSortMode('ship');
                }
              }}
            >
              Delivery ↕
            </th>
            <th>Offers</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          {avail.map(([k, d]) => {
            const pfc = PF[k];
            if (!pfc) return null;
            const isBest = d.p === minP;
            const bw = Math.round(((d.p - minP) / (maxP - minP || 1)) * 80 + 20);
            const stars = '★'.repeat(Math.floor(d.r || 0));

            return (
              <tr key={k} className={isBest ? 'brow' : ''}>
                <td>
                  <div className="ct-pf">
                    <div className="ct-logo" style={{ background: pfc.s }}>{pfc.em}</div>
                    <span className="ct-nm">{pfc.n}</span>
                    {isBest && <span className="ct-best-b">BEST</span>}
                  </div>
                </td>
                <td>
                  <span className="ct-pv" style={{ color: isBest ? pfc.c : 'var(--ink)' }}>
                    {typeof d.p === 'number' ? `₹${d.p.toLocaleString('en-IN')}` : '—'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink3)', textDecoration: 'line-through', marginLeft: '5px' }}>
                    {typeof data.mrp === 'number' ? `₹${data.mrp.toLocaleString('en-IN')}` : '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--green)', marginLeft: '5px' }}>
                    -{d.disc || 0}%
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--head)', fontSize: '13px', fontWeight: 800, color: 'var(--green)' }}>
                    {d.disc || 0}%
                  </span>
                </td>
                <td>
                  <div className="ct-bar-wrap">
                    <div className="ct-bar-f" style={{ width: `${bw}%`, background: pfc.c }}></div>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#f59e0b' }}>
                  {stars} {d.r || '—'}
                </td>
                <td style={{ fontSize: '12px', fontWeight: 700, color: d.ship ? 'var(--green)' : 'var(--ink3)' }}>
                  {d.ship ? '✓ Free' : 'Paid'}
                </td>
                <td style={{ fontSize: '11px', color: '#7c3aed' }}>
                  {d.of && d.of[0] ? d.of[0] : '—'}
                </td>
                <td>
                  <a
                    href={d.url || pfc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      fontFamily: 'var(--head)',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: pfc.c,
                      padding: '6px 13px',
                      border: `2px solid ${pfc.c}50`,
                      borderRadius: '6px',
                      textDecoration: 'none',
                      background: pfc.s,
                    }}
                  >
                    Buy →
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
