(function () {
  const root = document.documentElement;
  root.classList.add('has-js');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => motionQuery.matches;
  const body = document.body;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = `${new Date().getFullYear()} `;
  });

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
      '.proof-editorial__copy',
      '.value-thread li',
      '.testimonial-slider',
      '.proof-link-card',
      '.split__text',
      '.split__figure',
      '.service-card',
      '.service-detail__copy',
      '.benefit-panel',
      '.case-card',
      '.reference-story',
      '.gallery-item',
      '.gallery-overview-card',
      '.press-card',
      '.cta-band__inner',
      '.contact-options',
      '.contact-form',
      '.legal-hero .shell',
      '.text-flow',
    ];
    const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(',')))
      .filter((element) => !element.closest('.site-footer'));
    if (!revealElements.length) {
      root.classList.remove('reveal-prep');
      return;
    }

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      root.classList.remove('reveal-prep');
      return;
    }

    const groupedIndexes = new WeakMap();
    const immediateReveals = new WeakSet();
    const revealNow = [];
    revealElements.forEach((element) => {
      const group = element.parentElement;
      const index = groupedIndexes.get(group) || 0;
      groupedIndexes.set(group, index + 1);
      element.style.setProperty('--reveal-delay', `${Math.min(index * 85, 340)}ms`);
      element.classList.add('reveal-ready');
      if (element.getBoundingClientRect().top < window.innerHeight * 0.96) {
        immediateReveals.add(element);
        revealNow.push(element);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 0px 0px', threshold: 0.08 });

    if (revealNow.length) {
      window.requestAnimationFrame(() => {
        revealNow.forEach((element) => element.classList.add('is-visible'));
      });
    }

    revealElements
      .filter((element) => element.classList.contains('reveal-ready') && !immediateReveals.has(element))
      .forEach((element) => observer.observe(element));

    root.classList.remove('reveal-prep');
  };

  initReveals();

  document.querySelectorAll('[data-testimonial-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
    const dots = Array.from(slider.querySelectorAll('.testimonial-slider__dot'));
    const previous = slider.querySelector('[data-testimonial-prev]');
    const next = slider.querySelector('[data-testimonial-next]');
    if (slides.length < 2 || dots.length !== slides.length) return;
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let timer = 0;
    let touchStartX = 0;

    const setActive = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
        dot.setAttribute('aria-pressed', String(dotIndex === index));
      });
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = 0;
    };

    const start = () => {
      if (timer || document.hidden) return;
      timer = window.setInterval(() => setActive(index + 1), 6200);
    };

    const restart = () => {
      stop();
      start();
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        setActive(dotIndex);
        restart();
      });
    });
    if (previous) {
      previous.addEventListener('click', () => {
        setActive(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', () => {
        setActive(index + 1);
        restart();
      });
    }
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    slider.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    slider.addEventListener('touchend', (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) >= 38) setActive(index + (deltaX > 0 ? -1 : 1));
      start();
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
        return;
      }
      start();
    });
    setActive(index);
    start();
  });

  document.querySelectorAll('.reference-story__more').forEach((details) => {
    const story = details.closest('.reference-story');
    if (!story) return;
    const collapsibleContent = Array.from(details.children).filter((child) => child.tagName.toLowerCase() !== 'summary');
    let hasToggled = false;
    const syncExpandedState = () => {
      story.classList.toggle('reference-story--expanded', details.open);
      collapsibleContent.forEach((child) => {
        child.hidden = !details.open;
      });
      if (hasToggled && !details.open) {
        details.style.height = `${details.querySelector('summary')?.offsetHeight || 44}px`;
        story.style.display = 'block';
        story.offsetHeight;
        window.requestAnimationFrame(() => {
          story.style.display = '';
          details.style.height = '';
        });
      }
    };
    syncExpandedState();
    details.addEventListener('toggle', () => {
      hasToggled = true;
      syncExpandedState();
    });
  });

  const fitTextareaToContent = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const submitFormsparkPayload = (endpoint, payload) => {
    const formData = new URLSearchParams();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== '') {
        formData.append(key, payload[key]);
      }
    });

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Formspark request failed');
      }
      return response.text();
    });
  };

  const refreshFormGuard = (form) => {
    form.setAttribute('data-form-started-at', String(Date.now()));
  };

  const getHoneypotValue = (form) => {
    const field = form.querySelector("input[name='_honeypot']");
    return field ? (field.value || '').trim() : '';
  };

  const isFormSubmittedTooFast = (form) => {
    const startedAt = parseInt(form.getAttribute('data-form-started-at') || '', 10);
    const minSubmitMs = parseInt(form.getAttribute('data-form-min-submit-ms') || '', 10);

    if (Number.isNaN(startedAt) || Number.isNaN(minSubmitMs)) {
      return false;
    }

    return Date.now() - startedAt < minSubmitMs;
  };

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    refreshFormGuard(form);
    const endpoint = form.getAttribute('data-form-endpoint') || '';
    const status = form.querySelector('[data-form-status]');
    const success = form.querySelector('[data-form-success]');
    const button = form.querySelector('button[type="submit"]');
    const submitLabel = button ? button.getAttribute('data-submit-label') || button.textContent.trim() : '';
    const loadingLabel = button ? button.getAttribute('data-loading-label') || 'Nachricht wird gesendet ...' : '';
    const successLabel = button ? button.getAttribute('data-success-label') || 'Nachricht gesendet' : '';
    const buttonContent = button ? button.innerHTML : '';
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
      if (success) success.hidden = true;
      if (status) status.textContent = '';
      required.forEach((field) => field.removeAttribute('aria-invalid'));
      if (getHoneypotValue(form)) {
        form.reset();
        textareas.forEach((textarea) => fitTextareaToContent(textarea));
        refreshFormGuard(form);
        if (success) success.hidden = false;
        return;
      }
      if (isFormSubmittedTooFast(form)) {
        form.classList.add('is-error');
        if (status) status.textContent = 'Bitte warten Sie einen Moment und senden Sie das Formular erneut.';
        return;
      }
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
      if (!endpoint || !button) {
        form.classList.add('is-error');
        if (status) status.textContent = 'Das Formular ist noch nicht vollständig verbunden. Bitte schreiben Sie per WhatsApp oder E-Mail.';
        return;
      }

      const payload = {};
      new FormData(form).forEach((value, key) => {
        if (key !== '_honeypot') {
          payload[key] = typeof value === 'string' ? value.trim() : value;
        }
      });
      payload.submittedAt = new Date().toISOString();

      button.disabled = true;
      button.textContent = loadingLabel;
      if (status) status.textContent = 'Ihre Nachricht wird gesendet ...';

      submitFormsparkPayload(endpoint, payload)
        .then((response) => {
          form.reset();
          textareas.forEach((textarea) => fitTextareaToContent(textarea));
          refreshFormGuard(form);
          form.classList.add('is-success');
          button.textContent = successLabel;
          if (status) status.textContent = '';
          if (success) success.hidden = false;
        })
        .catch(() => {
          form.classList.add('is-error');
          button.innerHTML = buttonContent;
          if (status) status.textContent = 'Das Senden hat gerade nicht geklappt. Bitte schreiben Sie per WhatsApp oder E-Mail.';
        })
        .finally(() => {
          window.setTimeout(() => {
            button.disabled = false;
            if (button.textContent === successLabel || button.textContent === submitLabel || button.textContent === loadingLabel) {
              button.innerHTML = buttonContent;
            }
          }, 1800);
        });
    });
  });

  const lightboxButtons = document.querySelectorAll('[data-lightbox], [data-lightbox-gallery]');
  const overviewButtons = document.querySelectorAll('[data-gallery-overview], [data-gallery-overview-url]');
  if (lightboxButtons.length || overviewButtons.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML = [
      '<div class="lightbox__frame">',
      '<button type="button" class="lightbox__close" aria-label="Ansicht schliessen"><span class="control-icon control-icon--close" aria-hidden="true"></span></button>',
      '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Vorheriges Bild"><span class="control-icon control-icon--prev" aria-hidden="true"></span></button>',
      '<figure class="lightbox__figure">',
      '<img alt="">',
      '<figcaption class="lightbox__caption"><span data-lightbox-caption></span><span class="lightbox__counter" data-lightbox-counter></span></figcaption>',
      '</figure>',
      '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Nächstes Bild"><span class="control-icon control-icon--next" aria-hidden="true"></span></button>',
      '</div>',
    ].join('');
    document.body.appendChild(dialog);
    const img = dialog.querySelector('img');
    const close = dialog.querySelector('.lightbox__close');
    const previous = dialog.querySelector('.lightbox__nav--prev');
    const next = dialog.querySelector('.lightbox__nav--next');
    const caption = dialog.querySelector('[data-lightbox-caption]');
    const counter = dialog.querySelector('[data-lightbox-counter]');
    let gallery = [];
    let galleryIndex = 0;
    let touchStartX = 0;

    const parseItems = (value) => {
      try {
        const items = JSON.parse(value);
        if (Array.isArray(items) && items.length) return items;
      } catch (error) {
        return [];
      }
      return [];
    };

    const parseGallery = (button) => {
      if (button.dataset.lightboxGallery) {
        return parseItems(button.dataset.lightboxGallery);
      }
      if (!button.dataset.lightbox) return [];
      return [{ src: button.dataset.lightbox, alt: button.dataset.lightboxAlt || '', caption: button.dataset.lightboxAlt || '' }];
    };

    const renderLightbox = () => {
      const item = gallery[galleryIndex];
      if (!item) return;
      img.src = item.src;
      img.alt = item.alt || '';
      caption.textContent = item.caption || item.alt || '';
      counter.textContent = gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
      const hasMultiple = gallery.length > 1;
      previous.hidden = !hasMultiple;
      next.hidden = !hasMultiple;
    };

    const moveLightbox = (direction) => {
      if (gallery.length < 2) return;
      galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length;
      renderLightbox();
    };

    const openLightbox = (items, startIndex) => {
      if (!items.length) return;
      gallery = items;
      galleryIndex = Math.max(0, Math.min(startIndex || 0, gallery.length - 1));
      renderLightbox();
      dialog.showModal();
      close.focus({ preventScroll: true });
    };

    lightboxButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const startIndex = Number.parseInt(button.dataset.lightboxStart || '0', 10);
        openLightbox(parseGallery(button), Number.isNaN(startIndex) ? 0 : startIndex);
      });
    });
    close.addEventListener('click', () => dialog.close());
    previous.addEventListener('click', () => moveLightbox(-1));
    next.addEventListener('click', () => moveLightbox(1));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    dialog.addEventListener('touchend', (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) < 44) return;
      moveLightbox(deltaX > 0 ? -1 : 1);
    }, { passive: true });
    document.addEventListener('keydown', (event) => {
      if (!dialog.open) return;
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    });

    if (overviewButtons.length) {
      const overviewDialog = document.createElement('dialog');
      overviewDialog.className = 'gallery-overview';
      overviewDialog.innerHTML = [
        '<div class="gallery-overview__shell">',
        '<div class="gallery-overview__head">',
        '<div><h2>Alle Vorher-Nachher-Bilder</h2><p>Übersicht öffnen, durchscrollen und einzelne Bilder gross ansehen.</p></div>',
        '<button type="button" class="gallery-overview__close" aria-label="Galerie schliessen"><span class="control-icon control-icon--close" aria-hidden="true"></span></button>',
        '</div>',
        '<div class="gallery-overview__grid" data-gallery-overview-grid></div>',
        '</div>',
      ].join('');
      document.body.appendChild(overviewDialog);
      const overviewClose = overviewDialog.querySelector('.gallery-overview__close');
      const overviewGrid = overviewDialog.querySelector('[data-gallery-overview-grid]');
      let overviewItems = [];

      const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      const renderOverview = (items) => {
        overviewItems = items;
        const cards = items
          .map((item, itemIndex) => ({ ...item, sourceIndex: itemIndex }))
          .filter((item) => String(item.tag || '').toUpperCase() !== 'VORHER');
        overviewGrid.innerHTML = cards.map((item) => [
          `<div class="gallery-overview-card" role="button" tabindex="0" data-gallery-index="${item.sourceIndex}">`,
          `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || item.caption)}" loading="lazy" decoding="async">`,
          `<strong>${escapeHtml(item.tag || '')}</strong>`,
          `<span>${escapeHtml(item.caption || item.alt || '')}</span>`,
          '</div>',
        ].join('')).join('');
      };

      const getOverviewItems = (button) => {
        if (button.dataset.galleryOverviewUrl) {
          return fetch(button.dataset.galleryOverviewUrl)
            .then((response) => {
              if (!response.ok) throw new Error('Gallery overview could not be loaded');
              return response.json();
            })
            .then((items) => (Array.isArray(items) ? items : []))
            .catch(() => []);
        }
        return Promise.resolve(parseItems(button.dataset.galleryOverview || '[]'));
      };

      overviewButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const originalLabel = button.innerHTML;
          button.disabled = true;
          getOverviewItems(button).then((items) => {
            button.disabled = false;
            button.innerHTML = originalLabel;
            if (!items.length) return;
            renderOverview(items);
            overviewDialog.showModal();
            overviewClose.focus({ preventScroll: true });
          });
        });
      });
      overviewGrid.addEventListener('click', (event) => {
        const card = event.target.closest('[data-gallery-index]');
        if (!card) return;
        overviewDialog.close();
        openLightbox(overviewItems, Number(card.dataset.galleryIndex) || 0);
      });
      overviewGrid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('[data-gallery-index]');
        if (!card) return;
        event.preventDefault();
        overviewDialog.close();
        openLightbox(overviewItems, Number(card.dataset.galleryIndex) || 0);
      });
      overviewClose.addEventListener('click', () => overviewDialog.close());
      overviewDialog.addEventListener('click', (event) => {
        if (event.target === overviewDialog) overviewDialog.close();
      });
    }
  }

  const initBadgeOrbit = () => {
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
        traces.forEach((trace) => { trace.style.opacity = state.opacity.toFixed(3); });
      };

      const tick = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;
        const state = getMotionState(distance);
        distance = (distance + (elapsed / duration) * total * state.speed) % total;
        draw(distance);
        lastTimestamp = timestamp;
        animationFrame = window.requestAnimationFrame(tick);
      };

      draw(distance);
      orbit.classList.add('is-ready');

      if (prefersReducedMotion()) return;

      animationFrame = window.requestAnimationFrame(tick);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          return;
        }
        if (!document.hidden && !animationFrame) {
          lastTimestamp = 0;
          animationFrame = window.requestAnimationFrame(tick);
        }
      });
    });
  };

  initBadgeOrbit();
})();
