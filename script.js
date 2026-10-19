const cover = document.getElementById('cover');
const openBtn = document.getElementById('openBtn');
if (cover && openBtn) {
  openBtn.setAttribute('aria-expanded', 'false');
  openBtn.addEventListener('click', () => {
    cover.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    const reveal = document.getElementById('coverReveal');
    if (reveal) reveal.setAttribute('aria-live', 'polite');
  });
}
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.paper-section,.church-section,.final-section,.reveal').forEach(section => revealObserver.observe(section));
function updateCountdown(){
 const target = new Date('2026-11-22T19:00:00+02:00').getTime();
 const el = document.getElementById('countdown'); if(!el) return;
 const diff = target - Date.now();
 if(diff <= 0){el.textContent='The celebration day is here!';return;}
 const days=Math.floor(diff/86400000), hours=Math.floor(diff%86400000/3600000), mins=Math.floor(diff%3600000/60000), secs=Math.floor(diff%60000/1000);
 el.innerHTML = `<span><b>${days}</b>days</span><span><b>${hours}</b>hours</span><span><b>${mins}</b>minutes</span><span><b>${secs}</b>seconds</span>`;
}
updateCountdown(); setInterval(updateCountdown,1000);
