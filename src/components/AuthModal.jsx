import React, { useState } from 'react';

export default function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Server returned non-JSON response (Setup issue or Backend down): ${text.substring(0, 30)}...`);
      }
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        onLogin(data.token, data.user);
      } else {
        // Automatically switch to login after successful register, or auto-login if backend returns token
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    width: '100%', 
    padding: '14px 16px', 
    borderRadius: 'var(--r-s)', 
    border: '1.5px solid var(--line)', 
    backgroundColor: 'var(--w)', 
    color: 'var(--ink)', 
    outline: 'none', 
    transition: 'all 0.2s ease',
    fontFamily: 'var(--sans)',
    fontSize: '15px',
    fontWeight: 500,
  };

  const labelStyles = {
    display: 'block', 
    marginBottom: '8px', 
    fontSize: '11px', 
    color: 'var(--ink3)', 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    letterSpacing: '1.5px',
    fontFamily: 'var(--mono)',
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', 
      zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
      animation: 'in .2s ease',
    }}>
      <div className="auth-modal" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--w)', 
        padding: '36px', borderRadius: 'var(--r)', width: '90%', maxWidth: '420px', 
        border: '1px solid var(--line)', 
        boxShadow: 'var(--sh3)',
        animation: 'pop .25s ease',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1.5px solid var(--line)', background: 'var(--off)',
            color: 'var(--ink3)', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s ease', lineHeight: 1,
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--red-s)'; e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'var(--red-b)'; }}
          onMouseLeave={(e) => { e.target.style.background = 'var(--off)'; e.target.style.color = 'var(--ink3)'; e.target.style.borderColor = 'var(--line)'; }}
        >
          ✕
        </button>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '24px',
            boxShadow: 'var(--sh-primary)',
          }}>
            {isLogin ? '👋' : '🚀'}
          </div>
          <h2 style={{ 
            color: 'var(--ink)', fontFamily: 'var(--head)', 
            fontSize: '22px', fontWeight: 800, letterSpacing: '-.03em',
            marginBottom: '4px',
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink3)', margin: 0 }}>
            {isLogin ? 'Sign in to access your price alerts' : 'Join SmartCart to track prices'}
          </p>
        </div>
        
        {error && (
          <div style={{ 
            padding: '12px 16px', borderRadius: 'var(--r-xs)', marginBottom: '20px', fontSize: '13px',
            background: error.includes('successful') ? 'var(--grn-s)' : 'var(--red-s)',
            color: error.includes('successful') ? 'var(--green)' : 'var(--red)',
            border: `1.5px solid ${error.includes('successful') ? 'var(--grn-b)' : 'var(--red-b)'}`,
            fontWeight: 500,
          }}>
            {error.includes('successful') ? '✅ ' : '⚠️ '}{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyles}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
                placeholder="Your name"
                style={inputStyles}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
              />
            </div>
          )}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyles}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={inputStyles}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyles}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyles}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px', borderRadius: 'var(--r-s)', border: 'none', 
            background: loading ? 'var(--ink3)' : 'var(--primary)', 
            color: 'var(--w)', fontWeight: 700, fontFamily: 'var(--head)',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', 
            transition: 'all 0.2s ease', 
            boxShadow: loading ? 'none' : 'var(--sh-primary)',
            letterSpacing: '-.02em',
          }}>
            {loading ? '⏳ Processing...' : (isLogin ? 'Sign In →' : 'Create Account →')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--ink3)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => {setIsLogin(!isLogin); setError('');}} style={{
            background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', 
            fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: '14px',
            transition: 'opacity .15s',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.7'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
