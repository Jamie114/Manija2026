const typeTarget = document.getElementById("typewriter");
const messageTarget = document.getElementById("message");
const img = document.getElementById("main-image");
const noBtn = document.getElementById("no-button");
const yesBtn = document.getElementById("yes-button");
const signature = document.getElementById("signature");
const container = document.querySelector(".container");
const heartsToggle = document.getElementById("toggle-hearts");

const TYPE_TEXT = "Ishq-e-man, will you be my Valentine? 💘";
let typeIndex = 0;

function typeWriter() {
  if (!typeTarget) return;
  if (typeIndex < TYPE_TEXT.length) {
    typeTarget.textContent += TYPE_TEXT.charAt(typeIndex);
    typeIndex += 1;
    window.setTimeout(typeWriter, 55);
  }
}

let heartsOn = true;
let heartsInterval = null;

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "💗";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (16 + Math.random() * 16).toFixed(0) + "px";
  document.body.appendChild(heart);
  window.setTimeout(() => heart.remove(), 6000);
}

function startHearts() {
  if (!heartsOn) return;
  if (heartsInterval) return;
  heartsInterval = window.setInterval(spawnHeart, 700);
}

function stopHearts() {
  if (heartsInterval) {
    window.clearInterval(heartsInterval);
    heartsInterval = null;
  }
}

function setHeartsUI() {
  heartsToggle.setAttribute("aria-pressed", String(heartsOn));
  heartsToggle.textContent = `Hearts: ${heartsOn ? "On" : "Off"}`;
}

function showMessage(text) {
  messageTarget.textContent = text;
  messageTarget.classList.add("show");
}

function dodgeNoButton() {
  const rect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 10;

  const maxX = rect.width - btnRect.width - padding;
  const maxY = rect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

function onNo() {
  img.src = "gun.gif";
  showMessage("Nice try 😌 you already know the answer.");
  dodgeNoButton();
  signature.style.opacity = "0.4";
}

function onYes() {
  showMessage("LESGOOOOOO 💞 See you on the 14th (or whenever you say).");
  img.src = "dance.gif";
  img.classList.add("fade");

  noBtn.remove();
  yesBtn.disabled = true;
  yesBtn.textContent = "YES ✅";
  signature.remove();
}

function init() {
  typeWriter();

  noBtn.addEventListener("click", onNo);
  yesBtn.addEventListener("click", onYes);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) startHearts();

  heartsToggle.addEventListener("click", () => {
    heartsOn = !heartsOn;
    setHeartsUI();
    if (heartsOn) startHearts();
    else stopHearts();
  });

  setHeartsUI();
}

init();
