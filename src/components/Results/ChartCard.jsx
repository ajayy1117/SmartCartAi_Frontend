import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PF } from '../../data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
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
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: pfc.c || '#444',
      fill: false,
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
        borderColor: 'rgba(0,0,0,.12)',
        borderWidth: 1.5,
        titleColor: '#757575',
        bodyColor: '#0d0d0d',
        titleFont: { family: "'Azeret Mono'", size: 10 },
        bodyFont: { family: "'Azeret Mono'", size: 12 },
        padding: 12,
        callbacks: {
          title: (i) => `📅 ${i[0].label}`,
          label: (c) => `${c.dataset.label}: ₹${c.parsed.y.toLocaleString('en-IN')}`,
          footer: (items) => {
            const v = items.filter((i) => !i.dataset.hidden).map((i) => i.parsed.y);
            return v.length > 1
              ? `Spread: ₹${(Math.max(...v) - Math.min(...v)).toLocaleString('en-IN')}`
              : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,.04)' },
        ticks: { color: '#b8b8b8', font: { family: "'Azeret Mono'", size: 10 }, maxRotation: 0, maxTicksLimit: 8 },
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(0,0,0,.04)' },
        ticks: {
          color: '#b8b8b8',
          font: { family: "'Azeret Mono'", size: 10 },
          callback: (v) => {
            if (v < 1000) {
              return `₹${v}`;
            }
            return '₹' + (v >= 100000 ? (v / 100000).toFixed(1) + 'L' : (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'K');
          },
        },
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
        <span className="chart-hd-title">{chartRange}-Day Price Trend</span>
        <div className="chart-right">
          <div className="range-tabs">
            <button className={`rtab ${chartRange === 7 ? 'on' : ''}`} onClick={() => setChartRange(7)}>7D</button>
            <button className={`rtab ${chartRange === 14 ? 'on' : ''}`} onClick={() => setChartRange(14)}>14D</button>
            <button className={`rtab ${chartRange === 30 ? 'on' : ''}`} onClick={() => setChartRange(30)}>30D</button>
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
      <div className="chart-body" style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
