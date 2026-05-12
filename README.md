# rockykln · portfolio

> Have fun and be yourself.

Pixel-art platformer of a portfolio. The page IS a tiny indie-game
title screen — sky, grass, drifting clouds, and the rockykln penguin
standing on the world.

[![status](https://img.shields.io/badge/status-v1.0.0-blue.svg)](#)
[![stack](https://img.shields.io/badge/stack-vanilla-orange.svg)](#)
[![deploy](https://img.shields.io/badge/deploy-cloudflare%20workers-f38020.svg)](#)
[![vibe](https://img.shields.io/badge/vibe-pixel%20art-9bd957.svg)](#)
[![mode](https://img.shields.io/badge/mode-day%20%E2%86%94%20night-45B0E8.svg)](#)

## What you get

- A **hero scene**: sky gradient, drifting pixel clouds, two pixel pigeons,
  a chunky "rockykln" headline in Press Start 2P, the penguin on grass.
  Click the penguin — it hops.
- A **Quest log** with three custom 16×16 pixel chests:
  - **key64** — wooden chest with golden lock (LV ∞)
  - **clientctl** — CRT monitor with traffic-light dots and CPU bars
  - **refrain** — orange boombox with speakers and floating notes (incl. PyPI link)
  - LV pills are **live** — fetched from GitHub Releases on page load, cached in localStorage for 1h, with safe fallback.
- An **Achievements** section: six pixel badges for the working
  principles I keep replaying.
- A **Talk** dialog styled like a JRPG conversation box. The body text
  **types itself out** when scrolled into view, with a blinking caret.
- A **404** that's a "Game over" screen on the same world.
- **Day ↔ night theme toggle** with sun/moon icons, persisted in
  localStorage. Defaults to `prefers-color-scheme`. Night mode adds a
  pixel moon, expanded starfield, and a moonlit halo on the penguin.
- Animations everywhere, all wrapped in `prefers-reduced-motion`.

## Stack

| Layer    | Choice                                                            |
|----------|-------------------------------------------------------------------|
| Hosting  | Cloudflare Workers (Static Assets)                                |
| Display  | Press Start 2P (titles, labels, buttons)                          |
| Body     | Outfit 400/600/700 (descriptions, prose, emphasis)                |
| Mono     | VT323 (level pills, footer copy)                                  |
| CSS      | Vanilla — no framework, no build step                             |
| JS       | Vanilla — `IntersectionObserver` + year stamp only                |
| Icons    | Hand-drawn 16×16 SVG (each project, each achievement)             |
| Mascot   | The user's existing pixel penguin avatar                          |

Total payload: HTML 33 KB + CSS 36 KB + JS 8.5 KB ≈ **~78 KB** of code,
plus fonts (Google CDN, cached) and the penguin webp (~41 KB). Hero LCP
image is preloaded with `fetchpriority="high"`. Banner shrunk from
766 KB to **36 KB** (used as social card).

## Structure

```
/
├── index.html              # The game world
├── 404.html                # Game over screen
├── manifest.json           # PWA manifest (sky-blue theme)
├── robots.txt
├── sitemap.xml
├── _redirects
├── _headers                # Security + CSP + cache rules
├── wrangler.jsonc          # Cloudflare Workers config
├── css/
│   └── style.css           # Single stylesheet (all the pixel rules)
├── js/
│   └── main.js             # Year stamp + scroll reveal
├── icons/
│   ├── favicon.svg               # Pixel penguin, 16×16
│   ├── penguin.webp              # Mascot avatar (nav/hero/dialog)
│   ├── apple-touch-icon.png      # 180×180 (Apple)
│   ├── icon-192.png              # 192×192 (PWA / Android)
│   ├── icon-512.png              # 512×512 (PWA splash)
│   ├── icon-maskable-512.png     # 512×512 maskable (Android adaptive)
│   ├── banner-og.jpg             # 1200×630, OG/Twitter card (62 KB)
│   ├── banner-og.webp            # 1200×630, OG/Twitter card (36 KB)
│   ├── banner.webp               # 1600×900, body asset (40 KB)
│   ├── banner-tiny.webp          # 24×14 placeholder (216 B)
│   ├── banner.jpg                # 1920×1080 source (excluded from deploy)
│   └── og.svg                    # Vector OG fallback
├── humans.txt                    # Credits (per humanstxt.org)
├── .well-known/
│   └── security.txt              # Disclosure contact (RFC 9116)
└── docs/
    ├── DESIGN.md           # Aesthetic rules, tokens, motion
    └── DEPLOY.md           # Cloudflare deployment notes
```

## Run locally

```bash
# Python (built-in) — from the repo root
python3 -m http.server 8000

# or with Wrangler (full headers + redirects fidelity)
npx --yes wrangler dev
```

Open <http://localhost:8000>.

## Deploy

```bash
npx --yes wrangler deploy
```

See [docs/DEPLOY.md](docs/DEPLOY.md) for the full playbook.

## Design

See [docs/DESIGN.md](docs/DESIGN.md) for color tokens, pixel rules,
motion timings, and the per-component fingerprint.

## License

Personal — content (text, biography, project descriptions) is mine.
The penguin avatar belongs to me. The pixel scaffolding (HTML/CSS) is
yours to fork; please replace my name, links and avatar before publishing.
