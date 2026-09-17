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

// ------- Resume preview modal behavior -------
(function(){
  try {
    const resumeBtn = document.getElementById('resumeBtn');
    const modal = document.getElementById('resumeModal');
    const overlay = modal?.querySelector('.resume-modal__overlay');
    const closeBtn = document.getElementById('resumeClose');
    const iframe = document.getElementById('resumeIframe');
    const downloadLink = document.getElementById('resumeDownload');

    if (!resumeBtn || !modal || !iframe) return;

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (downloadLink) downloadLink.hidden = true;

      const url = 'assets/resume.pdf';
      const viewer = modal.querySelector('.resume-modal__viewer');
      const existingFallback = modal.querySelector('.resume-modal__fallback');
      if (existingFallback) existingFallback.remove();

      // Try to set iframe src; on file:// fetch checks may fail, so always set src and
      // rely on iframe load/error events to show fallback or download link.
      try { iframe.src = url; } catch (e) { /* still show modal; iframe may fail */ }
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      // clear src to stop PDF loading / audio
      iframe.src = '';
    }

    // Allow Ctrl/Meta/middle-clicks to open the raw PDF (default browser behavior).
    resumeBtn.addEventListener('click', (e) => {
      const isModifier = e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1;
      if (isModifier) {
        // Allow default navigation (open in new tab or download) for modifier clicks
        return;
      }
      e.preventDefault();
      openModal();
    });
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // When iframe finishes loading the PDF, show the download link
    iframe.addEventListener('load', () => {
      // remove any fallback message
      const existingFallback = modal.querySelector('.resume-modal__fallback');
      if (existingFallback) existingFallback.remove();
      if (downloadLink) downloadLink.hidden = false;
    });

    // If iframe errors (file missing or cannot be displayed), show a friendly message
    iframe.addEventListener('error', () => {
      const viewer = modal.querySelector('.resume-modal__viewer');
      const existingFallback = modal.querySelector('.resume-modal__fallback');
      if (existingFallback) return;
      if (downloadLink) downloadLink.hidden = true;
      const fallback = document.createElement('div');
      fallback.className = 'resume-modal__fallback';
      fallback.textContent = 'Unable to preview the resume. Try opening it in a new tab or placing assets/resume.pdf in the project.';
      viewer.appendChild(fallback);
    });

    // Allow Esc to close
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  } catch (e) { /* fail silently */ }
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
