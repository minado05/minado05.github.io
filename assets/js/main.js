document.getElementById("year").textContent = new Date().getFullYear();

const deck = document.getElementById("deck");
const intro = document.getElementById("intro");
const CARD_COUNT = 8;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FACE_RANKS = ["J", "Q", "K"];

function cardFront(rank, name = "") {
  const center = FACE_RANKS.includes(rank)
    ? `<span class="card-face-rank">${rank}<small>&hearts;</small></span>`
    : "&hearts;";
  return `
  <div class="card-face card-front">
    <span class="card-corner tl"><span>${rank}</span><span>&hearts;</span></span>
    <span class="card-pip">${center}</span>
    ${name ? `<span class="card-name">${name}</span>` : ""}
    <span class="card-corner br"><span>${rank}</span><span>&hearts;</span></span>
  </div>`;
}

const rand = (min, max) => min + Math.random() * (max - min);

// Card i (0 = bottom) sits slightly up and left of the one below, so the stack reads as a deck.
const stacked = (i, extra = "") => `translate(${-i}px, ${-i * 1.5}px) ${extra}`.trim();

const cards = Array.from({ length: CARD_COUNT }, (_, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.zIndex = i;
  const isTop = i === CARD_COUNT - 1;
  card.innerHTML = `<div class="card-inner"><div class="card-face card-back"></div>${isTop ? cardFront("A", "Anh Thu Do") : ""}</div>`;
  deck.appendChild(card);
  return card;
});
const topCard = cards[CARD_COUNT - 1];
const topInner = topCard.querySelector(".card-inner");

// Runs keyframes on an element, then bakes the final frame into its inline style.
async function play(el, frames, options) {
  const anim = el.animate(frames, { fill: "both", ...options });
  await anim.finished;
  el.style.transform = frames[frames.length - 1].transform;
  anim.cancel();
}

function flyIn() {
  const reach = Math.max(window.innerWidth, window.innerHeight);
  return Promise.all(
    cards.map((card, i) => {
      const angle = rand(0, Math.PI * 2);
      const from = `translate(${Math.cos(angle) * reach}px, ${Math.sin(angle) * reach}px) rotate(${rand(-200, 200)}deg) scale(1.4)`;
      const to = stacked(i, `rotate(${rand(-10, 10)}deg)`);
      return play(card, [{ transform: from }, { transform: to }], {
        duration: 750,
        delay: i * 90,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      });
    }),
  );
}

// Splits the deck left and right, then riffles the halves back together.
function riffle() {
  const spread = deck.offsetWidth * 0.62;
  return Promise.all(
    cards.map((card, i) => {
      const side = i % 2 ? 1 : -1;
      const out = `translate(${side * (spread + rand(0, 16))}px, ${-i * 1.5 - 8}px) rotate(${side * rand(5, 10)}deg)`;
      return play(card, [{ transform: card.style.transform }, { transform: out }, { transform: stacked(i) }], {
        duration: 620,
        delay: i * 30,
        easing: "ease-in-out",
      });
    }),
  );
}

async function flipTop() {
  await play(topCard, [{ transform: stacked(CARD_COUNT - 1) }, { transform: stacked(CARD_COUNT - 1, "translateY(-14px) scale(1.04)") }], {
    duration: 220,
    easing: "ease-out",
  });
  await play(topInner, [{ transform: "rotateY(0deg)" }, { transform: "rotateY(180deg)" }], {
    duration: 700,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });
  await play(topCard, [{ transform: topCard.style.transform }, { transform: stacked(CARD_COUNT - 1) }], {
    duration: 260,
    easing: "ease-in",
  });
}

// Shows the intro text, sliding the deck from where it was into its new spot beside the text.
async function revealIntro() {
  const before = deck.getBoundingClientRect();
  intro.hidden = false;
  const after = deck.getBoundingClientRect();
  const dx = before.left - after.left;
  const dy = before.top - after.top;
  await Promise.all([
    deck.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
      duration: 700,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    }).finished,
    intro.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
      duration: 600,
      delay: 250,
      easing: "ease-out",
      fill: "backwards",
    }).finished,
  ]);
}

async function deal() {
  if (reduceMotion) {
    cards.forEach((card, i) => (card.style.transform = stacked(i)));
    topInner.style.transform = "rotateY(180deg)";
    intro.hidden = false;
    return;
  }
  document.body.classList.add("dealing");
  await flyIn();
  await riffle();
  await flipTop();
  await revealIntro();
  document.body.classList.remove("dealing");
}

deal();

// ---- Card picker ----

const stage = document.querySelector(".stage");
const picker = document.getElementById("picker");
const hand = document.getElementById("hand");
const dur = (ms) => (reduceMotion ? 0 : ms);

const handCards = CARD_CONTENT.map((content, i) => {
  const offset = i - (CARD_CONTENT.length - 1) / 2;
  const card = document.createElement("button");
  card.type = "button";
  card.className = "hand-card";
  card.setAttribute("aria-label", `Pick a card (${i + 1} of ${CARD_CONTENT.length})`);
  card.style.setProperty("--rot", `${offset * 5}deg`);
  card.style.setProperty("--drop", `${offset * offset * 4}px`);
  card.innerHTML = `<div class="card-inner"><div class="card-face card-back"></div>${cardFront(content.rank)}</div>`;
  card.addEventListener("click", () => pickCard(i));
  hand.appendChild(card);
  return card;
});

async function fade(el, show) {
  const frames = [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }];
  if (show) {
    el.hidden = false;
    await el.animate(frames, { duration: dur(350), easing: "ease-out" }).finished;
  } else {
    await el.animate(frames.reverse(), { duration: dur(250), easing: "ease-in" }).finished;
    el.hidden = true;
  }
}

async function showPicker() {
  await fade(stage, false);
  picker.hidden = false;
  // Deal the hand out from the top of the screen, one card at a time.
  await Promise.all(
    handCards.map((card, i) =>
      card.animate(
        [{ translate: `0 -60vh`, rotate: `${rand(-90, 90)}deg`, opacity: 0 }, { translate: "0 0", rotate: "0deg", opacity: 1 }],
        { duration: dur(600), delay: dur(i * 110), easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "backwards" },
      ).finished,
    ),
  );
  handCards[0].focus({ preventScroll: true });
}

async function showIntro() {
  await fade(picker, false);
  await fade(stage, true);
  document.getElementById("learnMore").focus({ preventScroll: true });
}

document.getElementById("learnMore").addEventListener("click", showPicker);
document.getElementById("backToIntro").addEventListener("click", showIntro);

function flipHandCard(card, faceUp) {
  const inner = card.querySelector(".card-inner");
  const from = faceUp ? "rotateY(0deg)" : "rotateY(180deg)";
  const to = faceUp ? "rotateY(180deg)" : "rotateY(0deg)";
  return play(inner, [{ transform: from }, { transform: to }], { duration: dur(550), easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
}

let picking = false;
let openCard = null;

async function pickCard(i) {
  if (picking) return;
  picking = true;
  openCard = handCards[i];
  await flipHandCard(openCard, true);
  await new Promise((resolve) => setTimeout(resolve, dur(250)));
  openSlideshow(CARD_CONTENT[i]);
  picking = false;
}

// ---- Slideshow ----

const slideshow = document.getElementById("slideshow");
const slideEl = document.getElementById("slide");
const slideCard = document.getElementById("slideCard");
const slideTitle = document.getElementById("slideTitle");
const slideMedia = document.getElementById("slideMedia");
const slideBody = document.getElementById("slideBody");
const slideDots = document.getElementById("slideDots");
const slidePrev = document.getElementById("slidePrev");
const slideNext = document.getElementById("slideNext");
const slideNav = document.querySelector(".slideshow-nav");

let slides = [];
let slideIndex = 0;

function renderSlide() {
  const slide = slides[slideIndex];
  slideTitle.textContent = slide.heading;
  slideBody.textContent = slide.body;
  if (slide.link) {
    const link = document.createElement("a");
    link.className = "slide-link";
    link.href = slide.link.href;
    link.target = "_blank";
    link.rel = "noopener";
    link.innerHTML = `<span></span> <span aria-hidden="true">&rarr;</span>`;
    link.firstChild.textContent = slide.link.text;
    slideBody.append(document.createElement("br"), link);
  }
  slideMedia.classList.toggle("has-image", Boolean(slide.image));
  slideMedia.classList.toggle("has-gallery", Boolean(slide.gallery));
  slideMedia.classList.toggle("fit-contain", slide.fit === "contain");
  if (slide.gallery) {
    slideMedia.innerHTML = galleryMarkup(slide.gallery);
  } else {
    slideMedia.innerHTML = slide.image ? `<img src="${encodeURI(slide.image)}" alt="" />` : "Image placeholder";
  }
  slidePrev.disabled = slideIndex === 0;
  slideNext.disabled = slideIndex === slides.length - 1;
  slideDots.querySelectorAll(".slide-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === slideIndex);
    dot.setAttribute("aria-current", i === slideIndex ? "true" : "false");
  });
}

function galleryMarkup(paths) {
  const photos = paths.map((path) => `<img src="${encodeURI(path)}" alt="" loading="lazy" />`).join("");
  return `
    <div class="gallery">
      <div class="gallery-track" tabindex="0" aria-label="Photos, scroll sideways">${photos}</div>
      <button type="button" class="gallery-arrow prev" aria-label="Previous photos">&lsaquo;</button>
      <button type="button" class="gallery-arrow next" aria-label="More photos">&rsaquo;</button>
    </div>`;
}

slideMedia.addEventListener("click", (e) => {
  const arrow = e.target.closest(".gallery-arrow");
  if (!arrow) return;
  const track = slideMedia.querySelector(".gallery-track");
  const dir = arrow.classList.contains("next") ? 1 : -1;
  track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
});

function goToSlide(next) {
  if (next < 0 || next >= slides.length || next === slideIndex) return;
  const dir = next > slideIndex ? 1 : -1;
  slideIndex = next;
  renderSlide();
  slideEl.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: "none" }], {
    duration: dur(300),
    easing: "ease-out",
  });
}

function openSlideshow(content) {
  slides = content.slides;
  slideIndex = 0;
  slideCard.textContent = `${content.rank} \u2665 \u00b7 ${content.title}`;
  slideDots.innerHTML = slides
    .map((_, i) => `<button type="button" class="slide-dot" aria-label="Go to slide ${i + 1}"></button>`)
    .join("");
  slideDots.querySelectorAll(".slide-dot").forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));
  slideNav.hidden = slides.length < 2;
  renderSlide();
  slideshow.showModal();
}

slidePrev.addEventListener("click", () => goToSlide(slideIndex - 1));
slideNext.addEventListener("click", () => goToSlide(slideIndex + 1));
document.getElementById("slideClose").addEventListener("click", () => slideshow.close());

slideshow.addEventListener("keydown", (e) => {
  // Arrow keys inside the photo strip scroll the photos, not the slides.
  if (e.target.closest(".gallery-track")) return;
  if (e.key === "ArrowLeft") goToSlide(slideIndex - 1);
  if (e.key === "ArrowRight") goToSlide(slideIndex + 1);
});

// Clicking the dimmed area outside the panel closes the slideshow.
slideshow.addEventListener("click", (e) => {
  if (e.target === slideshow) slideshow.close();
});

slideshow.addEventListener("close", () => {
  if (openCard) flipHandCard(openCard, false);
  openCard = null;
});
