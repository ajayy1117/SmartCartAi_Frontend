export const PF = {
  amazon: { n: 'Amazon', em: '🛒', c: '#FF9900', s: '#fff8ee', b: '#ffe0a0', url: 'https://amazon.in' },
  flipkart: { n: 'Flipkart', em: '🛍', c: '#2874F0', s: '#eef4ff', b: '#b8d0ff', url: 'https://flipkart.com' },
  ajio: { n: 'Ajio', em: '👗', c: '#E91E8C', s: '#fff0f7', b: '#ffc0e0', url: 'https://ajio.com' },
  myntra: { n: 'Myntra', em: '👠', c: '#FF3F6C', s: '#fff0f3', b: '#ffb0c0', url: 'https://myntra.com' },
  meesho: { n: 'Meesho', em: '🛒', c: '#9c27b0', s: '#f8f0ff', b: '#ddb0f0', url: 'https://meesho.com' },
  snapdeal: { n: 'Snapdeal', em: '⚡', c: '#cc0033', s: '#fff0f2', b: '#ffb0bc', url: 'https://snapdeal.com' },
  nykaa: { n: 'Nykaa', em: '💄', c: '#fc2779', s: '#fff0f5', b: '#ffc0d8', url: 'https://nykaa.com' },
  croma: { n: 'Croma', em: '🖥', c: '#0066cc', s: '#eef4ff', b: '#b0ccff', url: 'https://croma.com' },
  tatacliq: { n: 'TataCliq', em: '🏷', c: '#6b21a8', s: '#f5f0ff', b: '#d0b0ff', url: 'https://tatacliq.com' },
  reliance: { n: 'Reliance', em: '📱', c: '#0ea5e9', s: '#f0faff', b: '#b0e0ff', url: 'https://reliancedigital.in' },
};

export const PKS = Object.keys(PF);

export const DEMO = {
  'Sony WH-1000XM5': { em: '🎧', cat: 'Audio', mrp: 34990, desc: 'Industry-leading noise cancellation · 30h battery', img: 'https://m.media-amazon.com/images/I/61vMBKxQnXL._SX679_.jpg', pf: { amazon: { p: 24999, r: 4.6, rv: 18420, of: ['5% HDFC cashback'], emi: '₹1,042/mo', ship: true, ret: 30, stock: true }, flipkart: { p: 25499, r: 4.5, rv: 14200, of: ['No-cost EMI'], emi: '₹1,062/mo', ship: true, ret: 30, stock: true }, ajio: { p: 27999, r: 4.3, rv: 3200, of: ['Extra 15% off'], emi: null, ship: true, ret: 14, stock: true }, myntra: { p: 26990, r: 4.4, rv: 5800, of: ['10% off'], emi: null, ship: true, ret: 30, stock: true }, meesho: { p: 23499, r: 4.1, rv: 2100, of: ['Free return'], emi: null, ship: false, ret: 7, stock: true }, snapdeal: { p: null, r: null, rv: 0, of: [], emi: null, ship: false, ret: 0, stock: false } } },
  'Nike Air Force 1': { em: '👟', cat: 'Footwear', mrp: 8495, desc: 'Classic low-top leather sneaker', img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png', pf: { amazon: { p: 7199, r: 4.5, rv: 22100, of: ['5% cashback'], emi: null, ship: true, ret: 30, stock: true }, flipkart: { p: 7499, r: 4.4, rv: 18900, of: ['Exchange ₹500'], emi: null, ship: true, ret: 30, stock: true }, ajio: { p: 6799, r: 4.6, rv: 9400, of: ['Extra 20% off'], emi: null, ship: true, ret: 14, stock: true }, myntra: { p: 6999, r: 4.5, rv: 12300, of: ['30-day return'], emi: null, ship: true, ret: 30, stock: true }, meesho: { p: 5999, r: 3.9, rv: 4200, of: ['COD'], emi: null, ship: false, ret: 7, stock: true }, snapdeal: { p: 7299, r: 4.2, rv: 3100, of: [], emi: null, ship: false, ret: 14, stock: true } } },
  'Apple iPhone 15': { em: '📱', cat: 'Smartphones', mrp: 79900, desc: '6.1″ Super Retina XDR · A16 Bionic', img: 'https://m.media-amazon.com/images/I/61cwywLZR-L._SX679_.jpg', pf: { amazon: { p: 72999, r: 4.7, rv: 43200, of: ['5% HDFC cashback'], emi: '₹3,042/mo', ship: true, ret: 10, stock: true }, flipkart: { p: 71999, r: 4.7, rv: 38900, of: ['Exchange ₹15,000'], emi: '₹3,000/mo', ship: true, ret: 10, stock: true }, ajio: { p: null, r: null, rv: 0, of: [], emi: null, ship: false, ret: 0, stock: false }, myntra: { p: null, r: null, rv: 0, of: [], emi: null, ship: false, ret: 0, stock: false }, meesho: { p: 74999, r: 4.3, rv: 1200, of: ['COD'], emi: null, ship: false, ret: 7, stock: true }, snapdeal: { p: 73499, r: 4.4, rv: 5100, of: ['Bank offers'], emi: null, ship: true, ret: 10, stock: true } } },
  'boAt Airdopes 141': { em: '🎵', cat: 'Audio', mrp: 3490, desc: '42H playback · ENx Tech · ASAP Charge', img: 'https://m.media-amazon.com/images/I/61CXMGPPBWL._SX679_.jpg', pf: { amazon: { p: 999, r: 4.1, rv: 142000, of: ['5% cashback'], emi: null, ship: true, ret: 30, stock: true }, flipkart: { p: 1099, r: 4.0, rv: 98000, of: [], emi: null, ship: true, ret: 30, stock: true }, ajio: { p: 1199, r: 3.9, rv: 8400, of: [], emi: null, ship: true, ret: 14, stock: true }, myntra: { p: 1149, r: 4.0, rv: 12000, of: [], emi: null, ship: true, ret: 30, stock: true }, meesho: { p: 899, r: 3.7, rv: 21000, of: ['COD'], emi: null, ship: false, ret: 7, stock: true }, snapdeal: { p: 1049, r: 3.8, rv: 15000, of: [], emi: null, ship: false, ret: 14, stock: true } } },
  'Samsung Galaxy S24': { em: '📲', cat: 'Smartphones', mrp: 74999, desc: 'Galaxy AI · 50MP · Snapdragon 8 Gen 3', img: 'https://m.media-amazon.com/images/I/71bBnBJjAXL._SX679_.jpg', pf: { amazon: { p: 61999, r: 4.5, rv: 21000, of: ['Exchange ₹20,000'], emi: '₹2,583/mo', ship: true, ret: 10, stock: true }, flipkart: { p: 59999, r: 4.6, rv: 18400, of: ['No-cost EMI'], emi: '₹2,500/mo', ship: true, ret: 10, stock: true }, ajio: { p: null, r: null, rv: 0, of: [], emi: null, ship: false, ret: 0, stock: false }, myntra: { p: null, r: null, rv: 0, of: [], emi: null, ship: false, ret: 0, stock: false }, meesho: { p: 63999, r: 4.2, rv: 2100, of: [], emi: null, ship: false, ret: 7, stock: true }, snapdeal: { p: 62499, r: 4.3, rv: 4500, of: ['Bank offers'], emi: null, ship: true, ret: 10, stock: true } } },
};

// compute discounts for demo data
for (const [, prod] of Object.entries(DEMO)) {
  for (const [, d] of Object.entries(prod.pf)) {
    if (d.p) d.disc = Math.round((1 - d.p / prod.mrp) * 100);
  }
}

export function genH(days, bases) {
  const h = {}, now = new Date();
  for (const [k, bp] of Object.entries(bases)) {
    h[k] = []; let p = Math.round(bp * 1.10);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const noise = Math.round((Math.random() - .52) * bp * .025);
      p = Math.max(Math.round(bp * .92), Math.min(Math.round(bp * 1.12), p + noise));
      if (i === 0) p = bp;
      h[k].push({ dt: d.toISOString().split('T')[0], p });
    }
  }
  return h;
}
