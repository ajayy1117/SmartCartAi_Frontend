import React from 'react';
import { PF } from '../data';

export default function Loading({ query, activePF, searchData }) {
  const keys = Array.from(activePF || []);
  const foundKeys = searchData?.pf ? Object.keys(searchData.pf).filter((k) => searchData.pf?.[k]?.p) : [];
  
  // A simple simulated progress (0%, 50%, or 100%)
  const progress = searchData ? '100%' : '50%';

  return (
    <div className="loading" style={{ display: 'block' }}>
      {!searchData && <div className="spin-ring"></div>}
      <div className="loading-title">
        {searchData ? 'Results found!' : `Searching "${query}" across platforms…`}
      </div>
      <div className="loading-sub">
        {searchData ? 'Rendering UI' : 'Fetching live prices · Please wait'}
      </div>
      
      <div className="scan-grid">
        {keys.map((k) => {
          const isDone = searchData ? foundKeys.includes(k) : false;
          const isMiss = searchData ? !foundKeys.includes(k) : false;
          let cls = 'scan-c scanning';
          if (isDone) cls = 'scan-c done';
          else if (isMiss) cls = 'scan-c miss';

          return (
            <div key={k} className={cls}>
              {(() => {
                const pfc = PF[k] || {};
                return (
                  <>
                    <div className="sc-em">{pfc.em || ''}</div>
                    <div className="sc-nm" style={{ color: pfc.c || 'inherit' }}>
                      {pfc.n || k}
                    </div>
                  </>
                );
              })()}
              <div className="sc-st">
                {searchData ? (
                  isDone ? (
                    <span style={{ color: 'var(--green)' }}>✓ found</span>
                  ) : (
                    <span style={{ color: 'var(--ink4)' }}>—</span>
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
        <div className="prog-f" style={{ width: progress }}></div>
      </div>
      <div className="prog-lbl">{searchData ? 'Done' : 'Initializing…'}</div>
    </div>
  );
}
