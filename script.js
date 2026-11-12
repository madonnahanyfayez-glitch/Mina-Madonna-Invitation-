const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.paper-section,.church-section,.gatz-section,.final-section,.reveal,.wedding-title-page,.calendar-page,.engagement-page').forEach(section => revealObserver.observe(section));
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

// Envelope opening: preserve the original first page, then reveal the Cordially page.
const coverPage = document.getElementById('cover');
const openEnvelopeButton = document.getElementById('openBtn');
const tapNoteButton = document.getElementById('tapNote');
let envelopeOpened = false;
function openEnvelope() {
  if (envelopeOpened || !coverPage) return;
  envelopeOpened = true;
  coverPage.classList.add('open');
  // Start the soundtrack from the same tap that opens the envelope.
  // This is the earliest reliable user gesture for iOS/Safari autoplay rules.
  startWeddingMusic();
  const cordiallyPage = document.getElementById('cordially');
  window.setTimeout(() => {
    if (cordiallyPage) cordiallyPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1150);
}
if (openEnvelopeButton) openEnvelopeButton.addEventListener('click', openEnvelope);
if (tapNoteButton) tapNoteButton.addEventListener('click', openEnvelope);

// Wedding soundtrack: starts after the guest opens the invitation (a user gesture).
const weddingMusic = document.getElementById('weddingMusic');
const musicToggle = document.getElementById('musicToggle');
function updateMusicButton(isPlaying) {
  if (!musicToggle) return;
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.innerHTML = isPlaying ? '♫ <span>Pause music</span>' : '♫ <span>Play music</span>';
}
async function startWeddingMusic() {
  if (!weddingMusic) return;
  try { await weddingMusic.play(); updateMusicButton(true); }
  catch (_) { updateMusicButton(false); }
}
if (musicToggle && weddingMusic) {
  musicToggle.addEventListener('click', async () => {
    if (weddingMusic.paused) await startWeddingMusic();
    else { weddingMusic.pause(); updateMusicButton(false); }
  });
  weddingMusic.addEventListener('ended', () => updateMusicButton(false));
}
