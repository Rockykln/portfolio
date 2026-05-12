# Changelog

All notable changes to the **portfolio site itself** (the page at
`rockykln.de`). The three quest projects shown on the page —
key64, clientctl, refrain — version themselves independently.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-05-12 — *"Title screen"*

First stable release. Phone-reviewed, palette-locked, accessibility +
SEO + meta all green. Going forward: no version bumps for this page —
content edits ship without a release tag.

### Locked in
- Final palette: **Imperial Red `#E63946`** as the only warm accent,
  used sparingly (CTAs, focus rings, selection, footer heart, single
  achievement icon). Same red in light + dark.
- Neutral gray card surfaces (`--gray-50/100/200/300`) — no blue tint.
- Sun + moon ARE the theme toggle — no separate button. Native
  `<button>` elements for reliable iOS Safari hit-testing.
- Pinguin sitting at the bottom of the hero (`hero-scene` is a direct
  child of `<header class="hero">`, not nested in hero-stage anymore).
- Quest LV pills hide on GitHub-API failure (no stale fallback shown).
- Easter eggs: penguin hop (visible) + a hidden one on the nav avatar.

## [0.6.0] — 2026-05-12 — *"Phone polish"*

iPhone-side review pass. Everything that came out of testing on iOS
Safari + Android Chrome.

### Fixed
- **Theme toggle "worked once then jammed"** — `.moon { pointer-events:
  none }` was leftover from when the moon was a decorative `<div>`. With
  the toggle moved to sun/moon, the moon was visible but unclickable
  after the first dark→light flip.
- **Sun unclickable on phone** — `<div role="button">` had hit-testing
  edge cases on iOS Safari. Replaced with real `<button>` elements
  (`appearance: none` reset, native click handling).
- **Sun hung over the "have fun" banner** — hero used `justify-content:
  flex-end`, so on short viewports the tagline overflowed *up* into the
  sun area. Switched to `flex-start`; sun + scene reservations now via
  hero `padding-top` / `padding-bottom`.
- **Reload restored scroll to "Talk"** — added
  `history.scrollRestoration = 'manual'` + `pageshow` / `beforeunload`
  reset listeners.
- **Achievement #1 invisible in dark mode** — sky-light bg + sky-deep
  text were both dark cobalt. Hardcoded brighter bg + dark text.
- **Double-tap zoom still triggered** — `touch-action: manipulation`
  now applied universally via `*, *::before, *::after`. Display-text
  elements get `user-select: none` so iOS Smart Zoom doesn't fire.
- **Bottom-pull color flash** — `overscroll-behavior-y: none` on html
  + page bg gradient that transitions to `--floor` near the footer.

### Changed
- Quest LV pills hide on API failure (was: show hardcoded fallback).
- `hero-scene` moved out of `hero-stage` so absolute `bottom: 0`
  correctly anchors to hero, not the stage.
- Penguin shrunk: 140 → 112 (desktop), 110 → 90 (mobile).
- Footer brand: "Made with pixels & coffee" → "Made with pixels & Red Bull".

## [0.5.0] — 2026-05-12 — *"Triadic red"*

Final color decision after iterations through orange → gold → berry.

- Replaced everything warm with **Imperial Red `#E63946`** anchored on
  a triadic relationship with sky-blue and grass-green. Analogous to
  the orange penguin beak so the avatar harmonizes with the palette
  instead of clashing.
- Five-stop ramp (`--red-glow / -light / red / -deep / -shadow`).
- Old `--orange*`, `--gold*`, `--berry*` tokens kept as aliases that
  flow into the red ramp — every existing rule inherits the new accent
  without rule-by-rule edits.
- Heading shadow tokens (`--title-warm/depth/edge` +
  `--accent-text/shadow1/shadow2`) introduced and flipped per theme.
  Light mode is monochrome gray + ink; dark mode same with `--floor`
  as the depth step.
- Footer color cut fixed via new `--floor` token (single source of
  truth for footer bg + bottom overscroll).
- Body bg = sky on top, fades into floor near the bottom — no flash
  when iOS Safari rubber-bands past the dark footer.

## [0.4.0] — 2026-05-08 — *"Audit pass"*

Bug + SEO + accessibility + perf cleanup.

### Fixed
- a11y: `aria-hidden` on `.hero-scene` was hiding the focusable
  penguin button from screen readers.
- Wrong MIME on alternate link: sitemap.xml was `application/rss+xml`,
  changed to `application/xml`.
- 404 sun icon parity with index.html (was simplified 7-rect, now full
  13-rect).

### Removed
- Hero "v0.2 OPEN!" signpost (stale, manual versioning of a one-page site).
- `--dirt`, `--wood`, `--peach`, `--pixel`, `--berry` legacy aliases
  (zero consumers per grep).
- Pixelify Sans webfont (the only consumer was the signpost) + Outfit
  weight 500. Saves ~4 woff2 roundtrips on first paint.
- Cluttering `<meta>` `creator` + `publisher`.

### Added
- `<html lang="en" dir="ltr">`, hreflang `en` + `x-default`.
- `mobile-web-app-capable`, `application-name`, `msapplication-TileColor`,
  `msapplication-config: none`.
- 13 AI-crawler opt-outs in robots.txt.
- JSON-LD `WebSite` schema (3rd block) with `@id` anchors.
- `mask-icon` for Safari pinned tabs.

### Hardening
- CSP: removed `'unsafe-inline'` from `style-src` (the one inline
  `style=""` got extracted to a modifier class).
- Mobile-nav: ≤480px now hides only the secondary "Style" link, keeps
  "Quests" + "Talk" + theme toggle.
- Tap targets at ≤360px: `min-height: 32px` + larger padding (was 18px
  effective tap zone).

## [0.3.0] — 2026-05-07 — *"Sun + horizon"*

Hero composition + motion pass.

- **Horizon snaps to viewport bottom** — new `--ground-h` token drives
  both `.ground { height }` AND `.hero { min-height: calc(100dvh -
  var(--ground-h)) }`, so the dirt strip ends exactly at the screen
  edge on initial paint.
- **Pixel sun in day mode** — 52px gold disc with `sun-pulse` (vertical
  bob + scale + warm glow) and `sun-rays` (conic-gradient ring
  breathing in/out).
- **Grass-blade wind sway** — `.ground::before` background-position
  drifts ±4px on a 5s loop.
- **Achievement icon wobble** on hover — `ach-wobble` 8-step rotation
  ±4° + lift.
- Day-mode starfield was leaking (opacity 0.6 even in light). Now
  `opacity: 0` by default; dark-mode override reveals it.

## [0.2.0] — 2026-05-07 — *"Pixel rebirth"*

Total redesign. The dark/amber clone of `key64.com` was replaced with
the page's own visual identity rooted in the user's existing pixel-art
branding.

- **Pixel-art platformer aesthetic.** Sky-blue + grass-green +
  penguin-orange palette.
- Hero scene: drifting pixel clouds, two flying pigeons, chunky Press
  Start 2P headline with stepped shadow, the penguin standing on
  grass, a wooden signpost (later removed in 0.4).
- Three hand-drawn **16×16 pixel chests** for the Quest log: wooden
  chest (key64), CRT monitor (clientctl), boombox (refrain).
- **Achievements** section: six pixel badges for working principles.
- **Talk** section restyled as a JRPG dialog box with portrait, name
  plate, and a typewriter-animated body.
- **404** redesigned as a "Game over" screen on the same world.
- **Day ↔ night** with cobalt-night palette, expanded starfield,
  moonlit halo on the hero penguin.
- **Live LV pills** — fetch `tag_name` from GitHub Releases API on
  page load, cache in localStorage for 1h.
- **Penguin click → jump** easter egg with hop counter.
- **Dialog typewriter** — text types itself out when scrolled into view.
- Cloud parallax on hover-capable devices.

## [0.1.0] — 2026-05-07 — *"Initial scaffold"*

- Vanilla static site — no build step, no framework.
- `IntersectionObserver`-based scroll reveal.
- `<head>` boilerplate: charset, viewport, title, description,
  canonical, theme-color, OpenGraph, Twitter card, JSON-LD Person.
- robots.txt, sitemap.xml, humans.txt, `.well-known/security.txt`.
- README + DESIGN docs scaffolded.
