const app = document.getElementById('app');
const question = document.getElementById('question');
const avatar = document.getElementById('avatar');
const bearImg = document.getElementById('bearImg');
const bearEl = bearImg || document.getElementById('bear');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const effects = document.getElementById('effects');

function showFace(mode) {
  if (avatar) {
    avatar.classList.toggle('sad', mode === 'sad');
    avatar.classList.toggle('happy', mode === 'happy');
  }
}

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function moveNoButton() {
  const padding = 16;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const bw = noBtn.offsetWidth;
  const bh = noBtn.offsetHeight;
  const maxX = Math.max(0, w - bw - padding);
  const maxY = Math.max(0, h - bh - padding);
  const x = randomInt(padding, maxX);
  const y = randomInt(padding, maxY);
  noBtn.style.position = 'fixed';
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
}

function spawnHearts(count = 32) {
  if (!bearEl || !bearEl.getBoundingClientRect) return;
  const rect = bearEl.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    const palette = ['#F0A2BC', '#F38FB3', '#FA7BA8', '#FDF2F6'];
    h.style.background = palette[i % palette.length];
    h.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width + 'px';
    h.style.top = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height + 'px';
    h.style.width = randomInt(12, 24) + 'px';
    h.style.height = h.style.width;
    h.style.animationDuration = (2 + Math.random() * 1.2) + 's';
    effects.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

function celebrateYes() {
  showFace('happy');
  question.textContent = "Yay! You're my Valentine!";
  spawnHearts(42);
}

function reactSad() {
  showFace('sad');
}

yesBtn.addEventListener('click', () => {
  celebrateYes();
});

noBtn.addEventListener('click', () => {
  moveNoButton();
  reactSad();
});

showFace('neutral');

if (bearImg) {
  bearImg.addEventListener('error', () => {
    avatar.classList.add('image-missing');
  });
}

// Try common locations if the default path is missing
if (bearImg) {
  const candidates = [
    bearImg.getAttribute('src'),
    'assets/bear.gif', './assets/bear.gif', 'bear.gif', './bear.gif',
    'assets/bear.png', './assets/bear.png', 'bear.png', './bear.png',
    'assets/bear.webp', './assets/bear.webp', 'bear.webp', './bear.webp'
  ].filter(Boolean);
  let idx = 1; // start from the next after current src
  function tryNext() {
    if (idx >= candidates.length) {
      avatar.classList.add('image-missing');
      return;
    }
    const next = candidates[idx++];
    bearImg.src = next;
  }
  bearImg.addEventListener('error', tryNext);
  bearImg.addEventListener('load', () => avatar.classList.remove('image-missing'));
}
