import React, { useState } from 'react';
import CardsView from './Results/CardsView';
import TableView from './Results/TableView';
import BarsView from './Results/BarsView';
import ChartCard from './Results/ChartCard';
import AIPredictionCard from './Results/AIPredictionCard';
import AlertsCard from './Results/AlertsCard';
import HistoryCard from './Results/HistoryCard';

export default function ResultsContainer({ data, activePF }) {
  const [view, setView] = useState('cards');
  const [sortMode, setSortMode] = useState('price');

  if (!data) return null;

  const avail = Object.entries(data?.pf || {})
    .filter(([k, d]) => activePF.has(k) && d?.stock && d?.p)
    .sort((a, b) => {
      if (sortMode === 'price') return a[1].p - b[1].p;
      if (sortMode === 'price-d') return b[1].p - a[1].p;
      if (sortMode === 'disc') return (b[1].disc || 0) - (a[1].disc || 0);
      if (sortMode === 'rating') return (b[1].r || 0) - (a[1].r || 0);
      if (sortMode === 'ship') return (a[1].ship ? 0 : 1) - (b[1].ship ? 0 : 1);
      return 0;
    });

  if (!avail.length) {
    return (
      <div className="results" style={{ display: 'block' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No results found</div>
          <div className="empty-state-sub">
            We couldn't find any products on your selected platforms. Try adjusting your platform filters or search for a different product.
          </div>
        </div>
      </div>
    );
  }

  const prices = avail.map(([, d]) => d.p);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const avgP = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const totRev = avail.reduce((a, [, d]) => a + (d.rv || 0), 0);
  const savingsPercent = maxP > 0 ? Math.round(((maxP - minP) / maxP) * 100) : 0;

  const viewIcons = { cards: '🃏', table: '📊', bars: '📈' };

  return (
    <div className="results" style={{ display: 'block' }}>
      <div className="prod-hdr">
        <div className="prod-img-box">
          {data.img ? (
            <img className="prod-img" src={data.img} alt={data.name} />
          ) : (
            <div className="prod-emoji">{data.em}</div>
          )}
        </div>
        <div>
          <div className="prod-cat">
            {data.cat} · MRP {typeof data.mrp === 'number' ? `₹${data.mrp.toLocaleString('en-IN')}` : '—'}
          </div>
          <div className="prod-name">{data.name}</div>
          <div className="prod-desc">{data.desc}</div>
          <div className="prod-badges">
            <span className="pbadge">🏪 {avail.length} platforms</span>
            <span className="pbadge">⭐ {totRev.toLocaleString('en-IN')} ratings</span>
            <span className="pbadge">📦 In stock</span>
            {savingsPercent > 0 && (
              <span className="pbadge" style={{ 
                background: 'var(--grn-s)', color: 'var(--green)', 
                borderColor: 'var(--grn-b)' 
              }}>
                💰 Save up to {savingsPercent}%
              </span>
            )}
          </div>
          <div className="prod-stats">
            <div className="pstat" style={{ borderTop: '3px solid var(--green)' }}>
              <div className="pstat-l">Best Price</div>
              <div className="pstat-v" style={{ color: 'var(--green)' }}>₹{minP.toLocaleString('en-IN')}</div>
            </div>
            <div className="pstat" style={{ borderTop: '3px solid var(--red)' }}>
              <div className="pstat-l">Highest</div>
              <div className="pstat-v" style={{ color: 'var(--red)' }}>₹{maxP.toLocaleString('en-IN')}</div>
            </div>
            <div className="pstat" style={{ borderTop: '3px solid var(--green)' }}>
              <div className="pstat-l">You Save</div>
              <div className="pstat-v" style={{ color: 'var(--green)' }}>₹{(maxP - minP).toLocaleString('en-IN')}</div>
            </div>
            <div className="pstat" style={{ borderTop: '3px solid var(--primary)' }}>
              <div className="pstat-l">Average</div>
              <div className="pstat-v" style={{ color: 'var(--primary)' }}>₹{avgP.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="view-ctrl">
        <div className="vtabs">
          {['cards', 'table', 'bars'].map((v) => (
            <button
              key={v}
              className={`vt ${view === v ? 'on' : ''}`}
              onClick={() => setView(v)}
              id={`view-${v}`}
            >
              {viewIcons[v]} {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="sort-box">
          <span style={{ fontWeight: 600 }}>Sort:</span>
          <select className="sortsel" value={sortMode} onChange={(e) => setSortMode(e.target.value)} id="sort-select">
            <option value="price">Price: Low → High</option>
            <option value="price-d">Price: High → Low</option>
            <option value="disc">Biggest Discount</option>
            <option value="rating">Highest Rating</option>
            <option value="ship">Free Delivery First</option>
          </select>
        </div>
      </div>

      {view === 'cards' && <CardsView avail={avail} data={data} activePF={activePF} minP={minP} maxP={maxP} />}
      {view === 'table' && <TableView avail={avail} data={data} minP={minP} maxP={maxP} sortMode={sortMode} setSortMode={setSortMode} />}
      {view === 'bars' && <BarsView avail={avail} />}

      <ChartCard avail={avail} data={data} />
      <AIPredictionCard data={data} />
      <AlertsCard avail={avail} data={data} />
      <HistoryCard avail={avail} data={data} />
    </div>
  );
}
