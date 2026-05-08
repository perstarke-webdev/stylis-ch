# stylisch Website Draft

Static HTML/CSS/JS website draft for stylisch Wohn- und Einrichtungsberatung.

## Local preview

The repo is GitHub Pages-ready from the repository root. Docker uses the same sample setup as the KSWD reference repos:

```bash
docker compose up
```

Then open http://localhost:4000.

## GitHub Pages

Settings -> Pages -> Deploy from a branch -> select the production branch and `/(root)`. The root contains `index.html` and `.nojekyll`.

## Draft indexing

Draft noindex is controlled in one line in `assets/js/site-config.js`:

```js
window.STYLIS_SITE_CONFIG = { noindex: true };
```

Set `noindex` to `false` for launch after the final domain, CMS, legal, and tracking setup have been confirmed.

## CMS handoff notes

The frontend is plain HTML/CSS/JS. Jekyll/Docker are only used for local preview and GitHub Pages-style static serving; the templates themselves do not use Liquid, includes, layouts, front matter, or Jekyll data files.

Final estimated CMS content component count: **14**.

The component comments in the HTML use this stricter handoff logic:

1. Image hero
2. Trust strip
3. Split story
4. Service card grid
5. Service detail with benefits
6. Featured reference cards
7. Reference story list
8. Mixed media teaser grid
9. Before-after comparison grid
10. Press grid
11. Inspiration gallery
12. CTA band
13. Contact block
14. Legal page content

This count intentionally treats visually different reference and media sections as separate CMS components. The compact reference cards on the start page, the full reference stories on the references page, the before-after cards, the press cards and the simple inspiration gallery are not labelled as one shared component because their layouts and content models are materially different. Header and footer should be handled as global templates and are marked separately in the HTML. Background changes such as `section--tint`, reversed split layouts, 3- or 4-item trust strips, home/subpage hero sizing, and shorter/longer item counts are component variants, not separate components. Redirect pages are legacy routing helpers and are not intended as CMS content components.

The contact form submits to the Formspark-compatible endpoint from the Website Creation Prompt (`https://submit-form.com/qmOOtdX2O`). The URL is present both as the HTML `action` fallback and as the `data-form-endpoint` used by the sample-repo JavaScript pattern, with client-side validation, honeypot spam guard, loading, success, and failure states.
