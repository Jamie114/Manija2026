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

const caption = document.querySelector(".caption-outside");

function hideCaption() {
    if (caption) {
        caption.classList.add("caption-hidden");
        window.setTimeout(() => {
            caption.style.display = "none";
        }, 450);
    }
}

function typeWriter() {
  if (!typeTarget) return;
  if (typeIndex < TYPE_TEXT.length) {
    typeTarget.textContent += TYPE_TEXT.charAt(typeIndex);
    typeIndex += 1;
    window.setTimeout(typeWriter, 55);
  }
}

/* ---------------- Hearts (toggle) ---------------- */
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
  if (!heartsOn || heartsInterval) return;
  heartsInterval = window.setInterval(spawnHeart, 700);
}

function stopHearts() {
  if (!heartsInterval) return;
  window.clearInterval(heartsInterval);
  heartsInterval = null;
}

function setHeartsUI() {
  heartsToggle.setAttribute("aria-pressed", String(heartsOn));
  heartsToggle.textContent = `Hearts: ${heartsOn ? "On" : "Off"}`;
}

/* ---------------- UI helpers ---------------- */
function showMessage(text) {
  messageTarget.textContent = text;
  messageTarget.classList.add("show");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* ---------------- Sly No-behavior ---------------- */
let noClicks = 0;
let hoverWarned = false;

function nudgeNoLeftOnce() {
  // Move the button slightly left the first time she hovers it.
  // We keep it inside the container.
  const containerRect = container.getBoundingClientRect();

  // Ensure absolute positioning, but preserve current position if possible
  const currentLeft = parseFloat(noBtn.style.left || "0");
  const currentTop = parseFloat(noBtn.style.top || "0");

  noBtn.style.position = "absolute";

  // If it's not been positioned yet, initialize it near its current visual spot
  if (!noBtn.style.left && !noBtn.style.top) {
    // Put it roughly where it appears (near center row)
    noBtn.style.left = "55%";
    noBtn.style.top = "120px";
  }

  const btnRect = noBtn.getBoundingClientRect();
  const maxLeft = containerRect.width - btnRect.width - 10;

  // Nudge left by ~40px
  const newLeft = clamp(
    (isNaN(currentLeft) ? (containerRect.width * 0.55) : currentLeft) - 40,
    10,
    maxLeft
  );

  noBtn.style.left = newLeft + "px";
}

function dodgeNoButton() {
  // Full dodge inside the card
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

function onNoClick() {
  hideCaption();
  noClicks += 1;

  if (noClicks === 1) {
    // First click: sly confirmation
    img.src = "your_image.jpg"; // keep it cute on first "no"
    showMessage("Hmm… are you *sure* sure? 😌");
    noBtn.textContent = "Still no";
    yesBtn.textContent = "Okay fine yes 💘";
    signature.style.opacity = "0.7";
    return;
  }

  // Second+ click: unleash the dodge + your existing gag image
  img.src = "gun.gif"; // optional: replace with something cuter if you want
  showMessage("Nice try 😈 the 'No' is decorative. Keep trying.");
  dodgeNoButton();
  signature.style.opacity = "0.4";
}

function onNoHover() {
  if (hoverWarned) return;
  hoverWarned = true;

  showMessage("I see you hovering 'No'… 🤨");
  nudgeNoLeftOnce();
}

/* ---------------- Yes behavior ---------------- */
function onYes() {
  hideCaption();
  showMessage("LESGOOOOOO 💞 See you on the 14th (or whenever you say).");
  img.src = "dance.gif";
  img.classList.add("fade");

  noBtn.remove();
  yesBtn.disabled = true;
  yesBtn.textContent = "YES ✅";
  signature.remove();
}

/* ---------------- init ---------------- */
function init() {
  typeWriter();

  noBtn.addEventListener("click", onNoClick);
  noBtn.addEventListener("mouseenter", onNoHover); // hover warning + nudge

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
