// ===== EDIT THESE =====
const COUPLE = "Jamila & Mohamed";   // their names
const WEDDING_DATE = "2020-10-17";   // YYYY-MM-DD
const PHOTOS = [                     // e.g. "images/photo1.jpg"
  "images/image 2.jpeg",
 "images/image 3.jpeg",
  "images/image 4.jpeg",
 "images/image 5.jpeg",
 "images/image 6.jpeg",
 "images/image 7.jpeg",
];
// ======================

document.getElementById("names").textContent = COUPLE;
const wd = new Date(WEDDING_DATE + "T00:00:00");
document.getElementById("dateText").textContent =
  wd.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

// Falling petals
const petalsEl = document.getElementById("petals");
["🌸", "🌷", "🌹", "🌺", "💮"].forEach((f, k) => {
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = f;
    p.style.left = Math.random() * 100 + "%";
    p.style.fontSize = 14 + Math.random() * 14 + "px";
    p.style.animationDuration = 10 + Math.random() * 10 + "s";
    p.style.animationDelay = -Math.random() * 15 + "s";
    petalsEl.appendChild(p);
  }
});

// Counter
function tick() {
  const days = Math.floor((Date.now() - wd.getTime()) / 864e5);
  const years = Math.floor(days / 365.25);
  const rest = Math.floor(days - years * 365.25);
  document.getElementById("counter").textContent = "Together for " + years + " years, " + rest + " days 💍";
}
tick();
setInterval(tick, 60000);

// Gallery
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
function addPhoto(src) {
  const d = document.createElement("div");
  d.className = "photo";
  if (src) {
    const i = document.createElement("img");
    i.src = src; i.alt = "Memory";
    d.appendChild(i);
    d.onclick = () => { lightbox.querySelector("img").src = src; lightbox.classList.add("open"); };
  } else {
    d.textContent = "🌸";
  }
  gallery.appendChild(d);
}
PHOTOS.length ? PHOTOS.forEach(addPhoto) : [1, 2, 3, 4].forEach(() => addPhoto(null));
lightbox.onclick = () => lightbox.classList.remove("open");

const fileInput = document.getElementById("fileInput");
document.getElementById("addPhotos").onclick = () => fileInput.click();
fileInput.onchange = () => {
  if (!PHOTOS.length && !gallery.dataset.custom) { gallery.innerHTML = ""; gallery.dataset.custom = "1"; }
  [...fileInput.files].forEach(f => {
    const r = new FileReader();
    r.onload = () => addPhoto(r.result);
    r.readAsDataURL(f);
  });
};

// Wishes wall (localStorage for now; replace load/save with Firebase later)
const wishesEl = document.getElementById("wishes");
function load() { try { return JSON.parse(localStorage.getItem("wishes")) || []; } catch (e) { return []; } }
function save(list) { try { localStorage.setItem("wishes", JSON.stringify(list)); } catch (e) {} }
let wishes = load();
function render() {
  wishesEl.innerHTML = "";
  wishes.slice().reverse().forEach(w => {
    const el = document.createElement("div");
    el.className = "wish";
    const p = document.createElement("p"); p.textContent = w.message;
    const s = document.createElement("small"); s.textContent = "— " + w.name + " · " + w.date;
    el.append(p, s);
    wishesEl.appendChild(el);
  });
}
document.getElementById("wishForm").onsubmit = e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!name || !message) return;
  wishes.push({ name, message, date: new Date().toLocaleDateString() });
  save(wishes); render(); e.target.reset();
};
render();
