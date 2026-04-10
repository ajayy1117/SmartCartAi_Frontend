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
    return <div style={{ padding: '2rem', textAlign: 'center' }}>No results available on selected platforms.</div>;
  }

  const prices = avail.map(([, d]) => d.p);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const avgP = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const totRev = avail.reduce((a, [, d]) => a + (d.rv || 0), 0);

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
          </div>
          <div className="prod-stats">
            <div className="pstat">
              <div className="pstat-l">Best Price</div>
              <div className="pstat-v" style={{ color: 'var(--green)' }}>₹{minP.toLocaleString('en-IN')}</div>
            </div>
            <div className="pstat">
              <div className="pstat-l">Highest</div>
              <div className="pstat-v" style={{ color: 'var(--red)' }}>₹{maxP.toLocaleString('en-IN')}</div>
            </div>
            <div className="pstat">
              <div className="pstat-l">You Save</div>
              <div className="pstat-v" style={{ color: 'var(--green)' }}>₹{(maxP - minP).toLocaleString('en-IN')}</div>
            </div>
            <div className="pstat">
              <div className="pstat-l">Average</div>
              <div className="pstat-v">₹{avgP.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="view-ctrl">
        <div className="vtabs">
          <button className={`vt ${view === 'cards' ? 'on' : ''}`} onClick={() => setView('cards')}>Cards</button>
          <button className={`vt ${view === 'table' ? 'on' : ''}`} onClick={() => setView('table')}>Table</button>
          <button className={`vt ${view === 'bars' ? 'on' : ''}`} onClick={() => setView('bars')}>Bars</button>
        </div>
        <div className="sort-box">
          Sort:
          <select className="sortsel" value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
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
