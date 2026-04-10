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
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
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

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', 
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="auth-modal" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '400px', 
        border: '1.5px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)'
      }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--ink)', fontFamily: 'var(--head)' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div style={{ 
          padding: '10px', backgroundColor: 'rgba(255,0,0,0.1)', 
          color: '#ff4c4c', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' 
        }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--ink2)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.8)', backgroundColor: 'rgba(255, 255, 255, 0.5)', color: 'var(--ink)', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
              />
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--ink2)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.8)', backgroundColor: 'rgba(255, 255, 255, 0.5)', color: 'var(--ink)', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--ink2)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.8)', backgroundColor: 'rgba(255, 255, 255, 0.5)', color: 'var(--ink)', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
            backgroundColor: 'var(--ink)', color: 'var(--w)', fontWeight: 'bold', fontFamily: 'var(--head)',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', transition: 'all 0.2s', boxShadow: 'var(--sh2)'
          }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--ink3)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => {setIsLogin(!isLogin); setError('');}} style={{
            background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontFamily: 'var(--sans)'
          }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
