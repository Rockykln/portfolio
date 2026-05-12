# Deploy

This portfolio is a pile of static files. It will run on any HTTP
server, but the canonical target is **Cloudflare Workers** (Static
Assets), matching the rest of the `key64` infrastructure.

## Local

Pick whichever is on your machine:

```bash
# Python (built-in) — from the repo root
python3 -m http.server 8000

# Node / serve (no install needed)
npx --yes serve . -l 8000
```

For a higher-fidelity preview that also evaluates `_headers` and
`_redirects` locally:

```bash
npx --yes wrangler dev
```

Then open <http://localhost:8000> (or whatever port Wrangler picks).

## Cloudflare Workers (production)

The deploy target is a Worker with **Static Assets**, configured in
[`wrangler.jsonc`](../wrangler.jsonc):

```jsonc
{
  "name": "rockykln-portfolio",
  "compatibility_date": "2026-05-07",
  "observability": { "enabled": true },
  "assets": {
    "directory": "./",
    "not_found_handling": "404-page"
  }
}
```

> `not_found_handling: "404-page"` means a missing route serves
> `404.html` with a 404 status — exactly what we want.

### One-shot deploy

```bash
npx --yes wrangler deploy
```

Wrangler will auth via browser on first run. All subsequent deploys
reuse the saved credentials.

### Custom domain

In the Cloudflare dashboard:

1. Workers & Pages → **rockykln-portfolio**
2. Settings → Domains & Routes → **Add Custom Domain**
3. Enter `rockykln.com` (and optionally `www.rockykln.com`)

DNS for `rockykln.com` should already point to Cloudflare; the
worker route will be wired up automatically.

## Headers / CSP

[`_headers`](../_headers) is the source of truth for:

- HSTS (1y, includeSubDomains, preload)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- A strict CSP — see below
- Cache-Control (immutable for `/css/*` and `/js/*`)

### CSP

```
default-src 'none';
script-src 'self';
style-src  'self' fonts.googleapis.com 'unsafe-inline';
img-src    'self' data:;
font-src   fonts.gstatic.com;
connect-src 'self' api.github.com;
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

The third-party hosts:

- `fonts.googleapis.com` / `fonts.gstatic.com` — typography
- `api.github.com` — `connect-src` only, used to fetch `tag_name` from
  `/repos/Rockykln/clientctl/releases/latest` and
  `/repos/Rockykln/refrain/releases/latest`. Results are cached in
  localStorage for one hour. The portfolio works fine without it — the
  LV pill is simply hidden on failure (no stale fallback shown).

If/when fonts move to `cdn.key64.com` (or `cdn.rockykln.com`), update
`style-src` and `font-src` accordingly and remove the Google domains.

## Rollbacks

Wrangler keeps deploy history. To roll back:

```bash
npx --yes wrangler deployments list
npx --yes wrangler rollback <deployment-id>
```

## Smoke test

After every deploy:

- [ ] `/` loads, hero animates, fonts arrive
- [ ] Quest cards link to `key64.com`, `clientctl`, `refrain` (incl. PyPI)
- [ ] LV pills update from `LV …` to actual GitHub release tags within ~1s
- [ ] Theme toggle flips day ↔ night, stars + moon appear, choice persists across reload
- [ ] Penguin click triggers a jump and a hop counter
- [ ] Talk dialog types itself out when scrolled into view
- [ ] `/totally-not-a-page` returns the styled 404 (with theme respected)
- [ ] `mailto:contact@rockykln.com` opens the user's mail client
- [ ] DevTools shows zero CSP violations
- [ ] Lighthouse mobile ≥ 95 in Performance / A11y / Best Practices / SEO
