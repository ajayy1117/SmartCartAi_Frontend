import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import SearchZone from './components/SearchZone';
import Loading from './components/Loading';
import ResultsContainer from './components/ResultsContainer';
import { PKS, DEMO, genH } from './data';

export default function App() {
  const [activePF, setActivePF] = useState(new Set(PKS));
  const searchTimeoutRef = useRef(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | complete | error
  const [searchData, setSearchData] = useState(null);

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    setIsAuthModalOpen(false);
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
      const response = await fetch(`${baseUrl}/api/compare?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
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
          ret: 7, // Default return policy
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
        cat: 'Price Comparison',
        desc: `Live pricing and availability for ${data.name || q} across multiple platforms.`,
        pf: pf,
        hist: genH(30, bases)
      };

      setSearchData(processedData);
      setStatus('complete');
    } catch (error) {
      console.error('Search error:', error);
      alert(`Search failed: ${error.message}`);
      setStatus('error');
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
    <>
      <Navbar 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
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

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </>
  );
}
