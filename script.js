const cover = document.getElementById('cover');
const openBtn = document.getElementById('openBtn');
const tapNote = document.getElementById('tapNote');
function openInvitation() {
  if (!cover || cover.classList.contains('open')) return;
  cover.classList.add('open');
  [openBtn, tapNote].forEach(button => {
    if (button) {
      button.setAttribute('aria-expanded', 'true');
      button.disabled = true;
    }
  });
}
if (openBtn) openBtn.addEventListener('click', openInvitation);
if (tapNote) tapNote.addEventListener('click', openInvitation);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.paper-section,.church-section,.gatz-section,.final-section,.reveal').forEach(section => revealObserver.observe(section));
function updateCountdown() {
  const target = new Date('2026-11-22T19:00:00+02:00').getTime();
  const el = document.getElementById('countdown');
  if (!el) return;
  const diff = target - Date.now();
  if (diff <= 0) { el.textContent = 'The celebration day is here!'; return; }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff % 86400000 / 3600000);
  const mins = Math.floor(diff % 3600000 / 60000);
  const secs = Math.floor(diff % 60000 / 1000);
  el.innerHTML = `<span><b>${days}</b>days</span><span><b>${hours}</b>hours</span><span><b>${mins}</b>minutes</span><span><b>${secs}</b>seconds</span>`;
}
updateCountdown();
setInterval(updateCountdown, 1000);
