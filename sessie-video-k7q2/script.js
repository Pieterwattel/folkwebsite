// Same Apps Script deployment as the signup form on the main page.
// aanmeldingen.gs emails requests with type "geen-toestemming" to Pieter.
const ENDPOINT = "https://script.google.com/macros/s/AKfycbzHjwtOrjf4AA1KqaM25kMwbx4ET1vx_bOAGJqNGJwNBbP0h5flHlL7jNj0wjjJoFKV/exec";

const VIDEOS = [
  { file: "blarney-pilgrim", title: "Blarney Pilgrim" },
  { file: "inisheer", title: "Inisheer" },
  { file: "josefiens-waltz", title: "Josefien's Waltz" },
  { file: "kesh-1", title: "The Kesh (1)" },
  { file: "kesh", title: "The Kesh (2)" },
  { file: "polkas", title: "Polka's" },
  { file: "si-beagh-si-mhor", title: "Sí Beag, Sí Mór" },
  { file: "wild-asparagus", title: "Wild Asparagus" },
  { file: "foto", title: "Foto", photo: true }
];

const list = document.getElementById("video-list");

// The media lives in a folder named after the key in the link
// (…/sessie-video-k7q2/#KEY). Without the right key nothing loads.
const key = decodeURIComponent(location.hash.slice(1)).replace(/[^a-z0-9]/gi, "");
const base = "v-" + key + "/";

async function unlock() {
  if (key) {
    try {
      const check = await fetch(base + "foto.jpg", { method: "HEAD", cache: "no-store" });
      if (check.ok) {
        renderMedia();
        document.getElementById("content").hidden = false;
        return;
      }
    } catch (error) {
      // fall through to the locked message
    }
  }
  document.querySelector(".banner").hidden = true;
  document.getElementById("locked").hidden = false;
}

function renderMedia() {
VIDEOS.forEach((video) => {
  const card = document.createElement("section");
  card.className = "video-card";

  const heading = document.createElement("h2");
  heading.textContent = video.title;

  if (video.photo) {
    const img = document.createElement("img");
    img.src = base + video.file + ".jpg";
    img.alt = "Foto van de folksessie";
    img.draggable = false;
    card.append(heading, img);
    list.appendChild(card);
    return;
  }

  const player = document.createElement("video");
  player.controls = true;
  player.preload = "metadata";
  player.playsInline = true;
  player.disablePictureInPicture = true;
  player.setAttribute("controlsList", "nodownload noremoteplayback noplaybackrate");
  player.setAttribute("disableRemotePlayback", "");
  player.draggable = false;
  player.src = base + video.file + ".mp4";

  card.append(heading, player);
  list.appendChild(card);
});
}

unlock();

// Make saving the videos and photo a little harder: no right-click menu or dragging on them.
["contextmenu", "dragstart"].forEach((type) => {
  document.addEventListener(type, (event) => {
    if (event.target.closest("video, img")) {
      event.preventDefault();
    }
  });
});

// Only one video plays at a time.
document.addEventListener("play", (event) => {
  document.querySelectorAll("video").forEach((other) => {
    if (other !== event.target) {
      other.pause();
    }
  });
}, true);

const refuseCheck = document.getElementById("refuse-check");
const refuseForm = document.getElementById("refuse-form");
const formError = document.getElementById("form-error");
const thanks = document.getElementById("thanks");

refuseCheck.addEventListener("change", () => {
  refuseForm.hidden = !refuseCheck.checked;
  if (refuseCheck.checked) {
    refuseForm.naam.focus();
  }
});

refuseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;

  const naam = refuseForm.naam.value.trim();
  const bericht = refuseForm.bericht.value.trim();
  if (!naam || !bericht) {
    formError.textContent = "Vul je naam en een bericht in.";
    formError.hidden = false;
    return;
  }

  const submitButton = refuseForm.querySelector("[type=submit]");
  submitButton.disabled = true;

  try {
    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ type: "geen-toestemming", naam: naam, bericht: bericht })
    });
    refuseForm.hidden = true;
    refuseCheck.closest("label").hidden = true;
    thanks.hidden = false;
  } catch (error) {
    formError.textContent = "Versturen is niet gelukt. Probeer het later nog eens.";
    formError.hidden = false;
  }

  submitButton.disabled = false;
});
