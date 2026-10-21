/* ===== Coastal Air & Electrical: script.js ===== */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* pages inside a folder (e.g. /middleton/) set data-root="../" on <body> */
const ROOT = document.body.dataset.root || '';
const u = p => ROOT + p;
const PRETTY = location.protocol !== 'file:';   // use /middleton/ online, middleton/index.html when testing locally

/* =====================================================================
   SETTINGS: edit business details here and the whole site updates
   ===================================================================== */
const SITE = {
  name: 'Coastal Air & Electrical',
  email: '',                                   // TODO: add if they want email shown
  enquiry: 'https://book.servicem8.com/request_service_online_booking?strVendorUUID=2e0645ed-f29c-4cfc-a536-2028d63d155b#1a23d33c-3d50-46f4-85f1-2299478c683b',
  facebook: 'https://www.facebook.com/walkerelectricalsolutions',
  instagram: 'https://www.instagram.com/coastal_air_electrical/',
  googleProfile: 'https://www.google.com/maps/place/Coastal+Air+%26+Electrical/data=!4m2!3m1!1s0x0:0xe12a1770890696f0',
  reviewLink: 'https://www.google.com/search?q=coastalairandelectrical#lrd=0x6ab1230b073a2663:0xe12a1770890696f0,3,,,,',
  rating: '5.0', reviewCount: 136, years: 15,
  licence: '',                                 // TODO: SA electrical contractor licence number
  arctick: '',                                 // TODO: ARCtick refrigerant authorisation number
  tz: 'Australia/Adelaide',
  gtm: 'GTM-KHB3X7FP'
};
/* Two locations. TODO: confirm phone, suburbs and postcodes for each */
const LOCATIONS = {
  seaford: {
    name: 'Seaford', region: 'Southern Adelaide', path: 'index.html', prettyPath: 'index.html',
    phone: '0413 784 024', tel: '0413784024',
    blurb: 'Air con, electrical and solar across Adelaide\u2019s southern suburbs and coast.',
    suburbs: ['Seaford', 'Seaford Rise', 'Seaford Meadows', 'Seaford Heights', 'Moana', 'Maslin Beach', 'Port Noarlunga', 'Port Noarlunga South', 'Christies Beach', 'Noarlunga Downs', 'Hackham', 'Huntfield Heights', 'Morphett Vale', 'Reynella', 'Hallett Cove', 'Aldinga', 'Aldinga Beach', 'Sellicks Beach', 'McLaren Vale', 'Willunga'],
    postcodes: n => n >= 5158 && n <= 5174
  },
  middleton: {
    name: 'Middleton', region: 'Fleurieu Peninsula', path: 'middleton/index.html', prettyPath: 'middleton/',
    phone: '0413 784 024', tel: '0413784024',  // TODO: change if Middleton has its own number
    blurb: 'Your local team for Middleton, Goolwa, Port Elliot, Victor Harbor and the south coast.',
    suburbs: ['Middleton', 'Goolwa', 'Goolwa Beach', 'Goolwa South', 'Hindmarsh Island', 'Port Elliot', 'Victor Harbor', 'Encounter Bay', 'Hayborough', 'McCracken', 'Waitpinga', 'Currency Creek', 'Mount Compass', 'Normanville', 'Yankalilla', 'Strathalbyn'],
    postcodes: n => (n >= 5201 && n <= 5214) || n === 5255
  }
};
const LOCK = LOCATIONS[document.body.dataset.loc] ? document.body.dataset.loc : 'seaford';
const LOC = LOCATIONS[LOCK];
const locHref = k => u(PRETTY ? LOCATIONS[k].prettyPath : LOCATIONS[k].path);
const POSTCODE_MAYBE = n => n >= 5000 && n <= 5299;   // wider Adelaide + SA regional fringe
/* Opening hours (24h). null = closed. TODO: confirm with the client (both locations) */
const HOURS = { Mon: [7, 17], Tue: [7, 17], Wed: [7, 17], Thu: [7, 17], Fri: [7, 17], Sat: null, Sun: null };
/* Paste a Formspree / Make webhook URL here. Empty = form opens a pre-filled text message instead */
const FORM_ENDPOINT = '';
/* Real Google reviews, copied word for word. Leave empty until you have them */
const REVIEWS = [
  // { name: 'First name', text: 'Exact review text', when: 'March 2026' },
];
/* Brands with photo evidence. TODO: confirm current suppliers */
const BRANDS = ['Mitsubishi Electric', 'Daikin', 'Panasonic', 'Fujitsu', 'Mitsubishi Heavy Industries', 'Samsung', 'Carrier', 'Haier'];
/* Projects: [file, title, caption, category, era] (real job photos only) */
const PROJECTS = [
  ['ducted-westlakes.jpg', '12kW ducted, zero ceiling space', 'A 12kW Mitsubishi Electric ducted system fitted into a home with almost no ceiling space.', 'ducted', 'Adelaide'],
  ['ducted-copper-grilles.jpg', 'Copper-finish ducted grilles', 'Linear grilles scrubbed back to a copper finish against original brick.', 'ducted', 'Adelaide'],
  ['commercial-daikin-freshair.jpg', '12 × Daikin split systems', 'Commercial install with fresh-air intake and seismic restraints on every unit.', 'commercial', 'Adelaide'],
  ['commercial-75kw-handover.jpg', '75kW commercial ducted', 'A 75kW ducted system handed over on a new warehouse.', 'commercial', 'Adelaide'],
  ['ducted-bedroom.jpg', 'Bulkhead ducted apartment', 'Multi-head bulkhead ducted system in a full apartment renovation.', 'ducted', 'Earlier work'],
  ['split-mhi-row.jpg', 'Four split systems, one home', 'Matching outdoor units with tidy pipe covers.', 'split', 'Earlier work'],
  ['ducted-fujitsu-10kw.jpg', '10kW Fujitsu ducted', 'Whole-home ducted heating and cooling.', 'ducted', 'Earlier work'],
  ['split-panasonic-apartment.jpg', 'Split systems for neighbours', 'Two Panasonic units sharing one neat pipe run.', 'split', 'Earlier work'],
  ['electrical-switchboard.jpg', 'Switchboard fit-off', 'A new switchboard wired for a commercial fit-out.', 'electrical', 'Earlier work'],
  ['split-mitsubishi-stacked.jpg', 'Stacked outdoor units', 'Mitsubishi Electric units on wall brackets to save space.', 'split', 'Earlier work'],
  ['commercial-diffuser.jpg', 'Office ducted fit-out', 'Ceiling diffusers going in on a commercial fit-out.', 'commercial', 'Earlier work'],
  ['split-dome-studio.jpg', 'A dome studio in the forest', 'Something a bit different: air conditioning for a photography studio.', 'split', 'Earlier work'],
  ['ducted-samsung-outdoor.jpg', 'Twin ducted outdoor units', 'A matching pair of Samsung units on a new build.', 'ducted', 'Earlier work'],
  ['commercial-headspace.jpg', 'Commercial handover', 'Fit-out finished and handed over.', 'commercial', 'Earlier work'],
  ['maintenance-condensate.jpg', 'Why servicing matters', 'A blocked condensate line. Left alone, it grows algae and mould.', 'maintenance', 'Earlier work']
];
const CATS = { ducted: 'Ducted', split: 'Split systems', commercial: 'Commercial', electrical: 'Electrical', maintenance: 'Maintenance' };

/* ===== analytics (Google Tag Manager) ===== */
window.dataLayer = window.dataLayer || [];
const track = (event, data = {}) => window.dataLayer.push({ event, location: LOCK, ...data });
if (SITE.gtm) {
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + SITE.gtm; document.head.appendChild(g);
}

/* ===== icons ===== */
const IC = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  g: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22zM6.4 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2zM12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6z"/></svg>'
};

/* ===== header, footer, mobile bar ===== */
const page = document.body.dataset.page || '';
const NAV = [['air-conditioning.html', 'Air Con', 'ac'], ['electrical.html', 'Electrical', 'electrical'], ['solar.html', 'Solar', 'solar'], ['work.html', 'Our Work', 'work'], ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']];
const brandHTML = `<a class="brand" href="${u('index.html')}" aria-label="${SITE.name} home"><img src="${u('images/logo-mark.png')}" alt="" width="46" height="46"><span><b>COASTAL</b><small>AIR &amp; ELECTRICAL</small></span></a>`;
const locSwitch = `<div class="loc-switch" role="group" aria-label="Choose your location">${Object.entries(LOCATIONS).map(([k, L]) => `<a href="${locHref(k)}"${k === LOCK ? ' class="on" aria-current="true"' : ''}>${L.name}</a>`).join('')}</div>`;
const hd = $('#header');
if (hd) hd.outerHTML = `<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav"><div class="nav-in">
  ${brandHTML}
  <nav class="links" aria-label="Main">
    ${NAV.map(n => `<a href="${u(n[0])}"${n[2] === page ? ' class="on" aria-current="page"' : ''}>${n[1]}</a>`).join('')}
    <div class="m-cta">${locSwitch}<a class="btn btn-sun" data-book></a><a class="btn btn-ghost" data-call></a></div>
  </nav>
  <div class="nav-cta">${locSwitch}<a class="nav-tel" href="tel:${LOC.tel}">${IC.phone}${LOC.phone}</a><a class="btn btn-sun btn-sm" data-book>Make an enquiry</a>
    <button class="burger" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button></div>
</div></header>`;

const ft = $('#footer');
if (ft) ft.outerHTML = `<footer class="foot"><div class="foot-grid">
  <div>${brandHTML}<p>Licensed air conditioning, electrical and solar specialists with local teams in Seaford and Middleton.</p>
    ${SITE.licence ? `<p>Electrical licence ${esc(SITE.licence)}</p>` : ''}${SITE.arctick ? `<p>ARCtick ${esc(SITE.arctick)}</p>` : ''}
    <div class="soc"><a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${IC.fb}</a><a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${IC.ig}</a><a href="${SITE.googleProfile}" target="_blank" rel="noopener" aria-label="Google reviews">${IC.g}</a></div></div>
  <div><h4>Services</h4><a href="${u('air-conditioning.html')}">Air conditioning</a><a href="${u('air-conditioning.html#split')}">Split systems</a><a href="${u('air-conditioning.html#ducted')}">Ducted systems</a><a href="${u('air-conditioning.html#maintenance')}">AC maintenance</a><a href="${u('electrical.html')}">Electrical</a><a href="${u('solar.html')}">Solar</a></div>
  <div><h4>Locations</h4>${Object.entries(LOCATIONS).map(([k, L]) => `<a href="${locHref(k)}">${L.name} · ${L.region}</a>`).join('')}
    <h4 style="margin-top:22px">Company</h4><a href="${u('work.html')}">Our work</a><a href="${u('about.html')}">About us</a><a href="${u('reviews.html')}">Reviews</a><a href="${u('contact.html')}">Contact</a></div>
  <div><h4>Get in touch</h4><a href="tel:${LOC.tel}">${LOC.phone}</a>${SITE.email ? `<a href="mailto:${SITE.email}">${SITE.email}</a>` : ''}<a data-book>Make an enquiry</a><ul class="hours-list" data-hours></ul><p style="margin-top:10px">24/7 for electrical emergencies</p></div>
</div>
<div class="foot-bot"><span>&copy; ${new Date().getFullYear()} Coastal Air &amp; Electrical Pty Ltd</span><span><a href="${u('privacy.html')}">Privacy</a> &nbsp;·&nbsp; <a href="${u('terms.html')}">Terms</a></span></div></footer>
<div class="mbar"><a href="tel:${LOC.tel}">${IC.phone}Call now</a><a class="sun" data-book>${IC.cal}Enquire</a></div>`;

/* fill shared links */
const wireEnquiry = (scope = document, label = 'Make an enquiry') => $$('[data-book]', scope).forEach(a => {
  if (a.dataset.wired) return; a.dataset.wired = 1;
  a.href = SITE.enquiry; a.target = '_blank'; a.rel = 'noopener';
  if (!a.textContent.trim()) a.innerHTML = IC.cal + label;
  a.addEventListener('click', () => track('enquiry_click', { place: page }));
});
wireEnquiry();
$$('[data-call]').forEach(a => { a.href = 'tel:' + LOC.tel; if (!a.textContent.trim()) a.innerHTML = IC.phone + 'Call ' + LOC.phone; });
document.addEventListener('click', e => { const a = e.target.closest('a[href^="tel:"]'); if (a) track('phone_click', { place: page }); });
$$('[data-rating]').forEach(el => el.innerHTML = `<i class="stars">★★★★★</i> ${SITE.rating} from ${SITE.reviewCount} Google reviews`);
$$('[data-brands]').forEach(el => el.innerHTML = `<div class="track">${[...BRANDS, ...BRANDS].map(b => `<span>${b}</span>`).join('')}</div>`);

/* location cards: <div data-locations></div> */
$$('[data-locations]').forEach(el => {
  el.innerHTML = `<div class="locs">${Object.entries(LOCATIONS).map(([k, L]) => {
    const here = k === LOCK, tag = here ? 'div' : 'a', href = here ? '' : ` href="${locHref(k)}"`;
    return `<${tag} class="loc-card${here ? ' here' : ''}"${href}><span class="loc-pin">${IC.pin}</span><div><small>${L.region}</small><b>${L.name}</b><p>${L.blurb}</p><span class="more">${here ? 'You\u2019re on the ' + L.name + ' page' : 'Visit our ' + L.name + ' team \u2192'}</span></div></${tag}>`;
  }).join('')}</div>`;
});

/* ===== nav behaviour ===== */
const nav = $('#nav'), burger = $('.burger');
const onScroll = () => nav && nav.classList.toggle('solid', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
if (burger) {
  const setOpen = o => { nav.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
  burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  $$('.links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setOpen(false));
}

/* ===== opening hours + live badge (Adelaide time) ===== */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmt = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60), h12 = ((hh + 11) % 12) + 1; return h12 + (mm ? ':' + String(mm).padStart(2, '0') : '') + (hh >= 12 ? 'pm' : 'am'); };
const nowAdl = () => {
  const p = new Intl.DateTimeFormat('en-AU', { timeZone: SITE.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const g = t => (p.find(x => x.type === t) || {}).value;
  return { d: DAYS.indexOf(g('weekday')), h: +g('hour') + +g('minute') / 60 };
};
const status = () => {
  const { d, h } = nowAdl(), t = HOURS[DAYS[d]];
  if (t && h >= t[0] && h < t[1]) return { open: true, txt: `Open now · until ${fmt(t[1])}` };
  for (let i = 0; i < 8; i++) {
    const dd = (d + i) % 7, tt = HOURS[DAYS[dd]];
    if (!tt) continue;
    if (i === 0 && h < tt[0]) return { open: false, txt: `Closed · opens ${fmt(tt[0])} today` };
    if (i > 0) return { open: false, txt: `Closed · opens ${i === 1 ? 'tomorrow' : DAYS[dd]} ${fmt(tt[0])}` };
  }
  return { open: false, txt: 'Call for availability' };
};
const paintStatus = () => {
  const s = status();
  $$('[data-open]').forEach(el => { el.className = 'open-pill' + (s.open ? ' on' : ''); el.innerHTML = `<i></i>${s.txt}`; });
  const today = DAYS[nowAdl().d];
  $$('[data-hours]').forEach(ul => ul.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<li${d === today ? ' class="today"' : ''}><span>${d}</span><span>${HOURS[d] ? fmt(HOURS[d][0]) + ' – ' + fmt(HOURS[d][1]) : 'Closed'}</span></li>`).join(''));
};
paintStatus(); setInterval(paintStatus, 60000);

/* ===== thermostat dial (home hero) ===== */
const dial = $('[data-dial]');
if (dial) {
  const hero = dial.closest('.hero, .h3d'), svg = $('svg', dial), prog = $('.d-prog', dial), knob = $('.d-knob', dial);
  const out = $('.dial-temp b', dial), mode = $('.dial-temp small', dial), msg = $('.dial-msg', dial);
  const MIN = 16, MAX = 30, A0 = -135, A1 = 135;
  const pt = (a, r = 80) => { const rad = (a - 90) * Math.PI / 180; return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)]; };
  const arc = (a0, a1, r = 80) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  const mix = t => { const a = [110, 155, 209], b = [244, 148, 36]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; };
  $('.d-track', dial).setAttribute('d', arc(A0, A1));
  let temp = 22, used = false, drag = false;
  const set = (v, user) => {
    temp = Math.min(MAX, Math.max(MIN, Math.round(v * 2) / 2));
    const t = (temp - MIN) / (MAX - MIN), a = A0 + (A1 - A0) * t, col = mix(t);
    prog.setAttribute('d', arc(A0, Math.max(A0 + .5, a))); prog.style.stroke = col;
    const [kx, ky] = pt(a); knob.setAttribute('cx', kx); knob.setAttribute('cy', ky); knob.style.fill = col;
    out.textContent = (temp % 1 ? temp.toFixed(1) : temp) + '°';
    const m = temp < 21 ? ['Cooling', 'Beat the summer heat with quiet, efficient split or ducted cooling.']
      : temp <= 24 ? ['Just right', "That's the sweet spot. We size every system to hold it there, efficiently."]
      : ['Heating', 'Reverse-cycle heating keeps winter nights cosy for less.'];
    mode.textContent = m[0]; msg.textContent = m[1];
    if (hero) hero.style.setProperty('--warm', t.toFixed(3));
    dispatchEvent(new CustomEvent('ca:temp', { detail: { t, temp } }));
    dial.setAttribute('aria-valuenow', temp); dial.setAttribute('aria-valuetext', `${temp} degrees, ${m[0]}`);
    if (user && !used) { used = true; track('tool_used', { tool: 'thermostat' }); }
  };
  const fromPointer = e => {
    const r = svg.getBoundingClientRect();
    let a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90;
    if (a > 180) a -= 360;
    a = Math.max(A0, Math.min(A1, a));
    set(MIN + (a - A0) / (A1 - A0) * (MAX - MIN), true);
  };
  svg.addEventListener('pointerdown', e => { drag = true; svg.setPointerCapture(e.pointerId); fromPointer(e); });
  svg.addEventListener('pointermove', e => drag && fromPointer(e));
  svg.addEventListener('pointerup', () => drag = false);
  svg.addEventListener('pointercancel', () => drag = false);
  dial.addEventListener('keydown', e => { const k = { ArrowUp: .5, ArrowRight: .5, ArrowDown: -.5, ArrowLeft: -.5 }[e.key]; if (k) { e.preventDefault(); set(temp + k, true); } });
  $$('[data-step]', dial).forEach(b => b.addEventListener('click', () => set(temp + +b.dataset.step, true)));
  if (reduce) set(22);
  else { const t0 = performance.now(); (function intro(t) { const p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3); set(28 - 6 * e); if (p < 1) requestAnimationFrame(intro); })(t0); }
}

/* ===== split or ducted finder ===== */
const FINDER = [
  { q: 'What do you want to heat and cool?', k: 'area', o: [['One room', 'one'], ['2–3 rooms', 'few'], ['The whole home', 'whole']] },
  { q: 'What type of property is it?', k: 'type', o: [['Apartment or unit', 'apt'], ['Single-storey home', 'single'], ['Two-storey home', 'double'], ['Business or commercial', 'biz']] },
  { q: 'How much ceiling or roof space is there?', k: 'roof', o: [['Plenty of roof space', 'yes'], ['Tight or limited', 'tight'], ["I'm not sure", 'unsure']] },
  { q: 'What matters most to you?', k: 'want', o: [['Lowest upfront cost', 'cost'], ['Hidden and quiet', 'hidden'], ['Control room by room', 'zones']] }
];
const RESULTS = {
  split: { t: 'A split system', img: 'images/split-mhi-row.jpg', p: 'Affordable, energy-efficient heating and cooling for single rooms or open spaces, with reliable performance year-round.', pts: ['Lowest upfront cost', 'Fast install, often in a day', 'Great for bedrooms and living areas'] },
  multi: { t: 'Multiple split systems', img: 'images/split-panasonic-apartment.jpg', p: 'Separate indoor units for each room you use most, so you only heat or cool the spaces you need.', pts: ['Room-by-room control', 'Ideal when roof space is limited', 'Add more rooms later'] },
  ducted: { t: 'Ducted air conditioning', img: 'images/ducted-copper-grilles.jpg', p: 'Whole-home comfort from discreet ceiling vents, with zoning so you can choose which rooms to heat or cool.', pts: ['Hidden, quiet and tidy', 'Zoning to control running costs', 'Adds value to your home'] },
  biz: { t: 'A commercial system', img: 'images/commercial-75kw-handover.jpg', p: "From shops and offices to large warehouses. We've delivered commercial ducted systems up to 75kW. Let's talk through your site.", pts: ['Designed around your building', 'Ducted, split or multi-unit', 'Ongoing maintenance available'] }
};
$$('[data-finder]').forEach(el => {
  let step = 0; const ans = {};
  const pick = () => {
    if (ans.type === 'biz') return 'biz';
    const s = { split: 0, multi: 0, ducted: 0 };
    ({ one: () => s.split += 4, few: () => { s.multi += 3; s.ducted += 1; }, whole: () => { s.ducted += 4; s.multi += 1; } })[ans.area]?.();
    ({ apt: () => { s.split += 2; s.multi += 2; s.ducted -= 1; }, single: () => s.ducted += 1, double: () => { s.ducted += 1; s.multi += 1; } })[ans.type]?.();
    ({ yes: () => s.ducted += 2, tight: () => { s.multi += 2; s.split += 1; }, unsure: () => {} })[ans.roof]?.();
    ({ cost: () => { s.split += 3; s.multi += 1; }, hidden: () => s.ducted += 3, zones: () => { s.multi += 2; s.ducted += 1; } })[ans.want]?.();
    return Object.entries(s).sort((a, b) => b[1] - a[1])[0][0];
  };
  const render = () => {
    if (step >= FINDER.length) {
      const key = pick(), r = RESULTS[key];
      const tight = key === 'ducted' && ans.roof === 'tight' ? '<p><b>Tight ceiling?</b> It can still be done. We recently fitted a 12kW ducted system into a West Lakes home with almost no ceiling space.</p>' : '';
      el.innerHTML = `<div class="result"><div class="result-img"><img src="${u(r.img)}" alt="" loading="lazy"></div><div>
        <span class="eyebrow">Our suggestion</span><h3>${r.t}</h3><p>${r.p}</p>${tight}<ul>${r.pts.map(x => `<li>${x}</li>`).join('')}</ul>
        <div class="btns"><a class="btn btn-sun" data-book></a><a class="btn ${el.closest('.ink') ? 'btn-ghost' : 'btn-line'}" href="tel:${LOC.tel}">${IC.phone}Talk it through</a></div>
        <p class="note">A starting point only. We confirm the right system after a free look at your home.</p>
        <button class="link-btn" data-restart type="button">Start again</button></div></div>`;
      wireEnquiry(el);
      $('[data-restart]', el).addEventListener('click', () => { step = 0; Object.keys(ans).forEach(k => delete ans[k]); render(); });
      track('tool_used', { tool: 'finder', result: key });
      return;
    }
    const f = FINDER[step];
    el.innerHTML = `<div class="tool-top"><span>Question ${step + 1} of ${FINDER.length}</span><div class="prog-bar"><i style="width:${(step / FINDER.length) * 100}%"></i></div></div>
      <p class="q">${f.q}</p><div class="opts">${f.o.map(([l, v]) => `<button type="button" class="opt${ans[f.k] === v ? ' on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>
      <div class="tool-nav">${step ? '<button class="link-btn" data-back type="button">← Back</button>' : '<span></span>'}</div>`;
    $$('.opt', el).forEach(b => b.addEventListener('click', () => { ans[f.k] = b.dataset.v; if (f.k === 'type' && b.dataset.v === 'biz') step = FINDER.length; else step++; render(); }));
    const back = $('[data-back]', el); if (back) back.addEventListener('click', () => { step--; render(); });
  };
  render();
});

/* ===== shared helpers for calculators ===== */
const segGroup = (name, opts, def) => `<div class="seg" data-seg="${name}">${opts.map(([l, v]) => `<button type="button" data-v="${v}"${v === def ? ' class="on"' : ''}>${l}</button>`).join('')}</div>`;
const wireSegs = (el, onChange) => $$('.seg', el).forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', g).forEach(x => x.classList.toggle('on', x === b)); onChange(); }));
const segVal = (el, name) => $(`[data-seg="${name}"] .on`, el).dataset.v;
const fillRange = r => r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');

/* ===== room size → kW guide ===== */
$$('[data-kw]').forEach(el => {
  el.innerHTML = `<div class="calc"><div>
    <label class="field"><span>Room length</span><div class="range-row"><input type="range" min="2" max="14" step="0.5" value="5" data-l><output data-lo></output></div></label>
    <label class="field"><span>Room width</span><div class="range-row"><input type="range" min="2" max="12" step="0.5" value="4" data-w><output data-wo></output></div></label>
    <div class="field"><span>Type of room</span>${segGroup('room', [['Bedroom', 'bed'], ['Living room', 'live'], ['Open plan with kitchen', 'open']], 'live')}</div>
    <div class="field"><span>Ceiling</span>${segGroup('ceil', [['Standard', 'std'], ['High (over 2.7m)', 'high'], ['Raked or vaulted', 'raked']], 'std')}</div>
    <div class="field"><span>Afternoon sun</span>${segGroup('sun', [['Shaded', 'shade'], ['Some', 'some'], ['Lots (west facing)', 'lots']], 'some')}</div>
    <div class="field"><span>Insulation</span>${segGroup('ins', [['Good', 'good'], ['Average', 'avg'], ['Poor or unsure', 'poor']], 'avg')}</div>
  </div>
  <div class="out" aria-live="polite"><p>Suggested split system size</p><span class="big" data-kwo>–</span><div class="gauge"><i data-g></i></div><p data-area-txt></p><p data-kwmsg></p>
    <div class="btns"><a class="btn btn-sun" data-book></a></div><p class="note">A rough guide only. We confirm sizing on site, because orientation, windows and layout all matter.</p></div></div>`;
  const L = $('[data-l]', el), W = $('[data-w]', el), SIZES = [2.5, 3.5, 5.0, 6.0, 7.1, 8.0, 9.0];
  const BASE = { bed: 110, live: 125, open: 140 }, CEIL = { std: 1, high: 1.15, raked: 1.25 }, SUN = { shade: .95, some: 1, lots: 1.15 }, INS = { good: .92, avg: 1, poor: 1.12 };
  let used = false;
  const calc = user => {
    [L, W].forEach(fillRange);
    $('[data-lo]', el).textContent = (+L.value).toFixed(1) + ' m'; $('[data-wo]', el).textContent = (+W.value).toFixed(1) + ' m';
    const area = L.value * W.value;
    const kw = area * BASE[segVal(el, 'room')] * CEIL[segVal(el, 'ceil')] * SUN[segVal(el, 'sun')] * INS[segVal(el, 'ins')] / 1000;
    const size = SIZES.find(s => s >= kw);
    $('[data-area-txt]', el).textContent = `${Math.round(area)} m² room · about ${kw.toFixed(1)} kW of cooling needed`;
    $('[data-kwo]', el).textContent = size ? size.toFixed(1) + ' kW' : '9 kW +';
    $('[data-g]', el).style.width = Math.min(100, kw / 9.5 * 100) + '%';
    $('[data-kwmsg]', el).textContent = size ? 'A single split system should handle this room.' : 'A big space. Ducted or more than one split system is likely the better fit.';
    if (user && !used) { used = true; track('tool_used', { tool: 'kw_calculator' }); }
  };
  [L, W].forEach(r => r.addEventListener('input', () => calc(true)));
  wireSegs(el, () => calc(true)); calc();
  wireEnquiry(el);
});

/* ===== solar savings estimator =====
   Rough South Australian assumptions. TODO: check current numbers with the client */
const SOLAR = { tariff: 0.42, feedIn: 0.04, yieldPerKw: 4.3, sizes: [6.6, 8, 10, 13.2] };
$$('[data-solar]').forEach(el => {
  el.innerHTML = `<div class="calc"><div>
    <label class="field"><span>Your average quarterly power bill</span><div class="range-row"><input type="range" min="150" max="1500" step="10" value="500" data-bill><output data-billo></output></div></label>
    <div class="field"><span>When is the home used most?</span>${segGroup('day', [['Someone home most days', 'home'], ['A mix', 'mix'], ['Mostly empty during the day', 'away']], 'mix')}<small>Solar saves the most when you use power while the sun is up.</small></div>
    <div class="field"><span>Running air conditioning?</span>${segGroup('ac', [['Yes, a lot', 'lots'], ['Sometimes', 'some'], ['Rarely', 'rare']], 'some')}<small>Running your aircon on sunshine during the day boosts savings.</small></div>
  </div>
  <div class="out" aria-live="polite"><p>Estimated yearly saving</p><span class="big" data-sav>–</span><p data-sys></p><div class="gauge"><i data-g></i></div><p data-pct></p>
    <div class="btns"><a class="btn btn-sun" data-book></a></div>
    <p class="note">Rough estimate using ${Math.round(SOLAR.tariff * 100)}c/kWh power, ${Math.round(SOLAR.feedIn * 100)}c/kWh feed-in and typical South Australian sunshine. Not a quote. Your actual savings depend on your tariff, roof and usage.</p></div></div>`;
  const bill = $('[data-bill]', el); let used = false;
  const calc = user => {
    fillRange(bill); $('[data-billo]', el).textContent = '$' + bill.value;
    const usage = bill.value * 4 / SOLAR.tariff;
    const selfShare = { home: .55, mix: .42, away: .3 }[segVal(el, 'day')] + { lots: .08, some: .04, rare: 0 }[segVal(el, 'ac')];
    const need = usage / (SOLAR.yieldPerKw * 365) * .9;
    const size = SOLAR.sizes.find(s => s >= need) || SOLAR.sizes[SOLAR.sizes.length - 1];
    const gen = size * SOLAR.yieldPerKw * 365, selfUsed = Math.min(gen * selfShare, usage * .8), exported = gen - selfUsed;
    const saving = Math.min(selfUsed * SOLAR.tariff + exported * SOLAR.feedIn, bill.value * 4 * .9);
    const pct = Math.round(saving / (bill.value * 4) * 100);
    $('[data-sav]', el).textContent = '$' + (Math.round(saving / 10) * 10).toLocaleString('en-AU');
    $('[data-sys]', el).textContent = `Based on a ${size}kW system`;
    $('[data-pct]', el).textContent = `About ${pct}% of your yearly power bill`;
    $('[data-g]', el).style.width = pct + '%';
    if (user && !used) { used = true; track('tool_used', { tool: 'solar_estimator' }); }
  };
  bill.addEventListener('input', () => calc(true)); wireSegs(el, () => calc(true)); calc();
  wireEnquiry(el);
});

/* ===== emergency checker ===== */
const EMERG = [
  ['Smoke, sparks or a burning smell', 'crit'], ['Someone has had an electric shock', 'shock'], ['Exposed or damaged wires', 'urgent'],
  ['No power, but neighbours have power', 'urgent'], ['No power in the whole street', 'grid'], ['Safety switch keeps tripping', 'urgent'],
  ['Flickering lights or a faulty power point', 'std'], ['Air conditioner not working or leaking', 'std']
];
$$('[data-emergency]').forEach(el => {
  el.innerHTML = `<p class="q">What's happening?</p><div class="em-opts">${EMERG.map(([l], i) => `<button type="button" class="opt" data-i="${i}">${l}</button>`).join('')}</div><div aria-live="polite" data-out></div>`;
  const out = $('[data-out]', el);
  const call = `<a class="btn btn-sun" href="tel:${LOC.tel}">${IC.phone}Call ${LOC.phone} now</a>`;
  const R = {
    crit: ['crit', 'If there is fire, call 000 now.', 'Get everyone away from the area. Only if it is safe, turn off power at the main switch. Once everyone is safe, call us for an urgent electrician.', `<a class="btn btn-sun" href="tel:000">Call 000</a>${call}`],
    shock: ['crit', 'Call 000 for medical help first.', 'Do not touch the person if they are still in contact with the power source. Turn off power at the main switch if it is safe. Then call us to make the installation safe.', `<a class="btn btn-sun" href="tel:000">Call 000</a>${call}`],
    urgent: ['urgent', 'This needs an electrician urgently.', 'Keep people and pets away, and do not touch anything exposed. We are available 24/7 for electrical emergencies.', call],
    grid: ['urgent', 'This is likely a network outage.', 'If the whole street is out, contact SA Power Networks on 13 13 66. If only your home is affected, call us.', `<a class="btn btn-ghost" href="tel:131366">Call SA Power Networks</a>${call}`],
    std: ['std', "Not an emergency, but let's fix it.", 'Make an enquiry online or give us a call, and we will get it sorted quickly.', `<a class="btn btn-sun" data-book></a><a class="btn btn-ghost" href="tel:${LOC.tel}">${IC.phone}Call us</a>`]
  };
  $$('.opt', el).forEach(b => b.addEventListener('click', () => {
    $$('.opt', el).forEach(x => x.classList.toggle('on', x === b));
    const r = R[EMERG[b.dataset.i][1]];
    out.innerHTML = `<div class="em-res ${r[0]}"><h3>${r[1]}</h3><p>${r[2]}</p><div class="btns">${r[3]}</div></div>`;
    wireEnquiry(out);
    track('tool_used', { tool: 'emergency_checker', answer: EMERG[b.dataset.i][1] });
  }));
});

/* ===== area checker (knows both locations) =====
   <div data-area></div>  ·  add data-list to show the suburb list  ·  data-loc="middleton" to list that location's suburbs */
const matchLoc = v => {
  const low = v.toLowerCase(), n = +(v.match(/\b5\d{3}\b/) || [0])[0];
  for (const [k, L] of Object.entries(LOCATIONS)) {
    const sub = L.suburbs.find(s => s.toLowerCase() === low) || (v.length > 2 && L.suburbs.find(s => s.toLowerCase().startsWith(low)));
    if (sub) return { k, L, place: sub, n };
  }
  if (n) for (const [k, L] of Object.entries(LOCATIONS)) if (L.postcodes(n)) return { k, L, place: v, n };
  return { n };
};
$$('[data-area]').forEach(el => {
  const listLoc = LOCATIONS[el.dataset.loc] || LOC;
  const allSubs = Object.values(LOCATIONS).flatMap(L => L.suburbs);
  const id = 'subs-' + Math.random().toString(36).slice(2, 7);
  el.innerHTML = `<form class="area-form" novalidate><input name="where" list="${id}" placeholder="Your suburb or postcode" aria-label="Your suburb or postcode" autocomplete="postal-code"><button class="btn btn-ink" type="submit">Check</button></form>
    <datalist id="${id}">${allSubs.map(s => `<option value="${s}">`).join('')}</datalist><div class="area-res" aria-live="polite"></div>
    ${el.hasAttribute('data-list') ? `<div class="sub-list">${listLoc.suburbs.map(s => `<span>${s}</span>`).join('')}</div>` : ''}`;
  const input = $('input', el), res = $('.area-res', el);
  const check = final => {
    const v = input.value.trim(); if (!v) { res.innerHTML = ''; return; }
    const m = matchLoc(v);
    if (m.L) {
      const other = m.k !== LOCK;
      res.innerHTML = `<div class="res ok"><span><b>Yes, our ${m.L.name} team covers ${esc(m.place)}.</b> ${other ? 'Visit their page or make an enquiry.' : 'Make an enquiry or give us a call.'}</span>
        ${other ? `<a class="btn btn-ink btn-sm" href="${locHref(m.k)}">${m.L.name} page</a>` : ''}<a class="btn btn-sun btn-sm" data-book>Make an enquiry</a></div>`;
      wireEnquiry(res);
      if (final) track('area_check', { result: 'yes', team: m.k });
    } else if (final || v.length > 3) {
      res.innerHTML = `<div class="res maybe"><span><b>${POSTCODE_MAYBE(m.n) ? 'Most likely.' : "It's not on our usual list."}</b> We often travel further. Call us to check.</span><a class="btn btn-ink btn-sm" href="tel:${LOC.tel}">Call ${LOC.phone}</a></div>`;
      if (final) track('area_check', { result: 'maybe' });
    } else res.innerHTML = '';
  };
  input.addEventListener('input', () => check(false));
  $('form', el).addEventListener('submit', e => { e.preventDefault(); check(true); });
});

/* ===== reviews ===== */
$$('[data-reviews]').forEach(el => {
  const list = REVIEWS.slice(0, +el.dataset.limit || 99);
  el.innerHTML = `<div class="rv"><div class="rv-score"><span class="eyebrow">Google reviews</span><b>${SITE.rating}</b><i class="stars">★★★★★</i><p>from ${SITE.reviewCount} reviews by local customers</p>
    <div class="btns"><a class="btn btn-sun" href="${SITE.googleProfile}" target="_blank" rel="noopener">Read our reviews</a><a class="btn btn-ghost" href="${SITE.reviewLink}" target="_blank" rel="noopener" data-track-review>Leave a review</a></div></div>
    ${list.length ? `<div class="rv-list">${list.map(r => `<blockquote class="rv-card"><i class="stars">★★★★★</i><p>${esc(r.text)}</p><cite>${esc(r.name)}${r.when ? ' · ' + esc(r.when) : ''}</cite></blockquote>`).join('')}</div>`
      : `<div class="rv-alt"><div class="rv-card"><b>5/5</b><p>Also rated 5 out of 5 on Facebook.</p></div><div class="rv-card"><b>${SITE.years}+ years</b><p>Of air conditioning and electrical experience, from homes to 75kW commercial systems.</p></div></div>`}</div>`;
  $$('[data-track-review]', el).forEach(a => a.addEventListener('click', () => track('review_click')));
});

/* ===== gallery + lightbox ===== */
let lbItems = [], lbIndex = 0;
const lb = document.createElement('div');
lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
lb.innerHTML = '<img alt=""><div class="lb-cap"></div><button class="lb-btn lb-x" aria-label="Close">×</button><button class="lb-btn lb-prev" aria-label="Previous">‹</button><button class="lb-btn lb-next" aria-label="Next">›</button>';
document.body.appendChild(lb);
const lbShow = i => { lbIndex = (i + lbItems.length) % lbItems.length; const p = lbItems[lbIndex]; $('img', lb).src = u('images/' + p[0]); $('img', lb).alt = p[1]; $('.lb-cap', lb).innerHTML = `<b>${esc(p[1])}</b>${esc(p[2])}`; };
const lbClose = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
$('.lb-x', lb).onclick = lbClose; $('.lb-prev', lb).onclick = () => lbShow(lbIndex - 1); $('.lb-next', lb).onclick = () => lbShow(lbIndex + 1);
lb.addEventListener('click', e => e.target === lb && lbClose());
addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbIndex - 1); if (e.key === 'ArrowRight') lbShow(lbIndex + 1); });
let sx = 0; lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1)); });

$$('[data-gallery]').forEach(el => {
  const cats = el.dataset.cat ? el.dataset.cat.split(',') : null, era = el.dataset.era, lim = +el.dataset.limit || 99;
  const list = PROJECTS.filter(p => (!cats || cats.includes(p[3])) && (!era || p[4] === era)).slice(0, lim);
  const used = [...new Set(list.map(p => p[3]))];
  const filters = el.hasAttribute('data-filters') ? `<div class="filters" role="group" aria-label="Filter projects"><button type="button" class="chip on" data-f="">All</button>${used.map(c => `<button type="button" class="chip" data-f="${c}">${CATS[c]}</button>`).join('')}</div>` : '';
  el.innerHTML = filters + `<div class="gallery">${list.map((p, i) => `<button type="button" class="g-item" data-i="${i}" data-c="${p[3]}"><figure><img src="${u('images/' + p[0])}" alt="${esc(p[1])}" loading="lazy"><span class="era${p[4] === 'Adelaide' ? ' adl' : ''}">${p[4]}</span><figcaption><b>${esc(p[1])}</b><span>${esc(p[2])}</span></figcaption></figure></button>`).join('')}</div>`;
  $$('.g-item', el).forEach(b => b.addEventListener('click', () => {
    lbItems = $$('.g-item:not([hidden])', el).map(x => list[+x.dataset.i]);
    lbShow(lbItems.indexOf(list[+b.dataset.i])); lb.classList.add('on'); document.body.style.overflow = 'hidden';
  }));
  $$('[data-f]', el).forEach(c => c.addEventListener('click', () => {
    $$('[data-f]', el).forEach(x => x.classList.toggle('on', x === c));
    $$('.g-item', el).forEach(g => g.hidden = !!c.dataset.f && g.dataset.c !== c.dataset.f);
  }));
});

/* ===== contact form ===== */
$$('form[data-form]').forEach(f => {
  const err = $('.err', f);
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (f.company && f.company.value) return;
    let ok = true;
    $$('[required]', f).forEach(i => { const bad = !i.value.trim(); i.classList.toggle('bad', bad); if (bad) ok = false; });
    err.textContent = ok ? '' : 'Please fill in the highlighted fields.';
    if (!ok) { $('.bad', f).focus(); return; }
    const data = new FormData(f); data.delete('company'); data.append('page', location.pathname); data.append('team', LOC.name);
    const btn = $('button[type=submit]', f), txt = btn.innerHTML; btn.disabled = true; btn.textContent = 'Sending…';
    try {
      if (FORM_ENDPOINT) {
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(r.status);
      } else {
        const body = `Website enquiry (${LOC.name})\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nSuburb: ${data.get('suburb')}\nService: ${data.get('service')}\n${data.get('message') || ''}`;
        location.href = `sms:${LOC.tel}?&body=${encodeURIComponent(body)}`;
      }
      f.classList.add('sent'); track('form_submit', { form: f.dataset.form });
    } catch (x) { err.textContent = `Sorry, that didn't send. Please call ${LOC.phone}.`; }
    finally { btn.disabled = false; btn.innerHTML = txt; }
  });
});

/* ===== reveal on scroll ===== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((el, i) => { el.style.setProperty('--d', (i % 3) * .08 + 's'); io.observe(el); });
})();