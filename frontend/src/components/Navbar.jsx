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
    <nav className="nav" role="banner">
      <div className="nav-logo">
        <div className="nav-logo-box">🛒</div>
        Smart<span>Cart</span><span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--ink3)', letterSpacing: '.02em', fontFamily: 'var(--mono)' }}>.AI</span>
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
        
        <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              background: 'var(--off)', border: '1.5px solid var(--line)', 
              padding: '5px 6px 5px 10px', borderRadius: '24px' 
            }}>
              <span style={{ 
                width: '28px', height: '28px', 
                background: 'linear-gradient(135deg, var(--primary), #7c3aed)', 
                color: 'var(--w)', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '12px', fontWeight: 'bold', fontFamily: 'var(--head)',
                boxShadow: 'var(--sh-primary)'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink2)' }}>{user.name}</span>
              <button 
                onClick={onLogoutClick} 
                style={{ 
                  background: 'var(--off)', border: '1.5px solid var(--line)', 
                  color: 'var(--ink3)', padding: '4px 12px', borderRadius: '16px', 
                  cursor: 'pointer', fontSize: '11px', fontWeight: '600', 
                  fontFamily: 'var(--mono)', transition: 'all .15s' 
                }}
                onMouseEnter={(e) => { e.target.style.borderColor = 'var(--red-b)'; e.target.style.color = 'var(--red)'; e.target.style.background = 'var(--red-s)'; }}
                onMouseLeave={(e) => { e.target.style.borderColor = 'var(--line)'; e.target.style.color = 'var(--ink3)'; e.target.style.background = 'var(--off)'; }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick} 
              style={{ 
                background: 'var(--primary)', border: 'none', 
                color: 'var(--w)', padding: '8px 18px', borderRadius: '24px', 
                cursor: 'pointer', fontFamily: 'var(--head)', fontSize: '12px', 
                fontWeight: '700', letterSpacing: '-0.02em', transition: 'all 0.2s', 
                boxShadow: 'var(--sh-primary)' 
              }}
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
