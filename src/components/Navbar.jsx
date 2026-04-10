import React, { useEffect, useState } from 'react';
import { PKS, PF } from '../data';

export default function Navbar({ user, onLoginClick, onLogoutClick }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const n = new Date();
      setTime(
        `Updated ${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <div className="nav-logo-box">🛒</div>
        Smart<span>Cart</span>
      </div>
      <div className="nav-mid" id="nav-pips">
        {PKS.slice(0, 6).filter((k) => PF[k]).map((k) => (
          <div
            key={k}
            className="npip on"
            style={{ backgroundColor: PF[k].c, borderColor: PF[k].c }}
            title={PF[k].n}
          />
        ))}
      </div>
      <div className="nav-right">
        <span className="nav-upd">{time}</span>
        <div className="nav-live">
          <div className="dot"></div>LIVE
        </div>
        
        <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--off)', border: '1.5px solid var(--line)', padding: '4px 8px', borderRadius: '20px' }}>
              <span style={{ width: '24px', height: '24px', background: 'var(--ink)', color: 'var(--w)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink2)' }}>{user.name}</span>
              <button onClick={onLogoutClick} style={{ background: 'var(--red)', border: 'none', color: 'var(--w)', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', marginLeft: '4px' }}>Logout</button>
            </div>
          ) : (
            <button onClick={onLoginClick} style={{ background: 'var(--ink)', border: '1.5px solid var(--ink)', color: 'var(--w)', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'var(--head)', fontSize: '11px', fontWeight: '800', letterSpacing: '-0.02em', transition: 'all 0.2s', boxShadow: 'var(--sh)' }}>Login / Register</button>
          )}
        </div>
      </div>
    </nav>
  );
}
