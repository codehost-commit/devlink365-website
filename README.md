# DevLink365 — website

The marketing site and documentation for [devlink365.dev](https://devlink365.dev).

Static HTML, one stylesheet, one script. No build step, no framework, no
dependencies — which means it deploys unchanged to GitHub Pages, Vercel,
Netlify, Cloudflare Pages, or any bucket that serves files.

```
website/
├── index.html          the marketing site
├── docs.html           the documentation
├── 404.html
├── assets/
│   ├── css/site.css    the whole design system
│   ├── js/config.js    ← the npm and GitHub URLs live here
│   ├── js/site.js      link wiring, copy button, scroll reveal, mobile nav
│   └── img/            favicon and logo mark
├── vercel.json         headers and clean URLs for Vercel
├── .nojekyll           tells GitHub Pages to serve _-prefixed paths as-is
├── robots.txt
└── sitemap.xml
```

## Setting the npm and GitHub links

Both are deliberately unset. Open `assets/js/config.js`:

```js
window.DEVLINK365_LINKS = {
  npm: null,
  github: null,
};
```

While a value is `null`, every button, nav item and footer link pointing at it
renders visibly but disabled, with a "Coming soon" tooltip. Fill one in and it
becomes a working link everywhere on the site — there is nothing else to edit.

```js
window.DEVLINK365_LINKS = {
  npm: "https://www.npmjs.com/package/devlink365",
  github: "https://github.com/your-account/devlink365",
};
```

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then, since this is a static site running on localhost:

```bash
npx devlink365
```

## Design

The visual language is inherited from StackCircuit365: warm off-white ground,
true black type, a single deep green accent, square corners everywhere, and
monospace reserved for labels, commands, and machine output. Every token lives
at the top of `assets/css/site.css`.
