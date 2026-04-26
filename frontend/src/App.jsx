import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import SearchZone from './components/SearchZone';
import Loading from './components/Loading';
import ResultsContainer from './components/ResultsContainer';
import SplashScreen from './components/SplashScreen';
import { PKS, DEMO, genH } from './data';

export default function App() {
  const navigate = useNavigate();
  const [activePF, setActivePF] = useState(new Set(PKS));
  const searchTimeoutRef = useRef(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | complete | error
  const [searchData, setSearchData] = useState(null);

  // Auth State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check local storage for token on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const togglePF = (k) => {
    const next = new Set(activePF);
    if (next.has(k)) {
      if (next.size <= 2) {
        alert('Keep at least 2 platforms');
        return;
      }
      next.delete(k);
    } else {
      next.add(k);
    }
    setActivePF(next);
  };

  const handleSearch = async (q) => {
    if (!q) return;
    setQuery(q);
    setStatus('loading');
    setSearchData(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log(`Searching for: ${q} at ${baseUrl}`);
      
      const response = await fetch(`${baseUrl}/api/compare?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.platforms || data.platforms.length === 0) {
        throw new Error('No deals found for this product');
      }

      // Transform backend flat list to nested pf object structure
      const pf = {};
      const bases = {};
      data.platforms.forEach(p => {
        pf[p.platform] = {
          p: p.price,
          r: p.rating,
          rv: p.reviews || 0,
          of: p.offers || [],
          emi: p.emi || null,
          ship: p.freeShip || false,
          ret: 7, 
          stock: true,
          disc: p.discount || 0,
          url: p.url || '#'
        };
        if (p.price) {
          bases[p.platform] = p.price;
        }
      });

      const processedData = {
        name: data.name || q,
        img: data.image,
        mrp: data.mrp || 0,
        cat: 'Product Match',
        desc: `Verified deals for ${data.name || q}. Accuracy optimized.`,
        pf: pf,
        hist: genH(30, bases)
      };

      setSearchData(processedData);
      setStatus('complete');
    } catch (error) {
      console.error('Search error:', error);
      alert(`Search failed: ${error.message}`);
      setStatus('error');
      setStatus('idle'); // Go back to idle on error
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      
      <Route path="/dashboard" element={
        <>
          <Navbar 
            user={user} 
            onLoginClick={() => navigate('/login')} 
            onLogoutClick={handleLogout} 
          />
          <Ticker />
          
          {status === 'idle' && (
            <Hero onDealClick={handleSearch} />
          )}

          <SearchZone 
            activePF={activePF} 
            togglePF={togglePF} 
            onSearch={handleSearch} 
          />

          {(status === 'loading' || status === 'complete') && (
            <>
              {status === 'loading' && <Loading query={query} activePF={activePF} searchData={null} />}
              {status === 'complete' && searchData && (
                <ResultsContainer activePF={activePF} data={searchData} />
              )}
            </>
          )}

          <div className="toasts" id="toasts"></div>
        </>
      } />

      <Route path="/login" element={
        <div style={{ minHeight: '100vh', background: 'var(--off)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthModal 
              onClose={() => navigate('/dashboard')} 
              onLogin={handleLogin} 
            />
          )}
        </div>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
