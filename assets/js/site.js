(function () {
  document.documentElement.classList.add('has-js');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => motionQuery.matches;
  const body = document.body;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-label', expanded ? 'Menü öffnen' : 'Menü schliessen');
      body.classList.toggle('has-nav-open', !expanded);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        body.classList.remove('has-nav-open');
      }
    });
  }

  const initReveals = () => {
    const revealSelectors = [
      '.trust-strip__inner',
      '.section-head',
      '.split__text',
      '.split__figure',
      '.service-card',
      '.service-detail__copy',
      '.benefit-panel',
      '.case-card',
      '.gallery-item',
      '.press-card',
      '.cta-band__inner',
      '.contact-options',
      '.contact-form',
      '.legal-hero .shell',
      '.text-flow',
    ];
    const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(',')))
      .filter((element) => !element.closest('.site-footer'));
    if (!revealElements.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const groupedIndexes = new WeakMap();
    revealElements.forEach((element) => {
      const group = element.parentElement;
      const index = groupedIndexes.get(group) || 0;
      groupedIndexes.set(group, index + 1);
      if (element.getBoundingClientRect().top < window.innerHeight * 1.15) {
        element.classList.add('is-visible');
        return;
      }
      element.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
      element.classList.add('reveal-ready');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 22% 0px', threshold: 0.01 });

    revealElements
      .filter((element) => element.classList.contains('reveal-ready'))
      .forEach((element) => observer.observe(element));
  };

  initReveals();

  const fitTextareaToContent = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const textareas = Array.from(form.querySelectorAll('textarea'));
    textareas.forEach((textarea) => {
      fitTextareaToContent(textarea);
      textarea.addEventListener('input', () => fitTextareaToContent(textarea));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const required = Array.from(form.querySelectorAll('[required]'));
      const missing = required.filter((field) => !field.value.trim());
      const emailField = form.querySelector('input[type="email"]');
      form.classList.remove('is-success', 'is-error');
      required.forEach((field) => field.removeAttribute('aria-invalid'));
      if (missing.length) {
        missing.forEach((field) => field.setAttribute('aria-invalid', 'true'));
        form.classList.add('is-error');
        const label = form.querySelector(`label[for="${missing[0].id}"]`);
        const labelText = label ? label.textContent.replace(/\s*optional\s*/i, '').trim() : 'das markierte Feld';
        if (status) status.textContent = `Bitte ergänzen Sie: ${labelText}.`;
        missing[0].focus();
        return;
      }
      if (emailField && !emailField.checkValidity()) {
        emailField.setAttribute('aria-invalid', 'true');
        form.classList.add('is-error');
        if (status) status.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        emailField.focus();
        return;
      }
      form.reset();
      textareas.forEach((textarea) => fitTextareaToContent(textarea));
      form.classList.add('is-success');
      if (status) status.textContent = 'Danke. Ihre Nachricht ist angekommen. Ich melde mich persönlich bei Ihnen.';
    });
  });

  const lightboxButtons = document.querySelectorAll('[data-lightbox]');
  if (lightboxButtons.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML = '<button type="button" class="lightbox__close" aria-label="Ansicht schliessen">×</button><img alt="">';
    document.body.appendChild(dialog);
    const img = dialog.querySelector('img');
    const close = dialog.querySelector('button');
    lightboxButtons.forEach((button) => {
      button.addEventListener('click', () => {
        img.src = button.dataset.lightbox;
        img.alt = button.dataset.lightboxAlt || '';
        dialog.showModal();
      });
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const initBadgeOrbit = () => {
    if (prefersReducedMotion()) return;

    const orbits = document.querySelectorAll('[data-badge-orbit]');
    if (!orbits.length) return;

    const normalizeLength = (value, fallback) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const normalizeDuration = (value, fallback) => {
      const parsed = Number.parseFloat(value);
      if (!Number.isFinite(parsed)) return fallback;
      return value.trim().endsWith('ms') ? parsed : parsed * 1000;
    };

    orbits.forEach((orbit) => {
      const rail = orbit.querySelector('.site-footer__badge-orbit-rail');
      const traces = Array.from(orbit.querySelectorAll('.site-footer__badge-orbit-trace'));
      if (!rail || traces.length < 2 || typeof rail.getTotalLength !== 'function') return;

      const badge = orbit.closest('.site-footer__badge') || orbit;
      const styles = window.getComputedStyle(badge);
      const total = rail.getTotalLength();
      const baseTraceLength = total * (normalizeLength(styles.getPropertyValue('--badge-trace-length'), 8) / 100);
      const baseOpacity = normalizeLength(styles.getPropertyValue('--badge-trace-opacity'), 0.67);
      const duration = normalizeDuration(styles.getPropertyValue('--badge-orbit-duration'), 6800);
      let animationFrame = 0;
      let lastTimestamp = 0;
      let distance = 0;

      const pointAt = (value) => {
        const normalized = ((value % total) + total) % total;
        return rail.getPointAtLength(normalized);
      };

      const sideBiasAt = (value) => {
        const phase = (((value / total) % 1) + 1) % 1;
        const sideBias = Math.sin(phase * Math.PI * 2);
        return sideBias * sideBias;
      };

      const getMotionState = (value) => {
        const sideBias = sideBiasAt(value);
        return { length: baseTraceLength * (0.5 + sideBias * 1.5), opacity: Math.min(1, baseOpacity * (1 + sideBias * 0.5)), speed: 0.5 + sideBias * 1.5 };
      };

      const buildTrace = (center, length) => {
        let path = '';
        const steps = Math.max(10, Math.ceil(length / 1.25));
        const start = center - length / 2;
        for (let index = 0; index <= steps; index += 1) {
          const point = pointAt(start + (length * index) / steps);
          const command = index === 0 ? 'M' : 'L';
          path += command + ' ' + point.x.toFixed(2) + ' ' + point.y.toFixed(2) + ' ';
        }
        return path.trim();
      };

      const draw = (value) => {
        const state = getMotionState(value);
        traces[0].setAttribute('d', buildTrace(value, state.length));
        traces[1].setAttribute('d', buildTrace(value + total / 2, state.length));
        traces.forEach((trace) => { trace.style.opacity = String(state.opacity); });
      };

      const tick = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        const state = getMotionState(distance);
        distance = (distance + (elapsed / duration) * total * state.speed) % total;
        draw(distance);
        animationFrame = window.requestAnimationFrame(tick);
      };

      orbit.classList.add('is-ready');
      draw(distance);
      animationFrame = window.requestAnimationFrame(tick);
      window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });
    });
  };

  initBadgeOrbit();
})();
