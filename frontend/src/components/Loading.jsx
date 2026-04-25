import React from 'react';
import { PF } from '../data';

export default function Loading({ query, activePF, searchData }) {
  const keys = Array.from(activePF || []);
  const foundKeys = searchData?.pf ? Object.keys(searchData.pf).filter((k) => searchData.pf?.[k]?.p) : [];
  
  const doneCount = foundKeys.length;
  const totalCount = keys.length;
  const progressPct = searchData ? 100 : Math.min(90, Math.round((doneCount / Math.max(totalCount, 1)) * 80) + 10);

  return (
    <div className="loading" style={{ display: 'block' }}>
      {!searchData && (
        <div className="spin-ring" style={{ 
          borderTopColor: 'var(--primary)',
          width: '48px', height: '48px', borderWidth: '3px',
        }}></div>
      )}
      <div className="loading-title">
        {searchData ? '✅ Results found!' : `Searching "${query}"`}
      </div>
      <div className="loading-sub">
        {searchData ? 'Rendering results…' : 'Scanning live prices across platforms'}
      </div>
      
      <div className="scan-grid">
        {keys.map((k, i) => {
          const isDone = searchData ? foundKeys.includes(k) : false;
          const isMiss = searchData ? !foundKeys.includes(k) : false;
          let cls = 'scan-c scanning';
          if (isDone) cls = 'scan-c done';
          else if (isMiss) cls = 'scan-c miss';

          const pfc = PF[k] || {};
          return (
            <div 
              key={k} 
              className={cls} 
              style={{ 
                animationDelay: `${i * 0.1}s`,
                borderColor: isDone ? 'var(--grn-b)' : undefined,
              }}
            >
              <div className="sc-em">{pfc.em || ''}</div>
              <div className="sc-nm" style={{ color: pfc.c || 'inherit' }}>
                {pfc.n || k}
              </div>
              <div className="sc-st">
                {searchData ? (
                  isDone ? (
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ found</span>
                  ) : (
                    <span style={{ color: 'var(--ink4)' }}>— unavailable</span>
                  )
                ) : (
                  <div className="sc-dots">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="prog">
        <div className="prog-f" style={{ width: `${progressPct}%` }}></div>
      </div>
      <div className="prog-lbl">
        {searchData ? 'Complete ✓' : `Scanning ${doneCount}/${totalCount} platforms…`}
      </div>
    </div>
  );
}
