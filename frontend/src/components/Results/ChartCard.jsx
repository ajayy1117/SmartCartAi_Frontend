import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PF } from '../../data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

export default function ChartCard({ avail, data }) {
  const [chartRange, setChartRange] = useState(14);
  const [hidDS, setHidDS] = useState(new Set());

  if (!data?.hist) return null;

  const keys = avail
    .slice(0, 5)
    .map(([k]) => k)
    .filter((k) => data.hist[k] && PF[k]);

  if (!keys.length) return null;

  const fmtD = (dt) => {
    const d = new Date(dt);
    return `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`;
  };

  const labels = (data.hist[keys[0]] || [])
    .slice(-chartRange)
    .map((h) => fmtD(h.dt));

  const datasets = keys.map((k) => {
    const pfc = PF[k] || {};
    return {
      label: pfc.n || k,
      data: (data.hist[k] || []).slice(-chartRange).map((h) => h.p),
      borderColor: pfc.c || '#444',
      backgroundColor: `${pfc.c || '#444'}10`,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: pfc.c || '#444',
      pointHoverBorderWidth: 3,
      fill: true,
      tension: 0.4,
      hidden: hidDS.has(k),
    };
  });

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,.1)',
        borderWidth: 1,
        titleColor: '#6b6b6b',
        bodyColor: '#0d0d0d',
        titleFont: { family: "'DM Mono', monospace", size: 12, weight: '500' },
        bodyFont: { family: "'DM Mono', monospace", size: 14, weight: '600' },
        padding: { top: 14, bottom: 14, left: 16, right: 16 },
        cornerRadius: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (i) => `📅 ${i[0].label}`,
          label: (c) => ` ${c.dataset.label}: ₹${c.parsed.y.toLocaleString('en-IN')}`,
          footer: (items) => {
            const v = items.filter((i) => !i.dataset.hidden).map((i) => i.parsed.y);
            return v.length > 1
              ? `\nSpread: ₹${(Math.max(...v) - Math.min(...v)).toLocaleString('en-IN')}`
              : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,.04)', drawBorder: false },
        ticks: {
          color: '#6b6b6b',
          font: { family: "'DM Mono', monospace", size: 12, weight: '500' },
          maxRotation: 0,
          maxTicksLimit: 7,
          padding: 8,
        },
        border: { display: false },
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(0,0,0,.04)', drawBorder: false },
        ticks: {
          color: '#6b6b6b',
          font: { family: "'DM Mono', monospace", size: 12, weight: '500' },
          padding: 12,
          callback: (v) => {
            if (v < 1000) return `₹${v}`;
            return '₹' + (v >= 100000 ? (v / 100000).toFixed(1) + 'L' : (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'K');
          },
        },
        border: { display: false },
      },
    },
  };

  const toggleDS = (k) => {
    const newSet = new Set(hidDS);
    if (newSet.has(k)) newSet.delete(k);
    else newSet.add(k);
    setHidDS(newSet);
  };

  return (
    <div className="chart-card" style={{ display: 'block' }}>
      <div className="chart-hd">
        <span className="chart-hd-title">📈 {chartRange}-Day Price Trend</span>
        <div className="chart-right">
          <div className="range-tabs">
            {[7, 14, 30].map((r) => (
              <button
                key={r}
                className={`rtab ${chartRange === r ? 'on' : ''}`}
                onClick={() => setChartRange(r)}
              >
                {r}D
              </button>
            ))}
          </div>
          <div className="legend">
            {keys.map((k) => {
              const pfc = PF[k] || {};
              return (
                <div
                  key={k}
                  className={`li ${hidDS.has(k) ? 'off' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleDS(k)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleDS(k);
                    }
                  }}
                >
                  <div className="li-sw" style={{ background: pfc.c || '#444' }}></div>
                  {pfc.n || k}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="chart-body">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
