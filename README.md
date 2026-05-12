# rockykln · portfolio

> Have fun and be yourself.

Pixel-art platformer of a portfolio. The page IS a tiny indie-game
title screen — sky, grass, drifting clouds, and the rockykln penguin
standing on the world.

[![status](https://img.shields.io/badge/status-v1.0.0-blue.svg)](#)
[![stack](https://img.shields.io/badge/stack-vanilla-orange.svg)](#)
[![vibe](https://img.shields.io/badge/vibe-pixel%20art-9bd957.svg)](#)
[![mode](https://img.shields.io/badge/mode-day%20%E2%86%94%20night-45B0E8.svg)](#)

Live: **<https://rockykln.de>**  (www.rockykln.com redirects here)

## What you get

- A **hero scene**: sky gradient, drifting pixel clouds, two pixel pigeons,
  a chunky "rockykln" headline in Press Start 2P, the penguin on grass.
  Click the penguin — it hops.
- A **Quest log** with three custom 16×16 pixel chests:
  - **key64** — wooden chest with golden lock (LV ∞)
  - **clientctl** — CRT monitor with traffic-light dots and CPU bars
  - **refrain** — orange boombox with speakers and floating notes (incl. PyPI link)
  - LV pills are **live** — fetched from GitHub Releases on page load,
    cached in localStorage for 1 h. Hidden cleanly on API failure.
- An **Achievements** section: six pixel badges for the working
  principles I keep replaying.
- A **Talk** dialog styled like a JRPG conversation box. The body text
  **types itself out** when scrolled into view, with a blinking caret.
- A **404** that's a "Game over" screen on the same world.
- **Day ↔ night theme toggle** by clicking the sun (day) or moon
  (night) themselves. Persisted in localStorage; defaults to
  `prefers-color-scheme`. Night mode adds a pixel moon, expanded
  starfield, and a moonlit halo on the penguin.
- Animations everywhere, all wrapped in `prefers-reduced-motion`.

## Stack

| Layer    | Choice                                                            |
|----------|-------------------------------------------------------------------|
| Display  | Press Start 2P (titles, labels, buttons)                          |
| Body     | Outfit 400/600/700 (descriptions, prose, emphasis)                |
| Mono     | VT323 (level pills, footer copy)                                  |
| CSS      | Vanilla — no framework, no build step                             |
| JS       | Vanilla — `IntersectionObserver` + `fetch` + small motion glue    |
| Icons    | Hand-drawn 16×16 SVG (each project, each achievement)             |
| Mascot   | A pixel penguin                                                   |

Total payload: HTML ≈ 39 KB + CSS ≈ 55 KB + JS ≈ 12 KB ≈ **~106 KB**
of code, plus fonts (Google CDN, cached) and the penguin webp (~41 KB).
Hero LCP image is preloaded with `fetchpriority="high"`.

## Structure

```
/
├── index.html              # The game world
├── 404.html                # Game over screen
├── manifest.json           # PWA manifest (sky-blue theme)
├── robots.txt
├── sitemap.xml
├── humans.txt              # Credits (per humanstxt.org)
├── .well-known/
│   └── security.txt        # Disclosure contact (RFC 9116)
├── css/
│   └── style.css           # Single stylesheet (all the pixel rules)
├── js/
│   └── main.js             # Theme, reveal, live versions, dialog typer
├── icons/                  # Favicons, PWA icons, OG card, mascot
└── docs/
    └── DESIGN.md           # Aesthetic rules, tokens, motion
```

## Design

See [docs/DESIGN.md](docs/DESIGN.md) for color tokens, pixel rules,
motion timings, and the per-component fingerprint.

## License

See [LICENSE](LICENSE) — public for inspection, not for copying,
forking, or reuse.
