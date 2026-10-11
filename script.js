'use strict';

/* =========================================================
   DATA
   ========================================================= */
const IMG = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
const FALLBACK_IMG = IMG('photo-1504674900247-0877df9cc836');

function imgFallback(img) {
  if (img.dataset.fallback) { img.style.visibility = 'hidden'; return; }
  img.dataset.fallback = '1';
  img.src = FALLBACK_IMG;
}

const CITIES = [
  'Jalgaon',
  'Bhusawal',
  'Dhule',
  'Chalisgaon',
  'Pachora',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Pune',
  'Mumbai'
];

const MENU_TEMPLATES = {
  Biryani: [
    { name: 'Chicken Dum Biryani', price: 299, veg: false, emoji: '🍛', desc: 'Slow-cooked basmati rice layered with tender chicken & saffron.', bestseller: true },
    { name: 'Veg Hyderabadi Biryani', price: 249, veg: true, emoji: '🍚', desc: 'Fragrant rice with seasonal vegetables and crispy fried onions.' },
    { name: 'Mutton Biryani', price: 389, veg: false, emoji: '🍖', desc: 'Succulent mutton pieces cooked dum-style with whole spices.' },
  ],
  'North Indian': [
    { name: 'Butter Chicken', price: 349, veg: false, emoji: '🍗', desc: 'Tandoori chicken in a velvety tomato-butter gravy.', bestseller: true },
    { name: 'Paneer Butter Masala', price: 289, veg: true, emoji: '🧀', desc: 'Cottage cheese cubes in a rich, creamy makhani gravy.' },
    { name: 'Dal Makhani', price: 249, veg: true, emoji: '🥘', desc: 'Black lentils slow-cooked overnight with butter & cream.' },
    { name: 'Butter Naan', price: 59, veg: true, emoji: '🫓', desc: 'Soft tandoor-baked flatbread brushed with butter.' },
  ],
  Pizza: [
    { name: 'Margherita Pizza', price: 199, veg: true, emoji: '🍕', desc: 'Classic cheese & tomato on a hand-tossed crust.', bestseller: true },
    { name: 'Farmhouse Pizza', price: 349, veg: true, emoji: '🫑', desc: 'Onion, capsicum, tomato & mushroom with extra cheese.' },
    { name: 'Pepperoni Pizza', price: 429, veg: false, emoji: '🍕', desc: 'Loaded with spicy chicken pepperoni and mozzarella.' },
    { name: 'Cheesy Garlic Bread', price: 129, veg: true, emoji: '🥖', desc: 'Toasted bread with garlic butter, herbs and cheese.' },
  ],
  Burger: [
    { name: 'Classic Veg Burger', price: 129, veg: true, emoji: '🍔', desc: 'Crispy veg patty with lettuce, tomato & house mayo.' },
    { name: 'Crispy Chicken Burger', price: 199, veg: false, emoji: '🍔', desc: 'Crunchy fried chicken fillet with spicy sauce.', bestseller: true },
    { name: 'Peri Peri Fries', price: 119, veg: true, emoji: '🍟', desc: 'Golden fries tossed in fiery peri peri seasoning.' },
  ],
  Chinese: [
    { name: 'Hakka Noodles', price: 199, veg: true, emoji: '🍜', desc: 'Wok-tossed noodles with crunchy vegetables.', bestseller: true },
    { name: 'Chilli Chicken', price: 279, veg: false, emoji: '🌶️', desc: 'Indo-Chinese classic with peppers and a soy glaze.' },
    { name: 'Veg Manchurian', price: 219, veg: true, emoji: '🥟', desc: 'Vegetable dumplings in a tangy, spicy gravy.' },
  ],
  'South Indian': [
    { name: 'Masala Dosa', price: 149, veg: true, emoji: '🥞', desc: 'Crispy rice crepe stuffed with spiced potato masala.', bestseller: true },
    { name: 'Idli Sambar', price: 99, veg: true, emoji: '🍥', desc: 'Steamed rice cakes with sambar and coconut chutney.' },
    { name: 'Medu Vada', price: 109, veg: true, emoji: '🍩', desc: 'Crispy lentil doughnuts served with chutneys.' },
  ],
  Desserts: [
    { name: 'Chocolate Truffle Cake', price: 249, veg: true, emoji: '🍰', desc: 'Rich, moist chocolate cake with silky ganache.', bestseller: true },
    { name: 'Gulab Jamun (2 pcs)', price: 89, veg: true, emoji: '🍡', desc: 'Soft milk dumplings soaked in rose syrup.' },
    { name: 'Blueberry Cheesecake', price: 299, veg: true, emoji: '🫐', desc: 'Creamy baked cheesecake with blueberry compote.' },
  ],
  Japanese: [
    { name: 'Salmon Nigiri', price: 549, veg: false, emoji: '🍣', desc: 'Fresh Atlantic salmon over seasoned sushi rice.', bestseller: true },
    { name: 'Avocado Maki Roll', price: 449, veg: true, emoji: '🥑', desc: 'Avocado and cucumber rolled in crisp nori.' },
    { name: 'Chicken Ramen', price: 499, veg: false, emoji: '🍜', desc: 'Rich broth with noodles, soft egg & grilled chicken.' },
  ],
  Momos: [
    { name: 'Steamed Veg Momos', price: 119, veg: true, emoji: '🥟', desc: 'Soft dumplings filled with seasoned vegetables.' },
    { name: 'Chicken Darjeeling Momos', price: 149, veg: false, emoji: '🥟', desc: 'Juicy chicken dumplings with spicy red chutney.', bestseller: true },
    { name: 'Pan Fried Momos', price: 169, veg: true, emoji: '🔥', desc: 'Crispy-bottomed momos tossed in schezwan sauce.' },
  ],
  Continental: [
    { name: 'Grilled Chicken Steak', price: 449, veg: false, emoji: '🥩', desc: 'Herb-marinated chicken with mash and pepper sauce.', bestseller: true },
    { name: 'Penne Alfredo', price: 349, veg: true, emoji: '🍝', desc: 'Penne in a creamy parmesan & garlic sauce.' },
    { name: 'Caesar Salad', price: 279, veg: true, emoji: '🥗', desc: 'Romaine, croutons and parmesan with classic dressing.' },
  ],
  Italian: [
    { name: 'Spaghetti Aglio Olio', price: 329, veg: true, emoji: '🍝', desc: 'Garlic, olive oil and chilli flakes – simple & perfect.' },
    { name: 'Chicken Lasagna', price: 399, veg: false, emoji: '🧆', desc: 'Layers of pasta, bolognese and béchamel.', bestseller: true },
    { name: 'Tiramisu', price: 289, veg: true, emoji: '🍮', desc: 'Coffee-soaked ladyfingers with mascarpone cream.' },
  ],
  'Healthy Food': [
    { name: 'Quinoa Power Bowl', price: 329, veg: true, emoji: '🥗', desc: 'Quinoa, chickpeas, greens and tahini dressing.', bestseller: true },
    { name: 'Grilled Chicken Salad', price: 359, veg: false, emoji: '🥬', desc: 'Lean protein with fresh greens and vinaigrette.' },
    { name: 'Green Detox Smoothie', price: 179, veg: true, emoji: '🥤', desc: 'Spinach, apple, cucumber and ginger.' },
  ],
  'Ice Cream': [
    { name: 'Belgian Chocolate Scoop', price: 99, veg: true, emoji: '🍨', desc: 'Intensely rich Belgian chocolate ice cream.', bestseller: true },
    { name: 'Mango Sundae', price: 149, veg: true, emoji: '🥭', desc: 'Alphonso mango ice cream with fruit and nuts.' },
    { name: 'Cookies & Cream Shake', price: 179, veg: true, emoji: '🥛', desc: 'Thick shake blended with crushed cookies.' },
  ],
  'Street Food': [
    { name: 'Pani Puri (8 pcs)', price: 69, veg: true, emoji: '🫧', desc: 'Crispy puris with tangy mint water.', bestseller: true },
    { name: 'Samosa Chaat', price: 99, veg: true, emoji: '🥙', desc: 'Crushed samosa topped with chole, curd & chutneys.' },
    { name: 'Pav Bhaji', price: 149, veg: true, emoji: '🍞', desc: 'Buttery spiced vegetable mash with toasted pav.' },
  ],
  'Bar Food': [
    { name: 'Loaded Nachos', price: 299, veg: true, emoji: '🧀', desc: 'Tortilla chips with cheese, salsa & jalapeños.', bestseller: true },
    { name: 'Buffalo Chicken Wings', price: 379, veg: false, emoji: '🍗', desc: 'Spicy wings with a cool blue cheese dip.' },
    { name: 'Virgin Mojito', price: 199, veg: true, emoji: '🍹', desc: 'Fresh mint, lime and soda over crushed ice.' },
  ],
  Beverages: [
    { name: 'Cold Coffee', price: 129, veg: true, emoji: '🧋', desc: 'Chilled creamy coffee blended with ice cream.' },
    { name: 'Fresh Lime Soda', price: 89, veg: true, emoji: '🍋', desc: 'Sweet or salted – your call.' },
  ],
};

const RESTAURANTS = [
  { id: 1, name: 'Biryani House', cuisines: ['Biryani', 'North Indian', 'Desserts'], modes: ['delivery', 'dining'], rating: 4.3, reviews: 12400, priceForTwo: 400, time: 32, distance: 2.1, veg: false, offer: '50% OFF up to ₹100', image: 'photo-1563379091339-03b21ab4a4f8', location: 'Jalgaon, Maharashtra', tags: ['promoted'] },
  { id: 2, name: 'Pizza Paradise', cuisines: ['Pizza', 'Italian', 'Beverages'], modes: ['delivery'], rating: 4.1, reviews: 8900, priceForTwo: 500, time: 28, distance: 3.4, veg: false, offer: '₹125 OFF above ₹249', image: 'photo-1513104890138-7c749659a591', location: 'Bhusawal, Maharashtra', tags: [] },
  { id: 3, name: 'Burger Barn', cuisines: ['Burger', 'Beverages'], modes: ['delivery'], rating: 4.0, reviews: 6100, priceForTwo: 350, time: 24, distance: 1.8, veg: false, offer: '40% OFF up to ₹80', image: 'photo-1568901346375-23c9450c58cd', location: 'Dhule, Maharashtra', tags: [] },
  { id: 4, name: 'Haldi Sweets & Snacks', cuisines: ['Street Food', 'North Indian', 'South Indian', 'Desserts'], modes: ['delivery', 'dining'], rating: 4.4, reviews: 21500, priceForTwo: 450, time: 30, distance: 2.6, veg: true, offer: 'Free dessert above ₹399', image: 'photo-1601050690597-df0568f70950', location: 'Chalisgaon, Maharashtra', tags: ['promoted'] },
  { id: 5, name: 'Sushi Junction', cuisines: ['Japanese', 'Chinese'], modes: ['delivery', 'dining'], rating: 4.6, reviews: 3200, priceForTwo: 1800, time: 45, distance: 6.2, veg: false, offer: '20% OFF on total bill', image: 'photo-1579584425555-c3ce17fd4351', location: 'Nashik, Maharashtra', tags: ['new'] },
  { id: 6, name: 'The Chill Cafe', cuisines: ['Italian', 'Continental', 'Desserts'], modes: ['dining'], rating: 4.7, reviews: 18700, priceForTwo: 1600, time: 40, distance: 4.5, veg: false, offer: null, image: 'photo-1555396273-367ea4eb4db5', location: 'Amalner, Maharashtra', tags: ['romantic'] },
  { id: 7, name: 'Momo Magic', cuisines: ['Momos', 'Chinese'], modes: ['delivery'], rating: 4.0, reviews: 9800, priceForTwo: 300, time: 22, distance: 1.2, veg: false, offer: 'Buy 1 Get 1 Free', image: 'photo-1534422298391-e4f8c172dddb', location: 'Pune, Maharashtra', tags: [] },
  { id: 8, name: 'Udupi Corner', cuisines: ['South Indian', 'Beverages'], modes: ['delivery', 'dining'], rating: 4.5, reviews: 15200, priceForTwo: 500, time: 26, distance: 3.0, veg: true, offer: '30% OFF up to ₹75', image: 'photo-1589301760014-d929f3979dbc', location: 'Nagpur, Maharashtra', tags: [] },
  { id: 9, name: 'Cocoa & Crumbs', cuisines: ['Desserts', 'Beverages'], modes: ['delivery'], rating: 4.5, reviews: 7400, priceForTwo: 600, time: 20, distance: 2.2, veg: false, offer: 'Flat ₹50 OFF', image: 'photo-1565958011703-44f9829ba187', location: 'Greater Kailash', tags: [] },
  { id: 10, name: 'Social Hub', cuisines: ['Bar Food', 'Continental', 'North Indian'], modes: ['nightlife', 'dining'], rating: 4.4, reviews: 25600, priceForTwo: 1500, time: 35, distance: 5.1, veg: false, offer: '1+1 on drinks till 8 PM', image: 'photo-1514933651103-005eec06c04b', location: 'Chhatrapati Sambhajinagar, Maharashtra', tags: ['promoted'] },
  { id: 11, name: 'Skyhigh Rooftop Lounge', cuisines: ['Bar Food', 'Continental', 'Beverages'], modes: ['nightlife'], rating: 4.3, reviews: 4300, priceForTwo: 2500, time: 40, distance: 7.8, veg: false, offer: 'Ladies night every Wed', image: 'photo-1470337458703-46ad1756a187', location: 'Aerocity', tags: ['rooftop', 'new'] },
  { id: 12, name: 'Punjabi Tadka Grill', cuisines: ['North Indian', 'Biryani', 'Desserts'], modes: ['dining', 'delivery'], rating: 4.6, reviews: 11800, priceForTwo: 2200, time: 38, distance: 4.0, veg: false, offer: '15% OFF with Gold', image: 'photo-1585937421612-70a008356fbe', location: 'Select Citywalk, Saket', tags: ['romantic'] },
  { id: 13, name: 'Wok Express', cuisines: ['Chinese', 'Momos'], modes: ['delivery'], rating: 3.9, reviews: 5600, priceForTwo: 400, time: 27, distance: 2.9, veg: false, offer: '60% OFF up to ₹120', image: 'photo-1569718212165-3a8278d5f624', location: 'Malegaon, Maharashtra', tags: [] },
  { id: 14, name: 'Salad Days', cuisines: ['Healthy Food', 'Continental'], modes: ['delivery'], rating: 4.2, reviews: 2900, priceForTwo: 700, time: 24, distance: 3.3, veg: true, offer: null, image: 'photo-1512621776951-a57141f2eefd', location: 'Vasant Kunj', tags: ['new'] },
  { id: 15, name: 'Scoops Ice Cream', cuisines: ['Ice Cream', 'Desserts'], modes: ['delivery'], rating: 4.6, reviews: 13400, priceForTwo: 250, time: 18, distance: 1.5, veg: true, offer: '₹30 OFF above ₹199', image: 'photo-1497034825429-c343d7c6a68f', location: 'Defence Colony', tags: [] },
  { id: 16, name: 'Hops & Barley Brewpub', cuisines: ['Bar Food', 'Pizza', 'Continental'], modes: ['nightlife', 'dining'], rating: 4.7, reviews: 19800, priceForTwo: 2000, time: 42, distance: 6.8, veg: false, offer: 'Happy hours 12–7 PM', image: 'photo-1559339352-11d035aa65de', location: 'Cyber Hub, Gurugram', tags: ['rooftop'] },
  { id: 17, name: 'Saffron Fine Dine', cuisines: ['North Indian', 'Continental', 'Desserts'], modes: ['dining'], rating: 4.9, reviews: 6700, priceForTwo: 6000, time: 50, distance: 8.4, veg: false, offer: null, image: 'photo-1414235077428-338989a2e8c0', location: 'Lodhi Road', tags: ['romantic'] },
  { id: 18, name: 'Crispy Chicken Co.', cuisines: ['Burger', 'Beverages'], modes: ['delivery'], rating: 3.8, reviews: 4100, priceForTwo: 450, time: 21, distance: 2.4, veg: false, offer: '₹100 OFF above ₹399', image: 'photo-1562967914-608f82629710', location: 'Rajouri Garden', tags: [] },
];

const FOODS = [
  { name: 'Biryani', img: 'photo-1563379091339-03b21ab4a4f8' },
  { name: 'Pizza', img: 'photo-1513104890138-7c749659a591' },
  { name: 'Burger', img: 'photo-1568901346375-23c9450c58cd' },
  { name: 'Chinese', img: 'photo-1569718212165-3a8278d5f624' },
  { name: 'Desserts', img: 'photo-1565958011703-44f9829ba187' },
  { name: 'South Indian', img: 'photo-1589301760014-d929f3979dbc' },
  { name: 'North Indian', img: 'photo-1585937421612-70a008356fbe' },
  { name: 'Momos', img: 'photo-1534422298391-e4f8c172dddb' },
  { name: 'Ice Cream', img: 'photo-1497034825429-c343d7c6a68f' },
  { name: 'Healthy Food', img: 'photo-1512621776951-a57141f2eefd' },
  { name: 'Japanese', img: 'photo-1579584425555-c3ce17fd4351' },
  { name: 'Street Food', img: 'photo-1601050690597-df0568f70950' },
];

const COLLECTIONS = [
  { id: 'trending', title: 'Top Trending Spots', img: 'photo-1555396273-367ea4eb4db5', filter: r => r.rating >= 4.5 },
  { id: 'new', title: 'Newly Opened Places', img: 'photo-1559339352-11d035aa65de', filter: r => r.tags.includes('new') },
  { id: 'rooftop', title: 'Best Rooftop Places', img: 'photo-1514933651103-005eec06c04b', filter: r => r.tags.includes('rooftop') },
  { id: 'romantic', title: 'Romantic Dining', img: 'photo-1414235077428-338989a2e8c0', filter: r => r.tags.includes('romantic') },
];

const COUPONS = {
  ZOMATO50: { min: 149, calc: total => Math.min(100, total * 0.5) },
  WELCOME75: { min: 299, calc: () => 75 },
  FEAST20: { min: 499, calc: total => Math.min(150, total * 0.2) },
};

const FREE_DELIVERY_MIN = 499;
const DELIVERY_FEE = 40;
const PLATFORM_FEE = 5;

/* =========================================================
   HELPERS
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rupee = n => '₹' + Math.round(n).toLocaleString('en-IN');
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const formatCount = n => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n));
const getRestaurant = id => RESTAURANTS.find(r => r.id === Number(id));
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

const store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or disabled */ }
  },
};

function flagError(el) {
  el.classList.remove('error');
  void el.offsetWidth;
  el.classList.add('error');
  setTimeout(() => el.classList.remove('error'), 600);
}

/* =========================================================
   STATE
   ========================================================= */
const state = {
  mode: 'delivery',
  filters: new Set(),
  cuisine: null,
  collection: null,
  search: '',
  sort: 'relevance',
 city: store.get('zc_city', 'Jalgaon'),
  cart: store.get('zc_cart', { restId: null, items: {} }),
  coupon: null,
  favs: new Set(store.get('zc_favs', [])),
  user: store.get('zc_user', null),
  pendingCheckout: false,
  openRestId: null,
};

/* =========================================================
   MENU
   ========================================================= */
const menuCache = {};

function getMenu(r) {
  if (menuCache[r.id]) return menuCache[r.id];
  const factor = Math.min(1.9, Math.max(0.85, r.priceForTwo / 600));
  const sections = r.cuisines
    .filter(c => MENU_TEMPLATES[c])
    .map(c => ({
      title: c,
      items: MENU_TEMPLATES[c]
        .filter(it => !r.veg || it.veg)
        .map((it, i) => ({ ...it, id: `${slug(c)}-${i}`, price: Math.max(49, Math.round((it.price * factor) / 10) * 10 - 1) })),
    }))
    .filter(s => s.items.length);
  return (menuCache[r.id] = sections);
}

function findItem(r, itemId) {
  if (!r) return null;
  for (const s of getMenu(r)) {
    const it = s.items.find(i => i.id === itemId);
    if (it) return it;
  }
  return null;
}

/* =========================================================
   TOAST
   ========================================================= */
function toast(msg, type = 'success') {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
  const wrap = $('#toastWrap');
  while (wrap.children.length >= 3) wrap.firstElementChild.remove();
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span></span>`;
  el.querySelector('span').textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 2800);
}

/* =========================================================
   FILTERING & RESTAURANT GRID
   ========================================================= */
function matchesQuery(r, q) {
  return (
    r.name.toLowerCase().includes(q) ||
    r.location.toLowerCase().includes(q) ||
    r.cuisines.some(c => c.toLowerCase().includes(q)) ||
    getMenu(r).some(s => s.items.some(it => it.name.toLowerCase().includes(q)))
  );
}

function getFiltered() {
  let list = [...RESTAURANTS];
  const q = state.search.trim().toLowerCase();

  if (q) list = list.filter(r => matchesQuery(r, q));
  else if (state.collection) list = list.filter(COLLECTIONS.find(c => c.id === state.collection).filter);
  else list = list.filter(r => r.modes.includes(state.mode));

  if (state.cuisine) list = list.filter(r => r.cuisines.includes(state.cuisine));
  if (state.filters.has('rating')) list = list.filter(r => r.rating >= 4);
  if (state.filters.has('veg')) list = list.filter(r => r.veg);
  if (state.filters.has('fast')) list = list.filter(r => r.modes.includes('delivery') && r.time <= 25);
  if (state.filters.has('offers')) list = list.filter(r => r.offer);
  if (state.filters.has('fav')) list = list.filter(r => state.favs.has(r.id));

  const sorters = {
    rating: (a, b) => b.rating - a.rating,
    time: (a, b) => a.time - b.time,
    costLow: (a, b) => a.priceForTwo - b.priceForTwo,
    costHigh: (a, b) => b.priceForTwo - a.priceForTwo,
  };
  if (sorters[state.sort]) list.sort(sorters[state.sort]);
  else list.sort((a, b) => b.tags.includes('promoted') - a.tags.includes('promoted'));
  return list;
}

function restaurantCard(r, i) {
  const fav = state.favs.has(r.id);
  const showTime = r.modes.includes('delivery') && (state.mode === 'delivery' || state.search || state.collection);
  const tag = r.tags.includes('new') ? '<span class="r-tag new">New</span>' : r.tags.includes('promoted') ? '<span class="r-tag">Promoted</span>' : '';
  return `
    <article class="r-card" style="--i:${i}" data-open-rest="${r.id}">
      <div class="r-img">
        <img src="${IMG(r.image, 600)}" alt="${escapeHTML(r.name)}" loading="lazy" onerror="imgFallback(this)" />
        ${tag}
        <button class="fav-btn ${fav ? 'active' : ''}" data-fav="${r.id}" aria-label="Save to favourites"><i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i></button>
        ${r.offer ? `<span class="r-offer">${r.offer}</span>` : ''}
        <span class="r-time">${showTime ? `<i class="fa-regular fa-clock"></i> ${r.time} min` : `<i class="fa-solid fa-location-dot"></i> ${r.distance} km`}</span>
      </div>
      <div class="r-body">
        <div class="r-row">
          <h3>${escapeHTML(r.name)}</h3>
          <span class="rating ${r.rating < 4.2 ? 'mid' : ''}">${r.rating.toFixed(1)} <i class="fa-solid fa-star"></i></span>
        </div>
        <div class="r-row">
          <p class="cuisines">${r.cuisines.join(', ')}</p>
          <p class="price">${rupee(r.priceForTwo)} for two</p>
        </div>
        <div class="r-row">
          <span>${r.location}${r.veg ? ' · <span class="veg-badge">Pure Veg</span>' : ''}</span>
          <span>${formatCount(r.reviews)} reviews</span>
        </div>
      </div>
    </article>`;
}

function renderRestaurants() {
  const list = getFiltered();
  $('#restaurantGrid').innerHTML = list.map(restaurantCard).join('');
  $('#emptyState').hidden = list.length > 0;
  $('#resultCount').textContent = `${list.length} place${list.length === 1 ? '' : 's'}`;
  $('#sortSelect').value = state.sort;
  syncChips();
  updateTabs();
  updateTitle();
  renderActiveFilters();
  $$('.food-item').forEach(f => f.classList.toggle('active', f.dataset.cuisine === state.cuisine));
}

function updateTitle() {
  const modeTitles = { delivery: 'Delivery Restaurants', dining: 'Dine-Out Restaurants', nightlife: 'Nightlife Restaurants' };
  let title;
  if (state.search) title = `Results for “${escapeHTML(state.search)}”`;
  else if (state.collection) title = `${COLLECTIONS.find(c => c.id === state.collection).title} in ${state.city}`;
  else title = `${state.cuisine ? state.cuisine + ' ' : ''}${modeTitles[state.mode]} in ${state.city}`;
  $('#restaurantsTitle').innerHTML = title;
  $$('.city-name').forEach(el => (el.textContent = state.city));
}

function updateTabs() {
  const active = state.search || state.collection ? null : state.mode;
  $$('#modeTabs .tab').forEach(t => t.classList.toggle('active', t.dataset.mode === active));
  moveIndicator();
}

function moveIndicator() {
  const active = $('#modeTabs .tab.active');
  const ind = $('#tabIndicator');
  if (!active) { ind.style.width = '0'; return; }
  ind.style.left = active.offsetLeft + 'px';
  ind.style.width = active.offsetWidth + 'px';
}

function syncChips() {
  $$('[data-filter]').forEach(c => c.classList.toggle('active', state.filters.has(c.dataset.filter)));
}

function renderActiveFilters() {
  const pills = [];
  if (state.search) pills.push(['search', `<i class="fa-solid fa-magnifying-glass"></i> “${escapeHTML(state.search)}”`]);
  if (state.collection) pills.push(['collection', `<i class="fa-solid fa-layer-group"></i> ${COLLECTIONS.find(c => c.id === state.collection).title}`]);
  if (state.cuisine) pills.push(['cuisine', `<i class="fa-solid fa-utensils"></i> ${state.cuisine}`]);
  $('#activeFilters').innerHTML = pills
    .map(([key, label]) => `<span class="af-pill">${label}<button data-remove="${key}" aria-label="Remove filter"><i class="fa-solid fa-xmark"></i></button></span>`)
    .join('');
}

function scrollToRestaurants() {
  $('#restaurants').scrollIntoView({ behavior: 'smooth' });
}

function setMode(mode, scroll = false) {
  state.mode = mode;
  state.collection = null;
  state.search = '';
  $('#searchInput').value = '';
  toggleClearBtn();
  renderRestaurants();
  if (scroll) scrollToRestaurants();
}

function setCuisine(cuisine, toggle = true) {
  state.cuisine = toggle && state.cuisine === cuisine ? null : cuisine;
  state.search = '';
  state.collection = null;
  state.mode = 'delivery';
  $('#searchInput').value = '';
  toggleClearBtn();
  renderRestaurants();
  scrollToRestaurants();
}

function setCollection(id) {
  state.collection = id;
  state.search = '';
  state.cuisine = null;
  $('#searchInput').value = '';
  toggleClearBtn();
  renderRestaurants();
  scrollToRestaurants();
}

function toggleFilter(key) {
  state.filters.has(key) ? state.filters.delete(key) : state.filters.add(key);
  renderRestaurants();
}

function removeFilter(key) {
  if (key === 'search') { state.search = ''; $('#searchInput').value = ''; toggleClearBtn(); }
  if (key === 'collection') state.collection = null;
  if (key === 'cuisine') state.cuisine = null;
  renderRestaurants();
}

function clearFilters() {
  state.filters.clear();
  state.cuisine = null;
  state.collection = null;
  state.search = '';
  state.sort = 'relevance';
  $('#searchInput').value = '';
  toggleClearBtn();
  renderRestaurants();
}

function toggleFav(id, btn) {
  const r = getRestaurant(id);
  if (state.favs.has(id)) {
    state.favs.delete(id);
    toast(`Removed ${r.name} from favourites`, 'info');
  } else {
    state.favs.add(id);
    toast(`Added ${r.name} to favourites ❤️`);
  }
  store.set('zc_favs', [...state.favs]);
  const on = state.favs.has(id);
  btn.classList.toggle('active', on);
  btn.querySelector('i').className = `fa-${on ? 'solid' : 'regular'} fa-heart`;
  btn.classList.remove('pop');
  void btn.offsetWidth;
  btn.classList.add('pop');
  if (state.filters.has('fav')) renderRestaurants();
}

/* =========================================================
   STATIC SECTIONS
   ========================================================= */
function renderCollections() {
  $('#collectionsGrid').innerHTML = COLLECTIONS.map((c, i) => {
    const count = RESTAURANTS.filter(c.filter).length;
    return `
      <div class="collection reveal" style="--delay:${i * 0.1}s" data-collection="${c.id}">
        <img src="${IMG(c.img, 600)}" alt="${c.title}" loading="lazy" onerror="imgFallback(this)" />
        <div class="collection-info">
          <h3>${c.title}</h3>
          <p>${count} Places <i class="fa-solid fa-play"></i></p>
        </div>
      </div>`;
  }).join('');
}

function renderFoods() {
  $('#foodSlider').innerHTML = FOODS.map(
    f => `
      <div class="food-item" data-cuisine="${f.name}">
        <div class="food-circle"><img src="${IMG(f.img, 300)}" alt="${f.name}" loading="lazy" onerror="imgFallback(this)" /></div>
        <span>${f.name}</span>
      </div>`
  ).join('');
}

function renderExplore() {
  const groups = [
    { title: 'Popular cuisines near me', links: FOODS.map(f => `<button data-cuisine="${f.name}">${f.name} near me</button>`) },
    {
      title: 'Popular restaurant types near me',
      links: [
        '<button data-mode="delivery" data-scroll>Delivery</button>',
        '<button data-mode="dining" data-scroll>Dine-out</button>',
        '<button data-mode="nightlife" data-scroll>Pubs &amp; Bars</button>',
        ...COLLECTIONS.map(c => `<button data-collection="${c.id}">${c.title}</button>`),
      ],
    },
    { title: 'Top restaurant chains', links: RESTAURANTS.map(r => `<button data-open-rest="${r.id}">${escapeHTML(r.name)}</button>`) },
    { title: 'Cities we deliver to', links: CITIES.map(c => `<button data-city="${c}">${c}</button>`) },
  ];
  $('#accordion').innerHTML = groups
    .map(
      (g, i) => `
      <div class="acc-item reveal" style="--delay:${i * 0.08}s">
        <button class="acc-head">${g.title}<i class="fa-solid fa-chevron-down"></i></button>
        <div class="acc-body"><div class="acc-inner"><div class="acc-links">${g.links.join('')}</div></div></div>
      </div>`
    )
    .join('');
}

function populateCities() {
  const sel = $('#citySelect');
  sel.innerHTML = CITIES.map(c => `<option value="${c}">${c}</option>`).join('');
  if (!CITIES.includes(state.city)) state.city = CITIES[0];
  sel.value = state.city;
  sel.addEventListener('change', () => setCity(sel.value));
}

function setCity(city) {
  state.city = city;
  store.set('zc_city', city);
  $('#citySelect').value = city;
  fixTyping(city);
  updateTitle();
  toast(`Showing places in ${city} 📍`, 'info');
}

/* =========================================================
   TYPING EFFECT
   ========================================================= */
const typer = { el: null, i: 0, text: '', deleting: false, fixed: null, timer: null, started: false };

function typeTick() {
  const t = typer;
  const target = t.fixed ?? CITIES[t.i];
  if (t.deleting) {
    t.text = t.text.slice(0, -1);
    if (!t.text) {
      t.deleting = false;
      if (!t.fixed) t.i = (t.i + 1) % CITIES.length;
    }
  } else {
    t.text = target.slice(0, t.text.length + 1);
    if (t.text === target) {
      t.el.textContent = t.text;
      if (t.fixed) return;
      t.deleting = true;
      t.timer = setTimeout(typeTick, 1700);
      return;
    }
  }
  t.el.textContent = t.text;
  t.timer = setTimeout(typeTick, t.deleting ? 45 : 95);
}

function startTyping() {
  if (typer.started) return;
  typer.started = true;
  typeTick();
}

function fixTyping(city) {
  clearTimeout(typer.timer);
  typer.started = true;
  typer.fixed = city;
  typer.deleting = typer.text.length > 0;
  typeTick();
}

/* =========================================================
   SEARCH & SUGGESTIONS
   ========================================================= */
let suggIndex = -1;

function toggleClearBtn() {
  $('#clearSearch').hidden = !$('#searchInput').value;
}

function closeSuggestions() {
  $('#suggestions').classList.remove('open');
  suggIndex = -1;
}

function renderSuggestions(raw) {
  const query = raw.trim();
  const q = query.toLowerCase();
  suggIndex = -1;
  const box = $('#suggestions');
  if (!q) return closeSuggestions();

  const re = new RegExp(`(${escapeRegExp(escapeHTML(query))})`, 'ig');
  const hl = s => escapeHTML(s).replace(re, '<mark>$1</mark>');

  const rests = RESTAURANTS.filter(
    r => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.cuisines.some(c => c.toLowerCase().includes(q))
  ).slice(0, 5);

  const seen = new Set();
  const dishes = [];
  RESTAURANTS.forEach(r =>
    getMenu(r).forEach(s =>
      s.items.forEach(it => {
        if (it.name.toLowerCase().includes(q) && !seen.has(it.name)) {
          seen.add(it.name);
          dishes.push({ r, it });
        }
      })
    )
  );

  let html = rests
    .map(
      r => `
      <div class="sugg" data-open-rest="${r.id}" data-sugg>
        <img src="${IMG(r.image, 120)}" alt="" onerror="imgFallback(this)" />
        <div><h4>${hl(r.name)}</h4><p>${hl(r.cuisines.join(', '))} · ${r.rating} ★ · ${hl(r.location)}</p></div>
      </div>`
    )
    .join('');
  html += dishes
    .slice(0, 4)
    .map(
      ({ r, it }) => `
      <div class="sugg" data-open-rest="${r.id}" data-sugg>
        <div class="sugg-emoji">${it.emoji}</div>
        <div><h4>${hl(it.name)}</h4><p>Dish · ${rupee(it.price)} at ${escapeHTML(r.name)}</p></div>
      </div>`
    )
    .join('');

  box.innerHTML = html || `<div class="sugg-empty">No results for “${escapeHTML(query)}” 😕</div>`;
  box.classList.add('open');
}

function runSearch(value) {
  const v = value.trim();
  closeSuggestions();
  if (!v) {
    if (state.search) { state.search = ''; renderRestaurants(); }
    return;
  }
  state.search = v;
  state.collection = null;
  renderRestaurants();
  scrollToRestaurants();
  $('#searchInput').blur();
}

function setupSearch() {
  const input = $('#searchInput');
  const showSuggestions = debounce(() => renderSuggestions(input.value), 120);

  input.addEventListener('input', () => {
    toggleClearBtn();
    if (!input.value.trim() && state.search) { state.search = ''; renderRestaurants(); }
    showSuggestions();
  });
  input.addEventListener('focus', () => input.value.trim() && renderSuggestions(input.value));
  input.addEventListener('keydown', e => {
    const items = $$('#suggestions .sugg');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      suggIndex = (suggIndex + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('active', i === suggIndex));
      items[suggIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggIndex >= 0 && items[suggIndex]) items[suggIndex].click();
      else runSearch(input.value);
    } else if (e.key === 'Escape') {
      closeSuggestions();
    }
  });

  $('#clearSearch').addEventListener('click', () => {
    input.value = '';
    toggleClearBtn();
    closeSuggestions();
    if (state.search) { state.search = ''; renderRestaurants(); }
    input.focus();
  });
}

/* =========================================================
   MODALS
   ========================================================= */
function lockScroll() {
  const anyOpen = $('.modal.open') || $('#cartDrawer.open') || $('#navLinks.open');
  document.body.classList.toggle('no-scroll', Boolean(anyOpen));
}

function openModal(id) {
  const m = $('#' + id);
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  lockScroll();
}

function closeModal(id) {
  const m = $('#' + id);
  if (!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  if (id === 'menuModal') state.openRestId = null;
  if (id === 'orderModal') trackTimers.forEach(clearTimeout);
  if (id === 'authModal') state.pendingCheckout = false;
  lockScroll();
}

/* =========================================================
   RESTAURANT MENU
   ========================================================= */
function itemActionHTML(restId, itemId) {
  const qty = state.cart.restId === restId ? state.cart.items[itemId] || 0 : 0;
  return qty
    ? `<div class="stepper"><button data-dec="${itemId}" data-rest="${restId}" aria-label="Remove one">−</button><span>${qty}</span><button data-inc="${itemId}" data-rest="${restId}" aria-label="Add one">+</button></div>`
    : `<button class="add-btn" data-add="${itemId}" data-rest="${restId}">ADD<sup>+</sup></button>`;
}

function openMenu(id) {
  const r = getRestaurant(id);
  if (!r) return;
  state.openRestId = r.id;
  let idx = 0;
  const canDeliver = r.modes.includes('delivery');

  $('#menuContent').innerHTML = `
    <div class="menu-banner">
      <img src="${IMG(r.image, 1200)}" alt="" onerror="imgFallback(this)" />
      <div class="menu-banner-info">
        <h2>${escapeHTML(r.name)}</h2>
        <p>${r.cuisines.join(', ')} · ${r.location}</p>
      </div>
    </div>
    <div class="menu-meta">
      <span class="meta-pill"><span class="rating ${r.rating < 4.2 ? 'mid' : ''}">${r.rating.toFixed(1)} <i class="fa-solid fa-star"></i></span> ${formatCount(r.reviews)} ratings</span>
      <span class="meta-pill"><i class="fa-regular fa-clock"></i> ${canDeliver ? `${r.time} min delivery` : `${r.distance} km away`}</span>
      <span class="meta-pill"><i class="fa-solid fa-indian-rupee-sign"></i> ${r.priceForTwo} for two</span>
      ${r.veg ? '<span class="meta-pill veg-badge"><i class="fa-solid fa-leaf"></i> Pure Veg</span>' : ''}
      ${r.offer ? `<span class="meta-pill offer"><i class="fa-solid fa-tag"></i> ${r.offer}</span>` : ''}
      ${r.modes.includes('dining') ? `<button class="meta-pill" data-book="${r.id}"><i class="fa-solid fa-calendar-check"></i> Book a table</button>` : ''}
    </div>
    <div class="menu-list">
      ${getMenu(r)
        .map(
          s => `
        <div class="menu-section">
          <h3>${s.title} <small>(${s.items.length})</small></h3>
          ${s.items
            .map(
              it => `
            <div class="menu-item" style="--i:${idx++}">
              <div class="mi-info">
                <div class="mi-top">
                  <span class="veg-icon ${it.veg ? '' : 'non'}" title="${it.veg ? 'Veg' : 'Non-veg'}"></span>
                  ${it.bestseller ? '<span class="bestseller"><i class="fa-solid fa-star"></i> Bestseller</span>' : ''}
                </div>
                <h4>${it.name}</h4>
                <div class="mi-price">${rupee(it.price)}</div>
                <p>${it.desc}</p>
              </div>
              <div class="mi-side">
                <div class="mi-thumb">${it.emoji}</div>
                <div class="mi-action" data-action-for="${it.id}">${itemActionHTML(r.id, it.id)}</div>
              </div>
            </div>`
            )
            .join('')}
        </div>`
        )
        .join('')}
    </div>`;

  $$('#menuContent [data-action-for]').forEach(el => (el.dataset.qty = currentQty(r.id, el.dataset.actionFor)));
  updateViewCartBar(cartTotals());
  openModal('menuModal');
  $('#menuModal .modal-box').scrollTop = 0;
}

function currentQty(restId, itemId) {
  return state.cart.restId === restId ? state.cart.items[itemId] || 0 : 0;
}

function updateViewCartBar(t) {
  const show = state.openRestId && state.openRestId === state.cart.restId && t.count > 0;
  $('#viewCartBar').classList.toggle('show', Boolean(show));
  if (show) $('#viewCartText').textContent = `${t.count} item${t.count > 1 ? 's' : ''} added | ${rupee(t.itemTotal)}`;
}

/* =========================================================
   CART
   ========================================================= */
function sanitizeCart() {
  const c = state.cart;
  const r = c && getRestaurant(c.restId);
  if (!r || !c.items || typeof c.items !== 'object') {
    state.cart = { restId: null, items: {} };
    return;
  }
  Object.keys(c.items).forEach(id => {
    if (!findItem(r, id) || !(c.items[id] > 0)) delete c.items[id];
  });
  if (!Object.keys(c.items).length) c.restId = null;
}

function cartTotals() {
  const r = getRestaurant(state.cart.restId);
  const lines = r
    ? Object.entries(state.cart.items).map(([id, qty]) => ({ item: findItem(r, id), qty })).filter(l => l.item && l.qty > 0)
    : [];
  const itemTotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const coupon = COUPONS[state.coupon];
  if (state.coupon && (!coupon || itemTotal < coupon.min)) state.coupon = null;
  const discount = state.coupon ? Math.round(coupon.calc(itemTotal)) : 0;

  const delivery = !itemTotal || itemTotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const platform = itemTotal ? PLATFORM_FEE : 0;
  const gst = Math.round((itemTotal - discount) * 0.05);
  const total = itemTotal - discount + delivery + platform + gst;
  return { lines, count, itemTotal, discount, delivery, platform, gst, total, freeDeliveryLeft: Math.max(0, FREE_DELIVERY_MIN - itemTotal) };
}

function saveCart() {
  store.set('zc_cart', state.cart);
  updateCartUI();
}

function updateCartUI() {
  const t = cartTotals();
  const badge = $('#cartCount');
  badge.textContent = t.count;
  badge.classList.toggle('show', t.count > 0);

  if (state.openRestId) {
    $$('#menuContent [data-action-for]').forEach(el => {
      const qty = currentQty(state.openRestId, el.dataset.actionFor);
      if (Number(el.dataset.qty) !== qty) {
        el.dataset.qty = qty;
        el.innerHTML = itemActionHTML(state.openRestId, el.dataset.actionFor);
      }
    });
  }
  updateViewCartBar(t);
  if ($('#cartDrawer').classList.contains('open')) renderCart();
}

function bumpCart() {
  const btn = $('#cartBtn');
  btn.classList.remove('bump');
  void btn.offsetWidth;
  btn.classList.add('bump');
}

function flyToCart(el) {
  const from = el.getBoundingClientRect();
  const to = $('#cartBtn').getBoundingClientRect();
  const dot = document.createElement('div');
  dot.className = 'fly-dot';
  dot.textContent = '+1';
  dot.style.left = from.left + from.width / 2 - 11 + 'px';
  dot.style.top = from.top + from.height / 2 - 11 + 'px';
  document.body.appendChild(dot);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  dot.animate(
    [
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 120}px) scale(1.4)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: 0.4 },
    ],
    { duration: 750, easing: 'cubic-bezier(.45, 0, .55, 1)' }
  ).onfinish = () => {
    dot.remove();
    bumpCart();
  };
}

function addToCart(restId, itemId, sourceEl) {
  const r = getRestaurant(restId);
  const item = findItem(r, itemId);
  if (!item) return;

  if (state.cart.restId && state.cart.restId !== restId) {
    const current = getRestaurant(state.cart.restId);
    if (!confirm(`Your cart has items from ${current.name}.\nDiscard them and add items from ${r.name}?`)) return;
    state.cart = { restId, items: {} };
    state.coupon = null;
  }

  const isNew = !state.cart.items[itemId];
  state.cart.restId = restId;
  state.cart.items[itemId] = (state.cart.items[itemId] || 0) + 1;

  if (sourceEl) flyToCart(sourceEl);
  else bumpCart();
  saveCart();
  if (isNew && sourceEl) toast(`${item.name} added to cart`);
}

function changeQty(itemId, delta) {
  const qty = (state.cart.items[itemId] || 0) + delta;
  if (qty <= 0) delete state.cart.items[itemId];
  else state.cart.items[itemId] = qty;
  if (!Object.keys(state.cart.items).length) {
    state.cart.restId = null;
    state.coupon = null;
  }
  saveCart();
}

function couponHTML(t) {
  if (state.coupon) {
    return `<div class="coupon-applied"><span><i class="fa-solid fa-ticket"></i> ${state.coupon} applied · You save ${rupee(t.discount)}</span><button data-remove-coupon>Remove</button></div>`;
  }
  return `
    <div class="coupon-row">
      <input id="couponInput" placeholder="Enter coupon code" maxlength="12" />
      <button data-apply-coupon>Apply</button>
    </div>
    <p class="coupon-hint">Try ${Object.keys(COUPONS).map(c => `<b data-coupon="${c}">${c}</b>`).join(' · ')}</p>`;
}

function applyCoupon(raw) {
  const code = String(raw || '').trim().toUpperCase();
  const coupon = COUPONS[code];
  const { itemTotal } = cartTotals();
  if (!code) return toast('Please enter a coupon code', 'error');
  if (!coupon) return toast(`"${code}" is not a valid coupon`, 'error');
  if (itemTotal < coupon.min) return toast(`Add ${rupee(coupon.min - itemTotal)} more to use ${code}`, 'error');
  state.coupon = code;
  renderCart();
  toast(`${code} applied! You save ${rupee(cartTotals().discount)} 🎉`);
  launchConfetti(50);
}

function renderCart() {
  const body = $('#cartBody');
  const foot = $('#cartFoot');
  const t = cartTotals();

  if (!t.lines.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="big">🛒</div>
        <h4>Your cart is empty</h4>
        <p class="muted">Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
        <button class="btn primary" data-browse>Browse restaurants</button>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  const r = getRestaurant(state.cart.restId);
  body.innerHTML = `
    <div class="cart-rest">
      <img src="${IMG(r.image, 200)}" alt="" onerror="imgFallback(this)" />
      <div><h4>${escapeHTML(r.name)}</h4><p>${r.location} · ${r.time} min</p></div>
    </div>
    ${t.lines
      .map(
        l => `
      <div class="cart-item">
        <span class="veg-icon ${l.item.veg ? '' : 'non'}"></span>
        <div class="ci-name">${l.item.name}<small>${rupee(l.item.price)}</small></div>
        <div class="stepper small"><button data-dec="${l.item.id}" data-rest="${r.id}" aria-label="Remove one">−</button><span>${l.qty}</span><button data-inc="${l.item.id}" data-rest="${r.id}" aria-label="Add one">+</button></div>
        <div class="ci-price">${rupee(l.item.price * l.qty)}</div>
      </div>`
      )
      .join('')}
    <div class="coupon">${couponHTML(t)}</div>
    <div class="bill">
      <h4>Bill Details</h4>
      ${
        t.freeDeliveryLeft > 0
          ? `<p class="free-del">Add ${rupee(t.freeDeliveryLeft)} more for FREE delivery 🚀</p><div class="progress-del"><span style="width:${(t.itemTotal / FREE_DELIVERY_MIN) * 100}%"></span></div>`
          : '<p class="free-del">🎉 Yay! You have unlocked FREE delivery</p>'
      }
      <div class="bill-row"><span>Item total</span><span>${rupee(t.itemTotal)}</span></div>
      ${t.discount ? `<div class="bill-row discount"><span>Coupon discount (${state.coupon})</span><span>−${rupee(t.discount)}</span></div>` : ''}
      <div class="bill-row"><span>Delivery fee</span><span>${t.delivery ? rupee(t.delivery) : `<s>${rupee(DELIVERY_FEE)}</s> FREE`}</span></div>
      <div class="bill-row"><span>Platform fee</span><span>${rupee(t.platform)}</span></div>
      <div class="bill-row"><span>GST &amp; restaurant charges</span><span>${rupee(t.gst)}</span></div>
      <div class="bill-row total"><span>To Pay</span><span>${rupee(t.total)}</span></div>
    </div>`;

  foot.innerHTML = `
    <textarea class="address" id="address" rows="2" placeholder="Delivery address (e.g. Flat 21, Green Park, ${state.city})">${escapeHTML(store.get('zc_address', ''))}</textarea>
    <button class="btn primary checkout-btn" id="placeOrder">
      <span>${rupee(t.total)} <small>TOTAL</small></span>
      <span>Place Order <i class="fa-solid fa-arrow-right"></i></span>
    </button>`;
}

function openCart() {
  renderCart();
  $('#cartDrawer').classList.add('open');
  $('#drawerOverlay').classList.add('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'false');
  lockScroll();
}

function closeCart() {
  $('#cartDrawer').classList.remove('open');
  $('#drawerOverlay').classList.remove('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'true');
  lockScroll();
}

/* =========================================================
   CHECKOUT & ORDER TRACKING
   ========================================================= */
let trackTimers = [];
const TRACK_MSGS = [
  'Restaurant has received your order',
  'Your food is being freshly prepared 👨‍🍳',
  'Delivery partner is on the way 🛵',
  'Delivered! Enjoy your meal 😋',
];

async function placeOrder() {
  const t = cartTotals();
  if (!t.count) return;

  if (!state.user) {
    closeCart();
    openAuth('login');
    state.pendingCheckout = true;
    toast('Please log in to place your order', 'info');
    return;
  }

  const addressEl = $('#address');
  const address = addressEl.value.trim();
  if (address.length < 6) {
    flagError(addressEl);
    addressEl.focus();
    toast('Please enter your delivery address', 'error');
    return;
  }

  const r = getRestaurant(state.cart.restId);
    // Send the cart order to the backend
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerName: state.user?.name || 'Demo Customer',
        address: address,
        items: t.lines.map(line => ({
          name: line.item.name,
          quantity: line.qty,
          price: line.item.price
        })),
        total: t.total
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      toast(result.message || 'Could not save the order', 'error');
      return;
    }

  } catch (error) {
    console.error('Order submission failed:', error);
    toast('Backend connection failed. Please try again.', 'error');
    return;
  }
  const orderId = 'ZMT' + Math.floor(100000 + Math.random() * 900000);
  $('#orderInfo').innerHTML = `Order <b>#${orderId}</b> from <b>${escapeHTML(r.name)}</b> · ${rupee(t.total)}<br />Arriving in about <b>${r.time} mins</b> at ${escapeHTML(address)}`;

  state.cart = { restId: null, items: {} };
  state.coupon = null;
  saveCart();
  closeCart();
  closeModal('menuModal');
  openModal('orderModal');
  startTracking();
  launchConfetti();
}

function startTracking() {
  trackTimers.forEach(clearTimeout);
  trackTimers = [];
  const steps = $$('.track-step');
  const setStep = n => {
    steps.forEach((s, i) => {
      s.classList.toggle('done', i <= n);
      s.classList.toggle('current', i === n && n < steps.length - 1);
    });
    $('#trackerFill').style.width = (n / (steps.length - 1)) * 100 + '%';
    $('#trackStatus').textContent = TRACK_MSGS[n];
  };
  setStep(0);
  [1, 2, 3].forEach(n => trackTimers.push(setTimeout(() => setStep(n), n * 3000)));
}

function launchConfetti(count = 140) {
  const colors = ['#e23744', '#ffd166', '#06d6a0', '#118ab2', '#ff7e5f', '#9b5de5'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--dx', Math.random() * 240 - 120 + 'px');
    c.style.setProperty('--rot', Math.random() * 1080 - 540 + 'deg');
    c.style.animationDuration = 2.4 + Math.random() * 2 + 's';
    c.style.animationDelay = Math.random() * 0.5 + 's';
    if (Math.random() > 0.5) c.style.borderRadius = '50%';
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

/* =========================================================
   AUTH
   ========================================================= */
function openAuth(tab = 'login') {
  switchAuthTab(tab);
  resetLogin();
  openModal('authModal');
  setTimeout(() => (tab === 'login' ? $('#loginPhone') : $('#signupName')).focus(), 350);
}

function switchAuthTab(tab) {
  $$('.auth-tab').forEach(b => b.classList.toggle('active', b.dataset.authTab === tab));
  $('#loginForm').classList.toggle('active', tab === 'login');
  $('#signupForm').classList.toggle('active', tab === 'signup');
}

function resetLogin() {
  $('#loginStep1').hidden = false;
  $('#loginStep2').hidden = true;
  $$('.otp').forEach(o => (o.value = ''));
}

function loginUser(user) {
  const resumeCheckout = state.pendingCheckout;
  state.user = user;
  store.set('zc_user', user);
  renderAuthArea();
  closeModal('authModal');
  toast(`Welcome, ${user.name.split(' ')[0]}! 🎉`);
  if (resumeCheckout) setTimeout(openCart, 400);
}

function renderAuthArea() {
  const el = $('#authArea');
  if (state.user) {
    const first = escapeHTML(state.user.name.split(' ')[0]);
    el.innerHTML = `
      <div class="user-chip" id="userChip">
        <span class="avatar">${first.charAt(0).toUpperCase()}</span>
        <span>${first}</span>
        <i class="fa-solid fa-chevron-down small"></i>
        <div class="user-menu">
          <button data-user-action="favs"><i class="fa-solid fa-heart"></i> Favourites</button>
          <button data-user-action="cart"><i class="fa-solid fa-bag-shopping"></i> My Cart</button>
          <button data-user-action="logout"><i class="fa-solid fa-right-from-bracket"></i> Log out</button>
        </div>
      </div>`;
  } else {
    el.innerHTML = '<button class="nav-btn" data-auth="login">Log in</button><button class="nav-btn primary" data-auth="signup">Sign up</button>';
  }
}

function userAction(action) {
  $('#userChip')?.classList.remove('open');
  closeNav();
  if (action === 'favs') {
    state.filters.add('fav');
    renderRestaurants();
    scrollToRestaurants();
  } else if (action === 'cart') {
    openCart();
  } else if (action === 'logout') {
    state.user = null;
    store.set('zc_user', null);
    renderAuthArea();
    toast('Logged out successfully', 'info');
  }
}

function setupAuthForms() {
  const otps = $$('.otp');

  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const phone = $('#loginPhone').value.trim();
    if (!$('#loginStep1').hidden) {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        flagError($('#loginPhone').closest('.field'));
        toast('Enter a valid 10-digit mobile number', 'error');
        return;
      }
      $('#otpPhone').textContent = '+91 ' + phone;
      $('#loginStep1').hidden = true;
      $('#loginStep2').hidden = false;
      otps[0].focus();
      toast('OTP sent! (Demo: enter any 4 digits)', 'info');
    } else {
      const code = otps.map(o => o.value).join('');
      if (!/^\d{4}$/.test(code)) {
        otps.forEach(flagError);
        toast('Enter the 4-digit OTP', 'error');
        return;
      }
      loginUser({ name: 'Foodie', phone });
    }
  });

  $('#loginPhone').addEventListener('input', e => (e.target.value = e.target.value.replace(/\D/g, '')));
  $('#changePhone').addEventListener('click', () => { resetLogin(); $('#loginPhone').focus(); });

  otps.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && otps[i + 1]) otps[i + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && otps[i - 1]) otps[i - 1].focus();
    });
    input.addEventListener('paste', e => {
      const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 4);
      if (!digits) return;
      e.preventDefault();
      otps.forEach((o, j) => (o.value = digits[j] || ''));
      otps[Math.min(digits.length, 3)].focus();
    });
  });

  $('#signupForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#signupName').value.trim();
    const email = $('#signupEmail').value.trim();
    if (name.length < 2) { flagError($('#signupName')); return toast('Please enter your name', 'error'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { flagError($('#signupEmail')); return toast('Please enter a valid email', 'error'); }
    if (!$('#signupTerms').checked) return toast('Please accept the terms to continue', 'error');
    loginUser({ name, email });
    e.target.reset();
  });
}

/* =========================================================
   GET-THE-APP FORM
   ========================================================= */
function setupAppForm() {
  const form = $('#appForm');
  const input = $('#appInput');
  form.addEventListener('change', e => {
    if (e.target.name !== 'via') return;
    input.placeholder = e.target.value === 'email' ? 'Email' : 'Phone (10 digits)';
    input.type = e.target.value === 'email' ? 'email' : 'tel';
    input.value = '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const via = form.querySelector('input[name="via"]:checked').value;
    const v = input.value.trim();
    const ok = via === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) : /^[6-9]\d{9}$/.test(v);
    if (!ok) {
      flagError(input);
      toast(via === 'email' ? 'Please enter a valid email' : 'Please enter a valid 10-digit number', 'error');
      return;
    }
    toast(`App link sent to ${v} 📲`);
    input.value = '';
  });
}

/* =========================================================
   NAV, THEME, SCROLL EFFECTS
   ========================================================= */
let navOpen = false;

function toggleNav(force) {
  navOpen = force ?? !navOpen;
  $('#navLinks').classList.toggle('open', navOpen);
  $('#hamburger').classList.toggle('open', navOpen);
  lockScroll();
  onScroll();
}

function closeNav() {
  if (navOpen) toggleNav(false);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#themeToggle i').className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

let scrollTicking = false;
function onScroll() {
  const y = window.scrollY;
  $('#navbar').classList.toggle('scrolled', y > 60 || navOpen);
  const max = document.documentElement.scrollHeight - innerHeight;
  $('#scrollProgress').style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  $('#backToTop').classList.toggle('show', y > 700);
  if (y < innerHeight) $('#heroBg').style.transform = `translateY(${y * 0.35}px)`;
  scrollTicking = false;
}

function setupObservers() {
  const revealObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }),
    { threshold: 0.12 }
  );
  $$('.reveal').forEach(el => revealObs.observe(el));

  const counterObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }),
    { threshold: 0.5 }
  );
  $$('.stat-num').forEach(el => counterObs.observe(el));

  const gridObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      gridObs.unobserve(e.target);
    }),
    { threshold: 0.05 }
  );
  gridObs.observe($('#restaurantGrid'));
}

function animateCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const frame = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * eased).toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function setupTilt() {
  if (!matchMedia('(hover: hover)').matches) return;
  $$('.mode-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (!card.classList.contains('visible')) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add('tilting');
      card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });
}

function addRipple(e) {
  const target = e.target.closest('.btn, .chip, .add-btn');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
  ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
  if (target.matches('.chip, .outline, .add-btn')) ripple.style.background = 'rgba(226, 55, 68, .25)';
  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

/* =========================================================
   GLOBAL EVENTS
   ========================================================= */
function handleClick(e) {
  const t = e.target;
  let el;

  if (t.closest('a[href="#"]')) e.preventDefault();
  if (!t.closest('.search-input')) closeSuggestions();
  if (!t.closest('#userChip')) $('#userChip')?.classList.remove('open');
  if (t.closest('#navLinks > a')) closeNav();

  if ((el = t.closest('[data-fav]'))) return toggleFav(Number(el.dataset.fav), el);
  if ((el = t.closest('[data-add]'))) return addToCart(Number(el.dataset.rest), el.dataset.add, el);
  if ((el = t.closest('[data-inc]'))) return addToCart(Number(el.dataset.rest), el.dataset.inc);
  if ((el = t.closest('[data-dec]'))) return changeQty(el.dataset.dec, -1);
  if ((el = t.closest('[data-book]'))) return toast(`Table request sent to ${getRestaurant(el.dataset.book).name} for tonight 🍽️`);
  if ((el = t.closest('[data-open-rest]'))) {
    if (el.hasAttribute('data-sugg')) closeSuggestions();
    return openMenu(Number(el.dataset.openRest));
  }
  if ((el = t.closest('[data-close]'))) return closeModal(el.closest('.modal').id);
  if ((el = t.closest('[data-auth]'))) { closeNav(); return openAuth(el.dataset.auth); }
  if ((el = t.closest('[data-auth-tab]'))) return switchAuthTab(el.dataset.authTab);
  if ((el = t.closest('[data-google]'))) return loginUser({ name: 'Google Foodie', email: 'foodie@gmail.com' });
  if ((el = t.closest('[data-mode]'))) return setMode(el.dataset.mode, el.hasAttribute('data-scroll'));
  if ((el = t.closest('[data-cuisine]'))) return setCuisine(el.dataset.cuisine, Boolean(el.closest('.food-item')));
  if ((el = t.closest('[data-collection]'))) return setCollection(el.dataset.collection);
  if ((el = t.closest('[data-filter]'))) return toggleFilter(el.dataset.filter);
  if ((el = t.closest('[data-remove]'))) return removeFilter(el.dataset.remove);
  if ((el = t.closest('[data-clear]'))) return clearFilters();
  if ((el = t.closest('[data-city]'))) return setCity(el.dataset.city);
  if ((el = t.closest('[data-coupon]'))) return applyCoupon(el.dataset.coupon);
  if (t.closest('[data-apply-coupon]')) return applyCoupon($('#couponInput').value);
  if (t.closest('[data-remove-coupon]')) { state.coupon = null; renderCart(); return toast('Coupon removed', 'info'); }
  if (t.closest('[data-browse]')) { closeCart(); return scrollToRestaurants(); }
  if (t.closest('#placeOrder')) return placeOrder();
  if ((el = t.closest('[data-user-action]'))) return userAction(el.dataset.userAction);
  if ((el = t.closest('#userChip'))) return el.classList.toggle('open');
  if ((el = t.closest('[data-slide]'))) {
    const slider = $('#foodSlider');
    return slider.scrollBy({ left: slider.clientWidth * 0.7 * Number(el.dataset.slide), behavior: 'smooth' });
  }
  if ((el = t.closest('.acc-head'))) return el.parentElement.classList.toggle('open');
  if (t.classList.contains('modal')) return closeModal(t.id);
}

function handleKeydown(e) {
  if (e.key === 'Enter' && e.target.id === 'couponInput') return applyCoupon(e.target.value);
  if (e.key !== 'Escape') return;
  const open = $$('.modal.open');
  if (open.length) return closeModal(open[open.length - 1].id);
  if ($('#cartDrawer').classList.contains('open')) return closeCart();
  closeNav();
}

let loaderHidden = false;
function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  $('#loader').classList.add('hide');
  setTimeout(startTyping, 700);
}

/* =========================================================
   INIT
   ========================================================= */
function init() {
  applyTheme(store.get('zc_theme', 'light'));
  sanitizeCart();
  typer.el = $('#typed');

  populateCities();
  renderCollections();
  renderFoods();
  renderExplore();
  renderAuthArea();
  renderRestaurants();
  updateCartUI();

  setupObservers();
  setupSearch();
  setupAuthForms();
  setupAppForm();
  setupTilt();

  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('pointerdown', addRipple);
  document.addEventListener('input', e => { if (e.target.id === 'address') store.set('zc_address', e.target.value); });

  window.addEventListener('scroll', () => {
    if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', debounce(moveIndicator, 100));
  window.addEventListener('load', () => { moveIndicator(); setTimeout(hideLoader, 300); });
  document.fonts?.ready.then(moveIndicator);
  setTimeout(hideLoader, 2500);

  $('#cartBtn').addEventListener('click', openCart);
  $('#closeDrawer').addEventListener('click', closeCart);
  $('#drawerOverlay').addEventListener('click', closeCart);
  $('#viewCartBtn').addEventListener('click', () => { closeModal('menuModal'); openCart(); });
  $('#hamburger').addEventListener('click', () => toggleNav());
  $('#backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderRestaurants(); });
  $('#themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('zc_theme', next);
  });

  $('#year').textContent = new Date().getFullYear();
  onScroll();
}

init();
// Connect frontend to the backend API
async function loadRestaurantsFromBackend() {
  try {
    const response = await fetch(
      'http://localhost:3000/api/restaurants'
    );

    if (!response.ok) {
      throw new Error('Could not fetch restaurant data');
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid restaurant data');
    }

    result.data.forEach(apiRestaurant => {
      const restaurant = RESTAURANTS.find(
        r => r.id === apiRestaurant.id
      );

      if (restaurant) {
        restaurant.location = apiRestaurant.location;
        restaurant.rating = apiRestaurant.rating;
      }
    });

    renderRestaurants();
    toast('Backend connected successfully!');
  } catch (error) {
    console.error('Backend connection failed:', error);
    toast('Backend connection failed. Check the server.', 'error');
  }
}

loadRestaurantsFromBackend();