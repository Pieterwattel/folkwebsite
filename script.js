const SIGNUP_ENDPOINT = "https://script.google.com/macros/s/AKfycbzHjwtOrjf4AA1KqaM25kMwbx4ET1vx_bOAGJqNGJwNBbP0h5flHlL7jNj0wjjJoFKV/exec";

const translateButton = document.querySelector("#translate-button");
const englishCopy = {
  "fact-what-label": "What",
  "fact-what-value": "folk session Utrecht, mainly Irish",
  "fact-when-label": "When",
  "fact-when-value": "21 November 15:00 - 16:30",
  "fact-where-label": "Where",
  "fact-where-link": "Domplein 4, Utrecht",
  "fact-cost-label": "Cost",
  "fact-cost-value": "free",
  "fact-prompt-value": "Sign up here &gt;&gt;",
  "back-label": "back",
  "signup-button": "SIGN UP",
  "alt-bodhran": "Bodhrán",
  "alt-violin": "Violin",
  "alt-guitar": "Guitar",
  "alt-whistle": "Tin whistle",
  "detail-invite": "Do you feel like playing music together with others in a freer way, something other than an orchestra or a band? Come and discover fresh folk music in Utrecht!",
  "detail-organisers": "<strong>21 November</strong> we (<strong><a href=\"https://pieterwattel.nl\">Pieter Wattel</a></strong>, <strong>Boet Hoitink</strong>) are organising an open folk session in Utrecht. <strong>Ide Cornelissen</strong> will be there as well. We can also help you if you get stuck for a moment. We are very enthusiastic about this music, and we would like to share it with you. In short, you are very welcome!",
  "detail-levels": "<strong>All levels welcome.</strong> But it is advisable to have been playing for at least <strong>1 year</strong>.",
  "detail-signup": "If you would like to come, please sign up. Once we have a signup, we will assume that you are coming. If it turns out you cannot make it, please let us know at <a href=\"mailto:pieterwattel@gmail.com\">pieterwattel@gmail.com</a>",
  "detail-styles": "We will mainly play <strong>Irish tunes</strong>, but there is certainly room for other styles of folk music. We are open to all sorts of things.",
  "heading-how": "How does it work?",
  "detail-tunes": "Folk music is basically made up of <strong>“tunes”</strong>, melodies that several people know and then play together. To make sure you have something to play, we have <a href=\"#tunes\">collected some tunes for you</a>. But if you are already playing folk music and you bring some tunes yourself, that is very welcome! There is bound to be someone who can play along with you.",
  "detail-chords": "There are instruments that play <strong>melodies</strong> (tunes), and instruments that play <strong>chords</strong> (guitar, bouzouki, the left hand of the accordion). Because the chords are often made up on the spot, you can end up playing something different from the others, so it is often better to have <strong>1 person</strong> playing chords. If the chords are written down somewhere, everyone plays the same thing, and then it does work to have several people playing chords.",
  "detail-sets": "When someone starts playing a tune, they start a <strong>set</strong>, 1 or more tunes in a row. You usually play a tune 3 times through, and then the leader of the set starts the next tune. If you don't know the tune, don't play along, or play very quietly in the background, so the others can still hear the music well.",
  "heading-prepare": "Should I prepare anything?",
  "detail-prepare": "It is certainly a good idea to <strong>practise some tunes</strong> before you come to the session. There will not be much time to teach you the tunes. Someone might be able to help you briefly, but the focus is on <strong>playing together</strong>.",
  "detail-tune-link": "<a href=\"#tunes\">We have put a collection of tunes here!</a>",
  "heading-too-hard": "I think this might still be too difficult for me..",
  "detail-too-hard-slow": "You can always play a tune more slowly. Inisheer is especially beautiful when it is played slowly. See if you can play the first note of each bar (the thin vertical line), and leave out the rest. You could play along with others that way, and that would work fine! Once you have that down, you can learn it very slowly, and then ask someone else at the session to start Inisheer slowly for you. It is a session, so you do not have to do it on your own. We all play along!",
  "detail-too-hard-chords": "There are also chords written above the melodies. Maybe you can already play those? If you do not have a chord instrument, you can also try playing the note of the chord, so a D for a D chord, and an E for an Em chord.",
  "detail-too-hard-mail": "If you still cannot quite work it out, you can email me at <a href=\"mailto:pieterwattel@gmail.com\">pieterwattel@gmail.com</a>",
  "detail-too-hard-first": "Also, the first tune is definitely the hardest. It is definitely not easy to learn your first tune. Learning it is a real achievement that deserves some recognition. Once you have Inisheer though, I am convinced you could learn Egan's Polka. Once you have that one you already know 2 tunes! Now you are basically in.",
  "heading-experience": "What if I already have more experience",
  "detail-experience": "If you are more experienced, you are very welcome too. We think it is especially interesting to have <strong>a mix of levels</strong>, so we also learn from each other. Some tunes will be played calmly, so everyone can join in, and now and then mainly experienced players will play, on less familiar or faster tunes. We like that both of those things can happen!",
  "heading-amplification": "Should I bring my electric guitar",
  "detail-amplification": "This folk session is meant for acoustic instruments. There will be no amplifiers or microphones.",
  "heading-who": "Who are we?",
  "detail-who": "We are a group of musician friends who are active in folk music in the Netherlands. We often play together and in different bands, and we perform all over the country. <a href=\"https://pieterwattel.nl\">Pieter</a> (guitar) and Ide (violin) play together in <a href=\"https://odevare.com\">Odevare</a> and studied at the Utrecht Conservatory. Boet Hoitink plays in <a href=\"https://www.youtube.com/watch?v=BFdNJ7wBQdg\">Celtic Constellation</a>. We also have experience teaching. But we are also looking for another, playful way to share the music with others. So that you can figure things out and discover them together a bit, and we think this is the perfect setting for that.",
  "heading-signup": "Sign up",
  "signup-stay": "You can also sign up if you are not coming this time, but would like to stay informed about a next session. Please mention that in the note.",
  "label-name": "Name *",
  "label-email": "Email *",
  "label-instrument": "Instrument *",
  "label-experience": "How long have you been playing *",
  "label-note": "Note",
  "form-submit": "Send signup",
  "signup-error": "Sending did not work. Please email <a href=\"mailto:pieterwattel@gmail.com\">pieterwattel@gmail.com</a>.",
  "signup-thanks": "Thank you. Your signup has been noted. Cancellations can be sent to <a href=\"mailto:pieterwattel@gmail.com\">pieterwattel@gmail.com</a>.",
  "learn-music": "learn the music here"
};
const dutchCopy = new Map();
let language = "nl";

function setLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = nextLanguage;
  document.title = nextLanguage === "en" ? "Folk session Utrecht" : "Folksessie Utrecht";
  Object.entries(englishCopy).forEach(([id, english]) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    if (!dutchCopy.has(id)) {
      dutchCopy.set(id, element.tagName === "IMG" ? element.alt : element.innerHTML);
    }
    const text = nextLanguage === "en" ? english : dutchCopy.get(id);
    if (element.tagName === "IMG") {
      element.alt = text;
      return;
    }
    element.innerHTML = text;
  });
  translateButton.textContent = nextLanguage === "en" ? "vertaal naar Nederlands" : "translate to English";
  if (typeof showAudioState === "function") {
    showAudioState();
  }
}

translateButton.addEventListener("click", () => {
  setLanguage(language === "nl" ? "en" : "nl");
});

const detailPanel = document.querySelector("#detail-panel");
const detailCopy = document.querySelector("#detail-copy");
const signupForm = document.querySelector("#signup-form");
const signupThanks = document.querySelector("#signup-thanks");
const signupError = document.querySelector("#signup-error");
const signupButton = document.querySelector("#signup-button");
const openSignupLink = document.querySelector("#open-signup");
const factPrompt = document.querySelector("#fact-prompt");
const backButton = document.querySelector("#back-button");

function showSignup(event) {
  event.preventDefault();
  detailCopy.hidden = true;
  signupThanks.hidden = true;
  signupForm.hidden = false;
  signupError.hidden = true;
  factPrompt.hidden = true;
  backButton.hidden = false;
  detailPanel.scrollTop = 0;
  signupForm.querySelector("input").focus();
}

function showText() {
  signupForm.hidden = true;
  signupThanks.hidden = true;
  detailCopy.hidden = false;
  backButton.hidden = true;
  factPrompt.hidden = false;
  detailPanel.scrollTop = 0;
}

signupButton.addEventListener("click", showSignup);
if (openSignupLink) {
  openSignupLink.addEventListener("click", showSignup);
}
backButton.addEventListener("click", showText);

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = signupForm.querySelector("[type=submit]");
  submitButton.disabled = true;
  signupError.hidden = true;

  const payload = {
    naam: signupForm.naam.value.trim(),
    email: signupForm.email.value.trim(),
    instrument: signupForm.instrument.value.trim(),
    ervaring: signupForm.ervaring.value.trim(),
    opmerking: signupForm.opmerking.value.trim()
  };

  try {
    if (!SIGNUP_ENDPOINT) {
      throw new Error("missing signup endpoint");
    }
    await fetch(SIGNUP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    signupForm.reset();
    signupForm.hidden = true;
    signupThanks.hidden = false;
  } catch (error) {
    signupError.hidden = false;
  }

  submitButton.disabled = false;
  detailPanel.scrollTop = 0;
});

const instruments = [
  { el: document.querySelector("#bodhran img"), stride: 102, offset: 0, arc: [8, -7, 2, -5, 7, -1, -8, 4, -3, 6] },
  { el: document.querySelector("#violin img"), stride: 66, offset: 4, arc: [-6, 8, -2, 5, -8, 1, 7, -4, 3, -7] },
  { el: document.querySelector("#guitar img"), stride: 123, offset: 2, arc: [5, -8, 7, -3, -7, 8, -1, 4, -6, 2] },
  { el: document.querySelector("#whistle img"), stride: 81, offset: 6, arc: [-8, 3, -5, 8, -2, 6, -7, 1, 7, -4] }
];

document.addEventListener("wheel", (event) => {
  if (document.body.classList.contains("tunes-page")) {
    return;
  }
  if (detailPanel.contains(event.target)) {
    return;
  }
  event.preventDefault();
}, { passive: false });

function scrollPosition() {
  return detailPanel.scrollTop;
}

let lastScroll = scrollPosition();
let lastScrollTime = performance.now();
const progress = instruments.map((item) => lastScroll / item.stride);

function turnFor(item, steps) {
  if (steps <= 0) {
    return 0;
  }
  const index = (steps - 1 + item.offset) % item.arc.length;
  return item.arc[index];
}

function placeInstruments() {
  const scroll = scrollPosition();
  const now = performance.now();
  const gap = Math.max(now - lastScrollTime, 16);
  const delta = scroll - lastScroll;
  const velocity = Math.abs(delta) / gap;
  const fast = velocity > 0.8;

  if (scroll <= 0) {
    progress.fill(0);
  } else {
    instruments.forEach((item, index) => {
      const requested = delta / item.stride;
      if (!fast) {
        progress[index] += requested;
        return;
      }
      const maxTravel = gap / 450;
      progress[index] += Math.sign(requested) * Math.min(Math.abs(requested), maxTravel);
    });
  }

  instruments.forEach((item, index) => {
    const turn = turnFor(item, Math.floor(progress[index]));
    item.el.style.transform = turn === 0 ? "" : `rotate(${turn}deg)`;
  });

  lastScroll = scroll;
  lastScrollTime = now;
}

detailPanel.addEventListener("scroll", placeInstruments, { passive: true });
window.addEventListener("scroll", placeInstruments, { passive: true });

const audio = document.querySelector("#bg-audio");
const audioToggle = document.querySelector("#audio-toggle");

function audioLabel() {
  const playing = audio && !audio.paused;
  if (language === "en") {
    return playing ? "pause music" : "play music";
  }
  return playing ? "muziek pauzeren" : "muziek afspelen";
}

function showAudioState() {
  const playing = audio && !audio.paused;
  audioToggle.classList.toggle("is-playing", playing);
  audioToggle.setAttribute("aria-pressed", playing ? "true" : "false");
  audioToggle.setAttribute("aria-label", audioLabel());
}

audioToggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().then(showAudioState).catch(showAudioState);
    return;
  }
  audio.pause();
  showAudioState();
});

audio.addEventListener("play", showAudioState);
audio.addEventListener("pause", showAudioState);
showAudioState();

const label = document.querySelector("#tunes-level");
const levels = document.querySelectorAll(".tune-level");
const bar = document.querySelector(".tunes-bar");
const stripeImage = document.querySelector(".tunes-stripe-image");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateStripe() {
  if (!stripeImage || !document.body.classList.contains("tunes-page")) {
    return;
  }
  if (reduceMotion.matches) {
    stripeImage.style.height = "100%";
    stripeImage.style.transform = "none";
    return;
  }
  const headerHeight = bar.getBoundingClientRect().height;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const travel = headerHeight / 3;
  const offset = Math.max(0, Math.min(travel, progress * travel));
  stripeImage.style.height = "calc(100% + " + travel + "px)";
  stripeImage.style.transform = "translateY(" + (-offset) + "px)";
}

function updateLevel() {
  if (!label || !levels.length || !document.body.classList.contains("tunes-page")) {
    return;
  }
  const edge = bar.getBoundingClientRect().bottom;
  let name = levels[0].getAttribute("data-level");
  levels.forEach((level) => {
    if (level.getBoundingClientRect().top <= edge + 1) {
      name = level.getAttribute("data-level");
    }
  });
  label.textContent = name;
}

function applyView() {
  const tunes = location.hash === "#tunes";
  document.body.classList.toggle("tunes-page", tunes);
  if (tunes) {
    window.scrollTo(0, 0);
  }
  updateLevel();
  updateStripe();
}

window.addEventListener("hashchange", applyView);
window.addEventListener("scroll", () => {
  updateLevel();
  updateStripe();
}, { passive: true });
window.addEventListener("resize", () => {
  updateLevel();
  updateStripe();
});
if (reduceMotion.addEventListener) {
  reduceMotion.addEventListener("change", updateStripe);
}
applyView();
