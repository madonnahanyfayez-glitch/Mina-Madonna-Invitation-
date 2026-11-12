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


// RSVP: send through a native HTML form to avoid Safari fetch/CORS hanging.
const RSVP_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxcvMUo03akfDIlz9HgBVETiLgAIqkQx_9Ftf8StQ8ad10jv7jxBKdoh-PZAMyRNdT/exec';
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
if (rsvpForm && rsvpStatus) {
  rsvpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!rsvpForm.reportValidity()) return;

    const submitButton = rsvpForm.querySelector('.rsvp-submit');
    if (!submitButton || submitButton.disabled) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    rsvpStatus.textContent = '';

    // A regular form POST to a hidden iframe avoids cross-origin fetch issues
    // seen in mobile Safari with Google Apps Script redirects.
    let frame = document.getElementById('rsvpSubmitFrame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.name = 'rsvpSubmitFrame';
      frame.id = 'rsvpSubmitFrame';
      frame.style.display = 'none';
      frame.setAttribute('aria-hidden', 'true');
      document.body.appendChild(frame);
    }

    const postForm = document.createElement('form');
    postForm.method = 'POST';
    postForm.action = RSVP_SHEET_ENDPOINT;
    postForm.target = frame.name;
    postForm.style.display = 'none';

    for (const [key, value] of new FormData(rsvpForm).entries()) {
      const field = document.createElement('input');
      field.type = 'hidden';
      field.name = key;
      field.value = String(value);
      postForm.appendChild(field);
    }

    document.body.appendChild(postForm);
    let finished = false;
    const finish = (message, resetForm) => {
      if (finished) return;
      finished = true;
      clearTimeout(fallbackTimer);
      submitButton.disabled = false;
      submitButton.textContent = 'Send your love ♡';
      rsvpStatus.textContent = message;
      if (resetForm) rsvpForm.reset();
      postForm.remove();
    };

    // The iframe's first load is its initial blank page; wait for the POST load.
    let sawInitialLoad = false;
    frame.addEventListener('load', function onFrameLoad() {
      if (!sawInitialLoad) { sawInitialLoad = true; return; }
      frame.removeEventListener('load', onFrameLoad);
      finish('Thank you for your lovely message. We can’t wait to celebrate with you! ♡', true);
    }, { once: false });

    const fallbackTimer = setTimeout(() => {
      finish('Your response may still be processing. If it does not appear in the RSVP sheet, please try again.', false);
    }, 15000);

    postForm.submit();
  });
}
