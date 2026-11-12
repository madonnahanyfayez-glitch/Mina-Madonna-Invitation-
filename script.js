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


// RSVP: paste your deployed Google Apps Script Web App URL here after setup.
const RSVP_SHEET_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!rsvpForm.reportValidity()) return;
    if (!RSVP_SHEET_ENDPOINT.startsWith('https://script.google.com/macros/s/')) {
      rsvpStatus.textContent = 'The RSVP sheet is not connected yet. Please try again soon.';
      return;
    }
    const submitButton = rsvpForm.querySelector('.rsvp-submit');
    const formData = new FormData(rsvpForm);
    const payload = new URLSearchParams();
    for (const [key, value] of formData.entries()) payload.append(key, value);
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    rsvpStatus.textContent = '';
    try {
      // Apps Script accepts URL-encoded POSTs; no-cors avoids a browser preflight.
      await fetch(RSVP_SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: payload });
      rsvpForm.reset();
      rsvpStatus.textContent = 'Thank you for your lovely message. We can’t wait to celebrate with you! ♡';
    } catch (error) {
      rsvpStatus.textContent = 'Something went wrong. Please try again in a moment.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send your love ♡';
    }
  });
}
