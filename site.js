/* Folksessie Utrecht: script for the one-page site (index.html).
   Sections:
     1. settings
     2. texts (Dutch is in index.html; English below) and the language button
     3. views: home / sign-up / tunes, switched by the address (#aanmelden, #tunes)
     4. sessions: loaded once from the sheet, shown on home and sign-up
     5. sign-up form
     6. sound button
     7. instruments that tilt while scrolling (home)
     8. tunes: current level in the bar */

/* ============================================================
   1. Settings
   ============================================================ */

// The Apps Script web app (apps-script/Code.gs). If you ever make a new
// deployment, paste its /exec link here.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0r8UrZg8HKXYhMn1ezGbpwxAoUIrd3oBcUaLUkzBrYAbSMIvAypGAaqPGCLT_g2Mg/exec';

// Where people can sign up by email when signing up online doesn't work.
const MAIL = 'folkmuziekutrecht@gmail.com';

// On your own computer without SCRIPT_URL the page shows demo sessions.
const LOCAL = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const DEMO_EVENTS = [
  { id: 'irish-2026-12-19', event: 'folk session, mainly Irish', date: '2026-12-19', start: '13:00', end: '14:30', location: 'Domplein 4, Utrecht', cost: 'free/donation' },
  { id: 'irish-2027-01-16', event: 'folk session, mainly Irish', date: '2027-01-16', start: '13:00', end: '14:30', location: 'Domplein 4, Utrecht', cost: 'free/donation' }
];

const $ = (id) => document.getElementById(id);

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function mailLink() {
  const a = el('a', null, MAIL);
  a.href = 'mailto:' + MAIL;
  return a;
}

/* ============================================================
   2. Texts and the language button
   ============================================================ */

let lang = 'nl';
try { if (localStorage.getItem('folkLang') === 'en') lang = 'en'; } catch (e) {}

// Short texts used by the script, in both languages.
const T = {
  nl: {
    title: 'Folksessie Utrecht',
    langButton: 'translate to English',
    loading: 'Sessies laden…',
    noneHome: 'Er zijn nu geen sessies gepland. Kijk binnenkort weer!',
    homeLoadError: 'De sessies kunnen nu niet geladen worden. Wil je meedoen? Mail naar ',
    full: 'vol',
    join: 'Ik doe mee',
    noneSignup: 'Er zijn nu geen komende sessies. Kijk binnenkort weer!',
    notOpen: 'Online aanmelden is nog niet open.',
    cantLoad: 'Sorry, de sessies kunnen nu niet geladen worden.',
    mailHow: ['Wil je meedoen? Stuur een mail naar ', ' met je naam en de sessie waar je bij wilt zijn.'],
    errChoose: 'Kies minstens één sessie.',
    errReturning: 'Laat ons weten of je al eens geweest bent.',
    errName: 'Vul je naam in.',
    errEmail: 'Vul een geldig e-mailadres in.',
    errInstrument: 'Laat ons weten welk instrument je speelt.',
    fullOne: 'Sorry, deze sessie is vol.',
    fullMany: 'Sorry, deze sessies zijn vol.',
    thanks: 'Dankjewel, we hebben je aanmelding ontvangen! :)',
    alreadyFull: ' (Al vol, dus niet ingeschreven: {list}.)',
    errNetwork: 'Je aanmelding kon niet verstuurd worden. Controleer je verbinding en probeer het opnieuw.',
    errGeneric: 'Sorry, er ging iets mis en je aanmelding is niet opgeslagen.',
    alsoMail: [' Je kunt je ook aanmelden door een mail te sturen naar ', '.'],
    sending: 'Versturen…',
    audioPlay: 'muziek afspelen',
    audioPause: 'muziek pauzeren',
    tuneOn: ' op thesession.org (audio)',
    months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    monthsShort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  },
  en: {
    title: 'Folk session Utrecht',
    langButton: 'vertaal naar Nederlands',
    loading: 'Loading sessions…',
    noneHome: 'No sessions planned right now. Check back soon!',
    homeLoadError: "The sessions can't be loaded right now. To join one, email ",
    full: 'full',
    join: "I'll join",
    noneSignup: 'There are no upcoming sessions right now. Check back soon!',
    notOpen: "Signing up online isn't open yet.",
    cantLoad: "Sorry, the sessions can't be loaded right now.",
    mailHow: ['To join a session, send an email to ', " with your name and the session you'd like to join."],
    errChoose: 'Please choose at least one session.',
    errReturning: 'Please tell us whether you have joined before.',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email address.',
    errInstrument: 'Please tell us which instrument you play.',
    fullOne: 'Sorry, this session is full.',
    fullMany: 'Sorry, these sessions are full.',
    thanks: "Thank you, we've received your sign-up! :)",
    alreadyFull: ' (Already full, so not signed up: {list}.)',
    errNetwork: "Your sign-up couldn't be sent. Please check your connection and try again.",
    errGeneric: "Sorry, something went wrong and your sign-up wasn't saved.",
    alsoMail: [' You can also sign up by sending an email to ', '.'],
    sending: 'Sending…',
    audioPlay: 'play music',
    audioPause: 'pause music',
    tuneOn: ' on thesession.org (audio)',
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  }
};
const t = (key) => T[lang][key];

// English versions of the texts marked with data-i18n in index.html.
const EN = {
  sessionsTitle: 'Upcoming music sessions',
  loading: 'Loading sessions…',
  learnButton: 'LEARN THE MUSIC HERE',
  signupButton: 'SIGN UP',
  invite: 'Do you feel like playing music together with others in a freer way, something other than an orchestra or a band? Come and discover fresh folk music in Utrecht!',
  levels: '<strong>All levels welcome.</strong> But it is advisable to have been playing for at least <strong>1 year</strong>.',
  signupText: 'If you would like to come, please <a href="#aanmelden">sign up</a>. Once we have a signup, we will assume that you are coming. If it turns out you cannot make it, please let us know at <a href="mailto:folkmuziekutrecht@gmail.com">folkmuziekutrecht@gmail.com</a>.',
  styles: 'We will mainly play <strong>Irish tunes</strong>, but there is certainly room for other styles of folk music. We are open to all sorts of things.',
  howTitle: 'How does it work?',
  howTunes: 'Folk music is basically made up of <strong>“tunes”</strong>, melodies that several people know and then play together. To make sure you have something to play, we have <a href="#tunes">collected some tunes for you</a>. But if you are already playing folk music and you bring some tunes yourself, that is very welcome! There is bound to be someone who can play along with you. <strong>The session is supposed to be played without sheet music, using your ears! :)</strong> If it helps you to feel a bit more confident, it is understandable to bring some sheet music for the first time, but we will encourage you to leave it at home the next time. Also it is much more fun and exciting like this, really!',
  howChords: 'There are instruments that play <strong>melodies</strong> (tunes), and instruments that play <strong>chords</strong> (guitar, bouzouki, the left hand of the accordion). Because the chords are often made up on the spot, you can end up playing something different from the others, so it is often better to have <strong>1 person</strong> playing chords. If the chords are written down somewhere, everyone plays the same thing, and then it does work to have several people playing chords.',
  howSets: "When someone starts playing a tune, they start a <strong>set</strong>, 1 or more tunes in a row. You usually play a tune 3 times through, and then the leader of the set starts the next tune. If you don't know the tune, don't play along, or play very quietly in the background, so the others can still hear the music well.",
  prepareTitle: 'Should I prepare anything?',
  prepare: 'It is certainly a good idea to <strong>practise some tunes</strong> before you come to the session. There will not be much time to teach you the tunes. Someone might be able to help you briefly, but the focus is on <strong>playing together</strong>.',
  prepareLink: '<a href="#tunes">We have put a collection of tunes here!</a>',
  hardTitle: 'I think this might still be too difficult for me..',
  hardSlow: 'You can always play a tune more slowly. Inisheer is especially beautiful when it is played slowly. Once you have that down, you can ask someone else at the session to start Inisheer slowly for you. It is a session, so you do not have to do it on your own. We all play along!',
  hardChords: 'There are also chords written above the melodies. Maybe you can already play those? If you do not have a chord instrument, you can also try playing the note of the chord, so a D for a D chord, and an E for an Em chord.',
  hardDrone: "And if you come across a tune at the session that you don't know, you can always hold the note of the key the tune is in. So for The Kesh [G] you can play a G, and from there you can also experiment with rhythm and other notes.",
  hardMail: 'If you still cannot quite work it out, you can email us at <a href="mailto:folkmuziekutrecht@gmail.com">folkmuziekutrecht@gmail.com</a>.',
  hardFirst: "Also, the first tune is definitely the hardest. It is definitely not easy to learn your first tune. Learning it is a real achievement that deserves some recognition. Once you have Inisheer though, I am convinced you could learn Egan's Polka. Once you have that one you already know 2 tunes! Now you are basically in.",
  experienceTitle: 'What if I already have more experience?',
  experience: 'If you are more experienced, you are very welcome too. We think it is especially interesting to have <strong>a mix of levels</strong>, so we also learn from each other. Some tunes will be played calmly, so everyone can join in, and now and then mainly experienced players will play, on less familiar or faster tunes. We like that both of those things can happen!',
  ampTitle: 'Should I bring my electric guitar?',
  amp: 'This folk session is meant for acoustic instruments. There will be no amplifiers or microphones.',
  aboutTitle: 'About us',
  about1: 'Hi! We are Pieter and Boet. Folk music is a very social and welcoming way to make music together, and it has brought us a lot of joy and fun. This is something we would like to share with the people around us.',
  about2: 'We are both active in folk music in the Netherlands. We often play together and in different bands, and we perform all over the country. <a href="https://pieterwattel.nl/">Pieter</a> (guitar) plays in <a href="https://odevare.com/">Odevare</a> and studied at the Utrecht Conservatory. Boet plays bouzouki and accordion in <a href="https://www.youtube.com/watch?v=BFdNJ7wBQdg">Celtic Constellation</a>. We also have experience teaching. But we are also looking for another, playful way to share the music with others, where you can figure things out and discover them together, and we think a session is the perfect setting for that.',
  about3: "For now it's the two of us, but we'd love to see it grow into something bigger: more sessions, more places, and more people discovering this music, whether you've played for years or are just starting out.",
  about4: 'If that sounds good to you, come and play with us. And if you\'d like to help it grow, or have ideas, send us a message at <a href="mailto:folkmuziekutrecht@gmail.com">folkmuziekutrecht@gmail.com</a>.',
  photoAlt: 'Boet (accordion) and Pieter (guitar) playing on stage',
  backHome: '&larr; Folk session Utrecht',
  signupTitle: 'Sign up for a session',
  demo: 'Preview mode: demo sessions, sign-ups are not saved.',
  chooseSessions: 'Choose one or more sessions',
  joinedBefore: 'Have you joined before?',
  yes: 'Yes',
  noNew: "No, I'm new",
  name: 'Name *',
  email: 'Email *',
  instrument: 'Instrument *',
  experienceLabel: 'How long have you been playing?',
  remark: 'Remark',
  submit: 'Sign me up',
  cancel: 'Signed up but can\'t make it? To cancel, send an email to <a href="mailto:folkmuziekutrecht@gmail.com">folkmuziekutrecht@gmail.com</a>.',
  tunesBack: 'back to the folk session',
  tunebookCredit: 'Many of the tunes, as they are written here, come from this tunebook. It also has extra information about the tunes, and the explanation of how sessions work is well worth reading. Credits to Tijn Berends. <a href="assets/The-Dutch-Session-Tunebook-2nd-ed.pdf" download>Download The Dutch Session Tunebook (2nd edition)</a>',
  moreTunes: 'more tunes (sorted from most to least popular)'
};

// Remember the Dutch texts from index.html, so we can switch back.
const DUTCH = new Map();
document.querySelectorAll('[data-i18n]').forEach((n) => DUTCH.set(n, n.innerHTML));
document.querySelectorAll('[data-i18n-alt]').forEach((n) => DUTCH.set(n, n.alt));

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach((n) => {
    n.innerHTML = lang === 'en' ? EN[n.dataset.i18n] : DUTCH.get(n);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((n) => {
    n.alt = lang === 'en' ? EN[n.dataset.i18nAlt] : DUTCH.get(n);
  });
  document.querySelectorAll('.tune-link').forEach((a) => {
    if (!a.dataset.tune) a.dataset.tune = a.textContent;
    a.textContent = a.dataset.tune + t('tuneOn');
  });
  $('lang-button').textContent = t('langButton');
  showAudioState();
  renderSessions();
  renderMessage();
}

$('lang-button').addEventListener('click', () => {
  lang = lang === 'nl' ? 'en' : 'nl';
  try { localStorage.setItem('folkLang', lang); } catch (e) {}
  applyLanguage();
});

/* ============================================================
   3. Views: home, sign-up (#aanmelden), tunes (#tunes)
   ============================================================ */

function viewFor(hash) {
  if (hash === '#aanmelden' || hash === '#signup') return 'signup';
  if (hash === '#tunes') return 'tunes';
  return 'home';
}

let currentView = null;
function showView() {
  const view = viewFor(location.hash);
  const changed = view !== currentView;
  currentView = view;
  document.body.className = 'view-' + view;

  if (view === 'home') {
    // links like #how / #about scroll the white text panel
    const target = location.hash.length > 1 && $('info-body').querySelector(location.hash);
    if (target) target.scrollIntoView({ block: 'start' });
    else if (changed) $('info-body').scrollTop = 0;
  } else if (changed) {
    window.scrollTo(0, 0);
  }
  updateFormRoom();
  updateTunesLevel();
}
window.addEventListener('hashchange', showView);

/* ============================================================
   4. Sessions: loaded once from the sheet, shown on both views
   ============================================================ */

let sessions = null;          // the list from the sheet
let sessionsState = 'loading'; // loading | ok | error | closed | demo

// A random music emoji in front of each session on the home view,
// shuffled once per visit.
const EMOJIS = ['🎻', '🪕', '🪗', '🪈', '🎶', '🎵', '🎹', '🎉', '𝄞'];
for (let i = EMOJIS.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [EMOJIS[i], EMOJIS[j]] = [EMOJIS[j], EMOJIS[i]];
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Upcoming sessions in date order (sessions without a date last).
function upcoming() {
  const today = todayIso();
  const key = (e) => (e.date ? '0' + e.date : '1') + (e.start || '');
  return (sessions || [])
    .filter((e) => e && e.event && (!e.date || e.date >= today))
    .sort((a, b) => key(a).localeCompare(key(b)));
}

// home: '19 december' (with the year when it's not this year)
function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${t('months')[m - 1]}${y === new Date().getFullYear() ? '' : ' ' + y}`;
}
// sign-up: "19 dec '26"
function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${t('monthsShort')[m - 1]} '${String(y).slice(-2)}`;
}

function renderSessions() {
  renderHomeSessions();
  renderSignupSessions();
}

function renderHomeSessions() {
  const list = $('session-list');
  const note = (...parts) => { const li = el('li', 'note'); li.append(...parts); list.replaceChildren(li); };

  if (sessionsState === 'loading') return note(t('loading'));
  if (sessionsState === 'error' || sessionsState === 'closed') return note(t('homeLoadError'), mailLink(), '.');
  const events = upcoming();
  if (!events.length) return note(t('noneHome'));

  list.replaceChildren(...events.map((ev, i) => {
    const li = el('li');
    const symbol = EMOJIS[i % EMOJIS.length];
    // the G clef is a plain black text character; it gets a bit bigger (CSS)
    const icon = el('span', 'session-emoji' + (symbol === '𝄞' ? ' is-text' : ''), symbol);
    icon.setAttribute('aria-hidden', 'true');
    li.append(icon, ev.event + (ev.date ? ' · ' + longDate(ev.date) : ''));
    if (ev.full) li.append(el('span', 'session-full', t('full').toUpperCase()));
    return li;
  }));
}

function renderSignupSessions() {
  const box = $('events');
  const form = $('form');
  $('demo').hidden = sessionsState !== 'demo';

  if (sessionsState === 'closed' || sessionsState === 'error') {
    // no sessions: explain how to sign up by email instead
    form.hidden = true;
    const how = el('p');
    how.append(t('mailHow')[0], mailLink(), t('mailHow')[1]);
    $('unavailable').replaceChildren(el('p', null, sessionsState === 'closed' ? t('notOpen') : t('cantLoad')), how);
    $('unavailable').hidden = false;
    return;
  }
  form.hidden = false;
  $('unavailable').hidden = true;

  if (sessionsState === 'loading') { box.replaceChildren(el('p', 'empty', t('loading'))); return; }

  // keep what someone already ticked when the list is redrawn
  const ticked = new Set([...box.querySelectorAll('input[name=events]:checked')].map((b) => b.value));
  const events = upcoming();
  box.replaceChildren();
  if (!events.length) { box.append(el('p', 'empty', t('noneSignup'))); return; }

  const icon = (symbol, extra) => {
    const s = el('span', 'icon' + (extra ? ' ' + extra : ''), symbol);
    s.setAttribute('aria-hidden', 'true');
    return s;
  };

  events.forEach((ev, i) => {
    if (i > 0) {
      const sep = el('div', 'sep');
      sep.setAttribute('aria-hidden', 'true');
      box.append(sep);
    }
    const text = el('div');
    text.append(el('div', 'event-title', ev.event));
    const time = [ev.start, ev.end].filter(Boolean).join(' - ');
    // date and time on separate lines
    if (ev.date) { const d = el('div', 'event-when'); d.append(icon('📅'), shortDate(ev.date)); text.append(d); }
    if (time) { const tm = el('div', 'event-time'); tm.append(icon('🕐'), time); text.append(tm); }
    if (ev.location) { const w = el('div', 'event-where'); w.append(icon('📍'), ev.location); text.append(w); }
    if (ev.cost) { const c = el('div', 'event-cost'); c.append(icon('🪙'), ev.cost); text.append(c); }

    if (ev.full) {
      const card = el('div', 'event is-full');
      text.querySelector('.event-title').after(el('span', 'full-tag', t('full')));
      card.append(text);
      box.append(card);
      return;
    }
    const check = el('input');
    check.type = 'checkbox';
    check.name = 'events';
    check.value = ev.id || ev.event;
    check.checked = ticked.has(check.value);
    const join = el('span', 'join');
    join.append(check, t('join'));
    const card = el('label', 'event');
    card.append(text, join);
    box.append(card);
  });
}

// Kept in this browser tab for 10 minutes, so a reload shows them at once.
const CACHE_KEY = 'folkSessions';
const CACHE_MAX_AGE = 10 * 60 * 1000;
function readCache() {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    return c && Date.now() - c.time < CACHE_MAX_AGE ? c.events : null;
  } catch (e) { return null; }
}
function writeCache(events) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), events })); } catch (e) {}
}

async function loadSessions() {
  if (!SCRIPT_URL) {
    if (LOCAL) { sessions = DEMO_EVENTS; sessionsState = 'demo'; } else { sessionsState = 'closed'; }
    renderSessions();
    return;
  }
  const cached = readCache();
  if (cached) { sessions = cached; sessionsState = 'ok'; renderSessions(); }
  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    sessions = data.events || [];
    sessionsState = 'ok';
    writeCache(sessions);
  } catch (err) {
    if (!cached) sessionsState = 'error';
  }
  renderSessions();
}

/* ============================================================
   5. Sign-up form
   ============================================================ */

const form = $('form');
const submitBtn = $('submit');

// The last message under the button, kept so it can be shown again in the
// other language: { kind: 'ok'|'err', key, extra, withMail }
let message = null;

function renderMessage() {
  const msg = $('msg');
  if (!message) { msg.hidden = true; return; }
  msg.className = 'msg ' + message.kind;
  msg.textContent = t(message.key) + (message.extra ? t('alreadyFull').replace('{list}', message.extra) : '');
  if (message.withMail) msg.append(t('alsoMail')[0], mailLink(), t('alsoMail')[1]);
  msg.hidden = false;
}
function showMsg(kind, key, opts) {
  message = Object.assign({ kind, key }, opts || {});
  renderMessage();
}

// Newcomers only: email and instrument are required; the rest is optional.
function setNewcomer(isNew) {
  $('new-fields').hidden = !isNew;
  $('email').required = isNew;
  $('instrument').required = isNew;
}
form.addEventListener('change', (e) => {
  if (e.target.name === 'returning') setNewcomer(e.target.value === 'no');
});

function setSubmitText(sending) {
  submitBtn.textContent = sending ? t('sending') : (lang === 'en' ? EN.submit : DUTCH.get(submitBtn));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message = null;
  renderMessage();

  const fd = new FormData(form);
  const events = fd.getAll('events');
  const returning = fd.get('returning');
  const isNew = returning === 'no';
  const v = (k) => (fd.get(k) || '').trim();
  const name = v('name'), email = v('email'), instrument = v('instrument');

  if (!events.length) return showMsg('err', 'errChoose');
  if (!returning) return showMsg('err', 'errReturning');
  if (!name) { $('name').focus(); return showMsg('err', 'errName'); }
  if (isNew && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('email').focus(); return showMsg('err', 'errEmail'); }
  if (isNew && !instrument) { $('instrument').focus(); return showMsg('err', 'errInstrument'); }

  const payload = {
    events,
    returning: !isNew,
    name,
    email: isNew ? email : '',
    instrument: isNew ? instrument : '',
    experience: isNew ? v('experience') : '',
    note: isNew ? v('note') : '',
    website: v('website')
  };

  submitBtn.disabled = true;
  setSubmitText(true);
  try {
    let data;
    if (sessionsState === 'demo') {
      await new Promise((r) => setTimeout(r, 600));
      data = { ok: true, count: events.length };
    } else {
      // text/plain keeps this a "simple" request, so the browser skips the CORS preflight.
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      data = await res.json();
    }

    if (!data.ok) {
      if (data.full && data.full.length) {
        loadSessions();   // show them as full now
        return showMsg('err', data.full.length === 1 ? 'fullOne' : 'fullMany');
      }
      throw new Error('not saved');
    }

    showMsg('ok', 'thanks', { extra: data.full && data.full.length ? data.full.join('; ') : '' });
    form.reset();
    setNewcomer(false);
    if (sessionsState !== 'demo') loadSessions();   // a session may have just filled up
  } catch (err) {
    showMsg('err', err instanceof TypeError ? 'errNetwork' : 'errGeneric', { withMail: true });
  } finally {
    submitBtn.disabled = false;
    setSubmitText(false);
  }
});

// The form is a band fixed along the bottom; give the page room below the
// sessions so the last one can scroll above it.
function updateFormRoom() {
  const panel = document.querySelector('.panel');
  document.body.style.paddingBottom = currentView === 'signup' && !form.hidden ? (panel.offsetHeight + 24) + 'px' : '';
}
if (window.ResizeObserver) new ResizeObserver(updateFormRoom).observe(document.querySelector('.panel'));
window.addEventListener('resize', updateFormRoom);

/* ============================================================
   6. Sound button
   ============================================================ */

const audio = $('bg-audio');
const audioToggle = $('audio-toggle');

function showAudioState() {
  const playing = !audio.paused;
  audioToggle.classList.toggle('is-playing', playing);
  audioToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
  audioToggle.setAttribute('aria-label', playing ? t('audioPause') : t('audioPlay'));
}
audioToggle.addEventListener('click', () => {
  if (audio.paused) audio.play().then(showAudioState).catch(showAudioState);
  else { audio.pause(); showAudioState(); }
});
audio.addEventListener('play', showAudioState);
audio.addEventListener('pause', showAudioState);

/* ============================================================
   7. Instruments tilt in small steps while scrolling the text (home)
   ============================================================ */

(function wobble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [
    { el: $('violin'),  stride: 66,  offset: 4, arc: [-6, 8, -2, 5, -8, 1, 7, -4, 3, -7] },
    { el: $('whistle'), stride: 81,  offset: 6, arc: [-8, 3, -5, 8, -2, 6, -7, 1, 7, -4] }
  ].filter((item) => item.el);   // instruments are taken off the page for now
  if (!items.length) return;
  const panel = $('info-body');
  let last = panel.scrollTop;
  let lastTime = performance.now();
  const progress = items.map((item) => last / item.stride);
  const turnFor = (item, steps) => (steps <= 0 ? 0 : item.arc[(steps - 1 + item.offset) % item.arc.length]);

  panel.addEventListener('scroll', () => {
    const scroll = panel.scrollTop;
    const now = performance.now();
    const gap = Math.max(now - lastTime, 16);
    const delta = scroll - last;
    const fast = Math.abs(delta) / gap > 0.8;
    if (scroll <= 0) progress.fill(0);
    else items.forEach((item, i) => {
      const requested = delta / item.stride;
      // when scrolling fast, don't flip through the angles too quickly
      progress[i] += fast ? Math.sign(requested) * Math.min(Math.abs(requested), gap / 450) : requested;
    });
    items.forEach((item, i) => {
      const turn = turnFor(item, Math.floor(progress[i]));
      item.el.style.transform = turn === 0 ? '' : `rotate(${turn}deg)`;
    });
    last = scroll;
    lastTime = now;
  }, { passive: true });
})();

/* ============================================================
   8. Tunes: show the level you're looking at in the bar
   ============================================================ */

function updateTunesLevel() {
  if (currentView !== 'tunes') return;
  const edge = document.querySelector('.tunes-bar').getBoundingClientRect().bottom;
  const levels = document.querySelectorAll('.tune-level');
  let name = levels[0].dataset.level;
  levels.forEach((level) => { if (level.getBoundingClientRect().top <= edge + 1) name = level.dataset.level; });
  $('tunes-level').textContent = name;
}
window.addEventListener('scroll', updateTunesLevel, { passive: true });

/* ============================================================
   Start
   ============================================================ */
showView();
applyLanguage();
loadSessions();
