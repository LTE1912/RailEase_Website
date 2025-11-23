const plannerForm = document.getElementById('planner-form');
const results = document.getElementById('results');
const liveMeter = document.getElementById('live-meter');
const nav = document.querySelector('.site-header');
const scrollButtons = document.querySelectorAll('[data-scroll]');
const chips = document.querySelectorAll('.chip');
const accordionItems = document.querySelectorAll('.accordion__item');

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildResultCard(route) {
  const card = document.createElement('article');
  card.className = 'result-card';
  card.innerHTML = `
    <div class="result-card__meta">
      <strong>${route.from} → ${route.to}</strong>
      <span>${route.duration}</span>
      <span>${route.transfers} transfers</span>
      <span>${route.train}</span>
    </div>
    <p class="muted">Depart ${route.depart} · Arrive ${route.arrive} · From €${route.price}</p>
  `;
  return card;
}

function createResults(from, to, date, time) {
  const base = new Date(`${date}T${time}`);
  const options = [45, 90, 140].map((offset, i) => {
    const depart = new Date(base.getTime() + offset * 60000);
    const arrive = new Date(depart.getTime() + (90 + i * 25) * 60000);
    return {
      from,
      to,
      depart: formatTime(depart),
      arrive: formatTime(arrive),
      duration: `${1 + i}:${(30 + i * 10).toString().padStart(2, '0')} hrs`,
      transfers: i === 0 ? 0 : 1,
      train: i === 1 ? 'Night train' : 'High-speed',
      price: (39 + i * 18).toFixed(0),
    };
  });

  results.innerHTML = '';
  options.forEach((opt) => results.appendChild(buildResultCard(opt)));
}

function updateLiveMeter() {
  const now = new Date();
  const nextDeparture = new Date(now.getTime() + 22 * 60000);
  liveMeter.textContent = `Next trains syncing — ${formatTime(nextDeparture)}`;
}

plannerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const { from, to, date, time } = plannerForm.elements;
  createResults(from.value, to.value, date.value, time.value);
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const [from, to] = chip.dataset.route.split(' ');
    plannerForm.elements.from.value = from;
    plannerForm.elements.to.value = to;
    const today = new Date().toISOString().split('T')[0];
    plannerForm.elements.date.value = today;
    createResults(from, to, today, plannerForm.elements.time.value || '09:00');
  });
});

scrollButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

accordionItems.forEach((item) => {
  const header = item.querySelector('header');
  header.addEventListener('click', () => item.classList.toggle('active'));
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

updateLiveMeter();
setInterval(updateLiveMeter, 60000);
