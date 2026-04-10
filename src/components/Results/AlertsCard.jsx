import React, { useState } from 'react';
import { PF } from '../../data';

export default function AlertsCard({ avail, data }) {
  const [alerts, setAlerts] = useState({});
  const [notifs, setNotifs] = useState([]);
  const [email, setEmail] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const saveAlerts = async () => {
    let n = 0;
    const newNotifs = [];
    
    if (!user && !email) {
      alert('Please enter your email or log in to save alerts.');
      return;
    }

    for (const [k, d] of avail) {
      const thr = alerts[k];
      if (thr > 0) {
        n++;
        if (d.p < thr) {
          newNotifs.push({ t: 'fired', k, p: d.p, thr });
        } else {
          newNotifs.push({ t: 'watching', k, p: d.p, thr });
        }

        try {
          await fetch('/api/alert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              product: data.name,
              platform: k,
              threshold: thr,
              email: user ? user.email : email
            })
          });
        } catch(err) {
          console.error(err);
        }
      }
    }

    if (n === 0) {
      alert('Enter at least one target price');
      return;
    }

    setNotifs(newNotifs);
    console.log(`${n} alert(s) saved ✓`);
  };

  return (
    <div className="alerts-card" style={{ display: 'block' }}>
      <div className="card-hd">
        <span className="card-hd-title">Price Alerts</span>
        <span className="card-hd-sub">NOTIFY WHEN PRICE DROPS</span>
      </div>
      <div className="card-body">
        <div className="al-grid">
          {avail.map(([k, d]) => {
            const pfc = PF[k];
            if (!pfc) return null;
            const ex = alerts[k] || '';
            const fired = ex && d.p < ex;
            const watch = ex && !fired;

            return (
              <div key={k} className={`al-row ${fired ? 'fired' : watch ? 'watching' : ''}`}>
                <div className="al-logo" style={{ background: pfc.s, border: `1px solid ${pfc.b}` }}>
                  {pfc.em}
                </div>
                <div className="al-nm">
                  <div className="al-nm-main">{pfc.n}</div>
                  <div className="al-nm-now">
                    Now ₹{typeof d?.p === 'number' ? d.p.toLocaleString('en-IN') : '—'}
                  </div>
                </div>
                <input
                  className="al-inp"
                  type="number"
                  placeholder="₹ target"
                  value={ex}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    const parsed = nextValue === '' ? '' : Number(nextValue);
                    setAlerts({
                      ...alerts,
                      [k]: nextValue === '' ? '' : Number.isFinite(parsed) ? parsed : ex,
                    });
                  }}
                />
                {fired && (
                  <span
                    className="al-badge"
                    style={{ background: 'var(--red-s)', color: 'var(--red)', border: '1.5px solid var(--red-b)' }}
                  >
                    ⚡ FIRED
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {!user && (
          <div style={{ marginBottom: '16px', marginTop: '16px' }}>
            <input 
              type="email" 
              placeholder="Enter your email to receive alerts" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid var(--line)', backgroundColor: 'var(--off)', color: 'var(--ink)' }}
            />
          </div>
        )}

        <button className="save-alerts-btn" onClick={saveAlerts}>
          SAVE ALL ALERTS →
        </button>
        <div className="notifs">
          {notifs.map((n, i) => {
            const pfc = PF[n.k] || { n: 'Unknown' };
            const currentPrice = typeof n.p === 'number' ? n.p.toLocaleString('en-IN') : '—';
            const thresholdPrice = typeof n.thr === 'number' ? n.thr.toLocaleString('en-IN') : '—';
            const diffPrice = typeof n.p === 'number' && typeof n.thr === 'number' ? (n.thr - n.p).toLocaleString('en-IN') : '—';
            if (n.t === 'fired') {
              return (
                <div key={i} className="notif fired">
                  🔔 <strong style={{ color: 'var(--red)' }}>{pfc.n} TRIGGERED!</strong> — ₹
                  {currentPrice} is below target ₹{thresholdPrice}. Save ₹{diffPrice}!
                </div>
              );
            }
            return (
              <div key={i} className="notif watching">
                👁 <strong>{pfc.n} watching</strong> — ₹{currentPrice} vs target ₹
                {thresholdPrice}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
