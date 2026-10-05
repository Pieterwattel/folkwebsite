const detailPanel = document.querySelector("#detail-panel");
const detailCopy = document.querySelector("#detail-copy");
const signupForm = document.querySelector("#signup-form");
const signupThanks = document.querySelector("#signup-thanks");
const signupButton = document.querySelector("#signup-button");
const openSignupLink = document.querySelector("#open-signup");
const factPrompt = document.querySelector("#fact-prompt");
const backButton = document.querySelector("#back-button");

function showSignup(event) {
  event.preventDefault();
  detailCopy.hidden = true;
  signupThanks.hidden = true;
  signupForm.hidden = false;
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

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signupForm.hidden = true;
  signupThanks.hidden = false;
  detailPanel.scrollTop = 0;
});

const instruments = [
  { el: document.querySelector("#bodhran img"), stride: 102, offset: 0, arc: [8, -7, 2, -5, 7, -1, -8, 4, -3, 6] },
  { el: document.querySelector("#violin img"), stride: 66, offset: 4, arc: [-6, 8, -2, 5, -8, 1, 7, -4, 3, -7] },
  { el: document.querySelector("#guitar img"), stride: 123, offset: 2, arc: [5, -8, 7, -3, -7, 8, -1, 4, -6, 2] },
  { el: document.querySelector("#whistle img"), stride: 81, offset: 6, arc: [-8, 3, -5, 8, -2, 6, -7, 1, 7, -4] }
];

document.addEventListener("wheel", (event) => {
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
