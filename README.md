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

The static build uses the 10 component groups from the briefing. Component comments are present in the HTML for Webnet/PSWD CMS mapping. The contact form currently shows a local success state only and does not submit to a third-party form backend; it is prepared for later CMS/AWS handling.
