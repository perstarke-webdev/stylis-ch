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

Final CMS content block count:

1. Hero
2. Trust strip
3. Split story
4. Service grid
5. Service detail
6. Case grid
7. Media grid, including gallery and press-card variants
8. CTA band
9. Contact block

Header and footer should be handled as global templates. Legal pages can use a simple legal template, not a separate marketing content component. Background changes such as `section--tint`, reversed split layouts, 3- or 4-item trust strips, and home/subpage hero sizing are component variants, not separate components.

The contact form currently shows a local success state only and does not submit to a third-party form backend; it is prepared for later CMS/AWS handling.
