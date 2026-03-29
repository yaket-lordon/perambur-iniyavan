// ══════════════════════════════════════════════
// PERAMBUR INIYAVAN — PREMIUM SCRIPT
// ══════════════════════════════════════════════

// EmailJS — replace with your key
if (typeof emailjs !== 'undefined') emailjs.init("plsCNnc_9BBYQz5fu");

// ── CUSTOM CURSOR ──────────────────────────────
const dot  = document.getElementById('cDot');
const ring = document.getElementById('cRing');
if (dot && ring) {
  let rx = 0, ry = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();
}

// ── LOADER ─────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('out'), 1200);
});

// ── NAVBAR ─────────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
  highlightNav();
});

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  links.forEach(a => { a.style.color = a.getAttribute('href') === `#${cur}` ? 'var(--gold)' : ''; });
}

// ── MOBILE NAV ─────────────────────────────────
function openMnav() { document.getElementById('mnav')?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMnav() { document.getElementById('mnav')?.classList.remove('open'); document.body.style.overflow = ''; }

// ── HERO SLIDESHOW ─────────────────────────────
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsEl = document.getElementById('heroDots');
  if (!slides.length) return;
  let cur = 0;
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'h-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => go(i));
    dotsEl?.appendChild(d);
  });
  function go(n) {
    slides[cur].classList.remove('active');
    document.querySelectorAll('.h-dot')[cur]?.classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    document.querySelectorAll('.h-dot')[cur]?.classList.add('active');
  }
  setInterval(() => go((cur + 1) % slides.length), 5500);
})();

// ── SCROLL REVEAL ──────────────────────────────
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.classList.contains('counter')) runCounter(e.target);
    revObs.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.rv, .counter').forEach(el => revObs.observe(el));

// ── COUNTER ─────────────────────────────────────
function runCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || 0);
  const suffix   = el.dataset.suffix || '';
  const step     = 16;
  const inc      = target / (2000 / step);
  let val = 0;
  const t = setInterval(() => {
    val += inc;
    if (val >= target) { val = target; clearInterval(t); }
    el.textContent = val.toFixed(decimals) + suffix;
  }, step);
}

// ── SERVICES SLIDER ────────────────────────────
const svcTrack = document.getElementById('svcTrack');
let svcIdx = 0;
function getVis() { return window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1; }
function svcSlide(dir) {
  if (!svcTrack?.children.length) return;
  const max = svcTrack.children.length - getVis();
  svcIdx = Math.max(0, Math.min(svcIdx + dir, max));
  const w = svcTrack.children[0].offsetWidth + 22;
  svcTrack.style.transform = `translateX(-${svcIdx * w}px)`;
}
window.addEventListener('resize', () => { svcIdx = 0; svcTrack && (svcTrack.style.transform = 'translateX(0)'); });

// ── LIGHTBOX (home) ────────────────────────────
function openLb(src, label) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() { document.getElementById('lb')?.classList.remove('open'); document.body.style.overflow = ''; }

// ── QUOTE POPUP ────────────────────────────────
function openQuote() { document.getElementById('quotePopup')?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeQuote() { document.getElementById('quotePopup')?.classList.remove('open'); document.body.style.overflow = ''; }

// Food toggle
document.getElementById('foodChk')?.addEventListener('change', function() {
  document.getElementById('foodBox')?.classList.toggle('show', this.checked);
});

// ── FORM SUBMIT ────────────────────────────────
function submitQuote(e) {
  e.preventDefault();
  const btn  = document.getElementById('fSubmit');
  const form = document.getElementById('quoteForm');
  const services  = [...form.querySelectorAll('input[name="services"]:checked')].map(c => c.value).join(', ') || 'Not specified';
  const foodTimes = [...form.querySelectorAll('input[name="foodTime"]:checked')].map(c => c.value).join(', ') || 'N/A';
  const params = {
    firstName: form.firstName.value, lastName: form.lastName.value,
    email: form.email.value, phone: form.phone.value,
    events: form.eventType.value, date: form.date.value,
    location: form.location.value, guests: form.guests.value,
    budget: form.budget.value || 'Not specified',
    services, foodTimes, comments: form.comments.value || 'None'
  };
  btn.querySelector('span').textContent = 'Sending…';
  btn.disabled = true;
  const done = () => { btn.querySelector('span').textContent = 'Submit Enquiry'; btn.disabled = false; };
  const show = () => {
    closeQuote(); form.reset();
    document.getElementById('foodBox')?.classList.remove('show');
    document.getElementById('successPopup')?.classList.add('open');
    const msg = `New Enquiry ✦\n\nName: ${params.firstName} ${params.lastName}\nEmail: ${params.email}\nPhone: ${params.phone}\nEvent: ${params.events}\nDate: ${params.date}\nLocation: ${params.location}\nGuests: ${params.guests}\nBudget: ${params.budget}\nServices: ${params.services}\nFood Timing: ${params.foodTimes}\nComments: ${params.comments}`;
    window.open(`https://wa.me/917010671647?text=${encodeURIComponent(msg)}`, '_blank');
  };
  if (typeof emailjs !== 'undefined') {
    emailjs.send('service_mtkzezs', 'template_ry0zv3h', params).then(show).catch(show).finally(done);
  } else { show(); done(); }
}
function closeSuc() { document.getElementById('successPopup')?.classList.remove('open'); document.body.style.overflow = ''; }

// ── SERVICE POPUP ──────────────────────────────
const SVC_DATA = {
  catering: { title:'Catering Services', desc:'Our catering team delivers exceptional culinary experiences tailored to your event, from intimate dinners to grand weddings.', features:['Veg & Non-Veg menus','Custom menu planning','Experienced chefs','Live cooking stations','Hygienic food preparation','All cuisines available'] },
  stage:    { title:'Stage Decorations', desc:'Breathtaking stage setups that become the visual centrepiece, blending tradition with modern elegance.', features:['Floral backdrops','LED & lighting setups','Custom themes','Mandap decorations','Traditional & modern designs','Photo-ready setups'] },
  hall:     { title:'Hall Decorations', desc:'From entrance to exit, every corner of your venue is transformed into a stunning, cohesive visual experience.', features:['Full hall theming','Table & chair setups','Floral centrepieces','Entrance arch & draping','Balloon & ribbon décor','Outdoor setups available'] },
  snacks:   { title:'Snacks & Dining', desc:'Thoughtfully arranged dining halls with diverse snack counters to keep your guests delighted all event long.', features:['Snack counters & buffet','Chat & live stall options','Hygienic serving utensils','Dedicated serving staff','Elegant table settings','Custom display boards'] },
  food:     { title:'Veg & Non-Veg Foods', desc:'A wide, authentic variety of traditional and contemporary dishes, crafted fresh for every meal of the day.', features:['Breakfast, Lunch & Dinner','South Indian specialties','North Indian options','Live counters available','Dietary-specific menus','Sweets & desserts included'] }
};
function openService(key) {
  const d = SVC_DATA[key];
  document.getElementById('svcTitle').textContent = d.title;
  document.getElementById('svcDesc').textContent  = d.desc;
  document.getElementById('svcFeats').innerHTML   = d.features.map(f => `<li>${f}</li>`).join('');
  document.getElementById('svcPopup')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSvc() { document.getElementById('svcPopup')?.classList.remove('open'); document.body.style.overflow = ''; }

// ── CLOSE ON OVERLAY CLICK + ESC ──────────────
document.querySelectorAll('.popup-bg').forEach(bg => {
  bg.addEventListener('click', e => { if (e.target === bg) { bg.classList.remove('open'); document.body.style.overflow = ''; } });
});
document.getElementById('lb')?.addEventListener('click', closeLb);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['.popup-bg', '.lb', '.vid-pop'].forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.remove('open')));
    document.body.style.overflow = '';
  }
});

// ── GALLERY PAGE ───────────────────────────────
(function galPage() {
  const grid = document.getElementById('galGrid');
  if (!grid) return;
  let items = [], lbIdx = 0;
  function reindex() { items = [...grid.querySelectorAll('.gal-it:not(.hide)[data-type="image"]')];
    
   }
  reindex();
  grid.querySelectorAll('.gal-it').forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.type === 'video') {
        openVid(item.dataset.src);
      } else {
        lbIdx = items.indexOf(item);
        document.getElementById('lbImg').src = item.querySelector('img').src;
        document.getElementById('lbCap').textContent = item.dataset.label || '';
        document.getElementById('lb').classList.add('open');
        updCnt();
        document.body.style.overflow = 'hidden';
      }
    });
  });
  window.filterGal = function(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    let vis = 0;
    grid.querySelectorAll('.gal-it').forEach((it, i) => {
      const match = cat === 'all' || it.classList.contains(cat);
      it.classList.toggle('hide', !match);
      if (match) { it.style.animationDelay = (vis * 0.06) + 's'; vis++; }
    });
    document.getElementById('emptyMsg').style.display = vis === 0 ? 'block' : 'none';
    reindex();
  };
  window.lbNav = function(dir) {
    lbIdx = (lbIdx + dir + items.length) % items.length;
    const it = items[lbIdx];
    document.getElementById('lbImg').src = it.querySelector('img').src;
    document.getElementById('lbCap').textContent = it.dataset.label || '';
    updCnt();
  };
  function updCnt() { document.getElementById('lbCnt').textContent = items.length > 1 ? `${lbIdx + 1} / ${items.length}` : ''; }
})();

function openVid(src) {
  const v = document.getElementById('popVid');
  if (!v) return;
  v.src = src; v.play();
  document.getElementById('vidPop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeVid() {
  const v = document.getElementById('popVid');
  if (!v) return;
  v.pause(); v.src = '';
  document.getElementById('vidPop').classList.remove('open');
  document.body.style.overflow = '';
}
function closeLbGal() { document.getElementById('lb').classList.remove('open'); document.body.style.overflow = ''; }

// ── MENU TABS ──────────────────────────────────
document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.menu-cat').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab)?.classList.add('active');
  });
});
