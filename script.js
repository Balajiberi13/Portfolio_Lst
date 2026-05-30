document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Thank you! Your message has been sent.');
});

// ------- Custom cursor (desktop) -------
(function(){
  try {
    const existing = document.getElementById('customCursor');
    const cursor = existing || document.createElement('div');
    cursor.id = 'customCursor';
    cursor.className = 'custom-cursor';
    if (!existing) document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let posX = mouseX, posY = mouseY;
    const speed = 0.18;

    function animate() {
      posX += (mouseX - posX) * speed;
      posY += (mouseY - posY) * speed;
      cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    }, {passive:true});

    document.addEventListener('mousedown', () => cursor.classList.add('custom-cursor--active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('custom-cursor--active'));

    // Remove custom cursor on touch devices
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
      cursor.remove();
    } else {
      requestAnimationFrame(animate);
    }
  } catch (e) {
    // fail silently
  }
})();

// ------- Scroll reveal using IntersectionObserver -------
(function(){
  try {
    const selector = '.section, .stack-card, .project-card, .experience-card, .stat-card, .website-card';
    const els = Array.from(document.querySelectorAll(selector));
    els.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal--active');
      });
    }, { threshold: 0.12 });

    els.forEach(el => io.observe(el));
  } catch (e) { }
})();
