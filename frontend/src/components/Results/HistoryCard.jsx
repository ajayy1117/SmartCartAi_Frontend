import React, { useState } from 'react';
import { PF } from '../../data';

export default function HistoryCard({ avail, data }) {
  const topKeys = avail.slice(0, 3).map(([k]) => k).filter((k) => PF[k]);
  const [histPF, setHistPF] = useState(topKeys[0]);

  if (!topKeys.length || !data?.hist) return null;

  const effectiveHistPF = topKeys.includes(histPF) ? histPF : topKeys[0];
  const hist = data.hist[effectiveHistPF] || data.hist[topKeys[0]] || [];
  const allP = Object.values(data.hist)
    .flat()
    .map((h) => (typeof h?.p === 'number' ? h.p : 0));
  const minAll = allP.length ? Math.min(...allP) : 0;
  const rec = [...hist].reverse().slice(0, 12);

  const fmtD = (dt) => {
    const d = new Date(dt);
    return `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`;
  };

  return (
    <div className="hist-card" style={{ display: 'block' }}>
      <div className="card-hd">
        <span className="card-hd-title">Price History</span>
        <div className="hist-sel">
          {topKeys.map((k) => {
            const pfc = PF[k];
            if (!pfc) return null;
            const isOn = k === effectiveHistPF;
            return (
              <button
                key={k}
                className={`hbtn ${isOn ? 'on' : ''}`}
                style={{
                  background: isOn ? pfc.c : undefined,
                  borderColor: isOn ? pfc.c : undefined,
                  color: isOn ? '#fff' : undefined,
                }}
                onClick={() => setHistPF(k)}
              >
                {pfc.n}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="htbl">
          <thead>
            <tr>
              <th>Date</th>
              {topKeys.map((k, i) => (
                <th key={k} id={`hh${i + 1}`}>{PF[k].n}</th>
              ))}
              {Array.from({ length: Math.max(0, 3 - topKeys.length) }).map((_, i) => (
                <th key={`empty-${i}`}>—</th>
              ))}
              <th>Change</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rec.map((h, i) => {
              const prev = rec[i + 1];
              const chg = prev ? h.p - prev.p : 0;
              const isLow = h.p === minAll;
              const note = i === 0 ? 'Latest' : chg < -400 ? '📉 Drop' : chg > 400 ? '📈 Rise' : 'Stable';

              return (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink3)' }}>
                    {fmtD(h.dt)}
                  </td>
                  <td className="ht-p" style={{ color: isLow ? 'var(--green)' : undefined }}>
                    ₹{typeof h?.p === 'number' ? h.p.toLocaleString('en-IN') : '—'}{isLow ? ' ✨' : ''}
                  </td>
                  {topKeys.slice(1).map((k) => {
                    const hk = data.hist[k];
                    if (!hk) return <td key={k} style={{ color: 'var(--ink4)', fontSize: '12px' }}>—</td>;
                    const m = hk.find((x) => x.dt === h.dt);
                    return <td key={k} className="ht-p">{m ? `₹${m.p.toLocaleString('en-IN')}` : '—'}</td>;
                  })}
                  {Array.from({ length: Math.max(0, 2 - topKeys.slice(1).length) }).map((_, idx) => (
                    <td key={`pad-${idx}`} style={{ color: 'var(--ink4)', fontSize: '12px' }}>—</td>
                  ))}
                  <td style={{ color: chg < 0 ? 'var(--green)' : chg > 0 ? 'var(--red)' : 'var(--ink3)' }}>
                    {chg > 0 ? '+' : ''}{chg ? `₹${chg.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td style={{ fontSize: '11px' }}>{note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
