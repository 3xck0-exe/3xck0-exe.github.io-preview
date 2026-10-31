/* Renders everything from content.js. You should not need to edit this file. */
(function () {
  const S = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, attrs = {}, children = []) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c) n.append(c);
    return n;
  };
  const bindAll = (key, fn) => $$(`[data-bind="${key}"]`).forEach(fn);

  /* ---------- simple text bindings ---------- */
  bindAll('name', n => { n.textContent = S.name || ''; });
  bindAll('title', n => { n.textContent = S.title || ''; });
  bindAll('location', n => { n.textContent = S.location || ''; });
  bindAll('tagline', n => { n.textContent = S.tagline || ''; });
  bindAll('brand', n => {
    const parts = (S.name || '').trim().split(/\s+/);
    n.textContent = parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : S.name || '';
  });
  document.title = `${S.name || 'Portfolio'} — ${S.title || ''}`.replace(/ — $/, '');
  $('#year').textContent = new Date().getFullYear();

  // Hero title: one word per line, last word in accent color
  const heroTitle = $('.hero-title');
  if (heroTitle) {
    heroTitle.textContent = '';
    (S.name || '').trim().split(/\s+/).forEach(w => heroTitle.append(el('span', { class: 'word', text: w })));
  }

  // Status badge
  const status = $('[data-bind="status"]');
  if (status) {
    if (S.status && S.status.show && S.status.text) $('[data-bind="status-text"]').textContent = S.status.text;
    else status.hidden = true;
  }

  // Resume + contact
  const c = S.contact || {};
  bindAll('resume-link', a => { if (c.resumeFile) a.href = c.resumeFile; else a.remove(); });
  bindAll('email', n => { n.textContent = c.email || ''; });
  bindAll('email-link', a => { a.href = `mailto:${c.email || ''}`; });
  bindAll('phone', n => { n.textContent = c.phone || ''; });
  bindAll('phone-link', a => { a.href = `tel:${(c.phone || '').replace(/[^\d+]/g, '')}`; });
  bindAll('phone-item', li => { if (!c.phone) li.hidden = true; });
  const copyBtn = $('#copy-email');
  if (copyBtn) {
    if (!c.email) copyBtn.hidden = true;
    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(c.email); copyBtn.textContent = 'Copied'; copyBtn.classList.add('copied'); }
      catch { copyBtn.textContent = 'Select the address above'; }
      setTimeout(() => { copyBtn.textContent = 'Copy email'; copyBtn.classList.remove('copied'); }, 2200);
    });
  }

  /* ---------- lists ---------- */
  const facts = $('[data-list="facts"]');
  (S.facts || []).forEach(f => facts.append(el('div', { class: 'fact' }, [
    el('div', { class: 'fact-value' }, [el('span', { text: f.value }), f.unit ? el('small', { text: f.unit }) : null]),
    el('div', { class: 'fact-label', text: f.label })
  ])));

  const aboutBox = $('[data-list="about"]');
  (S.about || []).forEach(p => aboutBox.append(el('p', { text: p })));

  const expList = $('[data-list="experience"]');
  (S.experience || []).forEach((x, i) => expList.append(el('li', { class: 'ckt' }, [
    el('div', { class: 'ckt-num', text: String(i + 1).padStart(2, '0') }),
    el('div', {}, [el('div', { class: 'ckt-role', text: x.role }), el('div', { class: 'ckt-co', text: x.company })]),
    el('div', { class: 'ckt-dates', text: x.dates }),
    x.bullets && x.bullets.length ? el('ul', { class: 'ckt-bullets', role: 'list' }, x.bullets.map(b => el('li', { text: b }))) : null
  ])));

  const eduList = $('[data-list="education"]');
  (S.education || []).forEach(e => eduList.append(el('li', {}, [
    el('div', { class: 'edu-dates', text: e.dates }),
    el('div', { class: 'edu-school', text: e.school }),
    el('div', { class: 'edu-prog', text: e.program }),
    e.note ? el('div', { class: 'edu-note', text: e.note }) : null
  ])));

  $('[data-list="certifications"]').append(...(S.certifications || []).map(t => el('li', { text: t })));
  $('[data-list="skills"]').append(...(S.skills || []).map(t => el('li', { text: t })));

  const socials = (S.socials || []).filter(s => s.url);
  const socialList = $('[data-list="socials"]');
  socials.forEach(s => socialList.append(el('li', {}, el('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, [
    el('span', { text: s.label }),
    el('span', { 'aria-hidden': 'true', text: '↗' })
  ]))));
  if (!socials.length) $('#social-empty').hidden = false;

  /* ---------- about visual: photo or legend drawing ---------- */
  const vis = $('#about-visual');
  if (S.photo) {
    vis.append(el('img', { src: S.photo, alt: `Photo of ${S.name}`, loading: 'lazy' }));
  } else {
    vis.innerHTML = `
      <div class="legend">
        <div class="legend-title"><span>Schematic legend</span><span>Sheet E-001</span></div>
        <svg viewBox="0 0 360 440" role="img" aria-label="Electrical schematic symbol legend">
          <!-- single pole switch -->
          <g class="lg-row" transform="translate(0 0)">
            <line class="lg-line" x1="20" y1="30" x2="48" y2="30"/><circle class="lg-fill" cx="50" cy="30" r="4"/>
            <line class="lg-line" x1="52" y1="28" x2="84" y2="12"/><circle class="lg-fill" cx="88" cy="30" r="4"/>
            <line class="lg-line" x1="90" y1="30" x2="120" y2="30"/>
            <text class="lg-txt" x="150" y="28">S · Single-pole</text><text class="lg-sub" x="150" y="44">Switch leg, 14/2 NM</text>
          </g>
          <!-- three way -->
          <g class="lg-row" transform="translate(0 70)">
            <line class="lg-line" x1="20" y1="30" x2="48" y2="30"/><circle class="lg-fill" cx="50" cy="30" r="4"/>
            <line class="lg-line" x1="52" y1="28" x2="84" y2="14"/><circle class="lg-fill" cx="88" cy="14" r="4"/><circle class="lg-fill" cx="88" cy="46" r="4"/>
            <line class="lg-line" x1="92" y1="14" x2="120" y2="14"/><line class="lg-line" x1="92" y1="46" x2="120" y2="46"/>
            <text class="lg-txt" x="150" y="28">S3 · Three-way</text><text class="lg-sub" x="150" y="44">Common + two travelers</text>
          </g>
          <!-- lamp -->
          <g class="lg-row" transform="translate(0 140)">
            <line class="lg-line" x1="20" y1="30" x2="50" y2="30"/>
            <circle class="lg-amber" cx="70" cy="30" r="18"/><circle class="lg-line" cx="70" cy="30" r="18" fill="none"/>
            <path class="lg-line" d="M58 18 82 42 M82 18 58 42"/>
            <line class="lg-line" x1="90" y1="30" x2="120" y2="30"/>
            <text class="lg-txt" x="150" y="28">Lighting outlet</text><text class="lg-sub" x="150" y="44">Ceiling, lampholder</text>
          </g>
          <!-- duplex receptacle -->
          <g class="lg-row" transform="translate(0 210)">
            <circle class="lg-line" cx="70" cy="30" r="16" fill="none"/>
            <line class="lg-line" x1="54" y1="22" x2="86" y2="22"/><line class="lg-line" x1="54" y1="38" x2="86" y2="38"/>
            <line class="lg-line" x1="86" y1="30" x2="120" y2="30"/>
            <text class="lg-txt" x="150" y="28">Duplex receptacle</text><text class="lg-sub" x="150" y="44">20 A, 125 V · 12 AWG</text>
          </g>
          <!-- ground -->
          <g class="lg-row" transform="translate(0 280)">
            <line class="lg-line" x1="70" y1="8" x2="70" y2="26"/>
            <line class="lg-line" x1="50" y1="26" x2="90" y2="26"/><line class="lg-line" x1="57" y1="34" x2="83" y2="34"/><line class="lg-line" x1="64" y1="42" x2="76" y2="42"/>
            <text class="lg-txt" x="150" y="28">Equipment ground</text><text class="lg-sub" x="150" y="44">Bonded at the service</text>
          </g>
          <!-- motor -->
          <g class="lg-row" transform="translate(0 350)">
            <line class="lg-line" x1="20" y1="30" x2="50" y2="30"/>
            <circle class="lg-line" cx="70" cy="30" r="20" fill="none"/>
            <text class="lg-txt" x="62" y="35" style="font-size:14px;letter-spacing:0">M</text>
            <line class="lg-line" x1="90" y1="30" x2="120" y2="30"/>
            <text class="lg-txt" x="150" y="28">Motor</text><text class="lg-sub" x="150" y="44">Sized at 125% FLC</text>
          </g>
          <!-- sheet border -->
          <rect x="4" y="2" width="352" height="430" rx="6" fill="none" stroke="currentColor" stroke-opacity=".15"/>
        </svg>
      </div>`;
  }

  /* ---------- projects + filters ---------- */
  const projects = S.projects || [];
  const grid = $('[data-list="projects"]');
  const filtersBox = $('[data-list="filters"]');
  const tagSet = [...new Set(projects.map(p => p.category).filter(Boolean))];
  const cards = [];

  projects.forEach((p, i) => {
    const cover = (p.images && p.images[0]) || '';
    const card = el('button', { class: 'project' + (p.featured ? ' featured' : ''), type: 'button', 'aria-haspopup': 'dialog', 'data-cat': p.category || '' }, [
      el('div', { class: 'project-media' }, [
        cover ? el('img', { src: cover, alt: p.title, loading: i < 3 ? 'eager' : 'lazy', decoding: 'async', width: '800', height: '600' }) : null,
        (p.galleryImages || p.images || []).length > 1
          ? el('span', {
              class: 'project-count',
              text: `${(p.galleryImages || p.images).length} photos`
            })
          : null
      ]),
      el('div', { class: 'project-body' }, [
        el('div', { class: 'project-meta', text: p.meta || '' }),
        el('h3', { class: 'project-title', text: p.title }),
        el('p', { class: 'project-summary', text: p.summary || '' }),
        p.tags && p.tags.length ? el('ul', { class: 'tag-row', role: 'list' }, p.tags.map(t => el('li', { text: t }))) : null,
        el('span', { class: 'project-open', html: 'Open project <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' })
      ])
    ]);
    card.addEventListener('click', () => openProject(p));
    cards.push(card);
    grid.append(card);
  });

  if (tagSet.length > 1) {
    const mk = (label, tag) => {
      const b = el('button', { type: 'button', text: label, 'aria-pressed': tag ? 'false' : 'true' });
      b.addEventListener('click', () => {
        $$('button', filtersBox).forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        let shown = 0;
        cards.forEach(cd => {
          const ok = !tag || cd.dataset.cat === tag;
          cd.classList.toggle('hidden', !ok);
          if (ok) shown++;
        });
        $('#projects-empty').hidden = shown > 0;
      });
      return b;
    };
    filtersBox.append(mk('All', null), ...tagSet.map(t => mk(t, t)));
  } else filtersBox.remove();

  /* ---------- modal ---------- */
  const modal = $('#project-modal');
  const mImg = $('#modal-img'), mThumbs = $('#modal-thumbs'), mTitle = $('#modal-title'), mMeta = $('#modal-meta'), mDesc = $('#modal-desc'), mTags = $('#modal-tags');
  let lastFocus = null;

  function openProject(p) {
    lastFocus = document.activeElement;
    mTitle.textContent = p.title;
    mMeta.textContent = p.meta || '';
    mDesc.innerHTML = '';
    ([].concat(p.description || p.summary || [])).forEach(t => mDesc.append(el('p', { text: t })));
    mTags.innerHTML = '';
    (p.tags || []).forEach(t => mTags.append(el('li', { text: t })));
    const imgs = p.galleryImages || p.images || [];
    const show = (i) => {
      mImg.src = imgs[i] || '';
      mImg.alt = `${p.title} — photo ${i + 1} of ${imgs.length}`;
      $$('button', mThumbs).forEach((b, j) => b.setAttribute('aria-current', j === i ? 'true' : 'false'));
    };
    mThumbs.innerHTML = '';
    if (imgs.length > 1) imgs.forEach((src, i) => {
      const b = el('button', { type: 'button', 'aria-label': `Photo ${i + 1}` }, el('img', { src, alt: '' }));
      b.addEventListener('click', () => show(i));
      mThumbs.append(b);
    });
    $('.modal-media').style.display = imgs.length ? '' : 'none';
    show(0);
    modal.showModal();
    $('#modal-close').focus();
  }
  $('#modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => { if (lastFocus) lastFocus.focus(); });

  /* ---------- interactive 3-way circuit ---------- */
  const sw1 = $('#sw1'), sw2 = $('#sw2'), lamp = $('#lamp'), lampState = $('#lamp-state'), hint = $('#circuit-hint');
  // "up" = common connected to traveler 1 (top), "down" = traveler 2 (bottom).
  const state = { sw1: 'up', sw2: 'down' };
  let touched = false;
  function renderCircuit() {
    sw1.classList.toggle('down', state.sw1 === 'down');
    sw2.classList.toggle('down', state.sw2 === 'down');
    const on = state.sw1 === state.sw2;
    const liveTraveler = state.sw1 === 'up' ? 'seg-t1' : 'seg-t2';
    $$('.seg', $('#circuit')).forEach(s => s.classList.remove('live'));
    $('.seg-a').classList.add('live');
    $('.' + liveTraveler).classList.add('live');
    if (on) $('.seg-b').classList.add('live');
    lamp.classList.toggle('on', on);
    lampState.textContent = on ? 'LAMP ON' : 'LAMP OFF';
    lampState.classList.toggle('on', on);
    sw1.setAttribute('aria-checked', String(state.sw1 === 'down'));
    sw2.setAttribute('aria-checked', String(state.sw2 === 'down'));
    if (touched) hint.classList.add('fade');
  }
  const flip = (k) => { state[k] = state[k] === 'up' ? 'down' : 'up'; touched = true; renderCircuit(); };
  [['sw1', sw1], ['sw2', sw2]].forEach(([k, node]) => {
    node.addEventListener('click', () => flip(k));
    node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(k); } });
  });
  renderCircuit();

  /* ---------- nav: mobile toggle + scroll spy ---------- */
  const toggle = $('.nav-toggle'), mobileNav = $('#mobile-nav');
  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', mobileNav).forEach(a => a.addEventListener('click', () => { mobileNav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

  const navLinks = $$('.site-nav a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['projects', 'experience', 'about', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------- scroll reveals ---------- */
  const revealTargets = [...$$('.section-head'), ...$$('.project'), ...$$('.ckt'), ...$$('.about-visual'), ...$$('.exp-side'), ...$$('.contact-main'), ...$$('.contact-side')];
  revealTargets.forEach((n, i) => { n.classList.add('reveal'); n.style.transitionDelay = `${Math.min((i % 6) * 60, 300)}ms`; });
  const ro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: 0.12 });
  revealTargets.forEach(n => ro.observe(n));
})();
