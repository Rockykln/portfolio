# Design

> Have fun and be yourself.

This portfolio is styled like a **pixel-art platformer title screen**.
It is intentionally not the same dark/amber language used on
`key64.com` — that's the *platform*, this is the *person*.

## Aesthetic direction

| Aspect       | Choice                                              |
|--------------|-----------------------------------------------------|
| World        | Pixel-art landscape — sky, grass, dirt, clouds      |
| Mood         | Playful, calm, friendly                             |
| Theme color  | Sky blue `#45B0E8` (primary), penguin orange `#FF8A1F` (accent) |
| Mascot       | The rockykln penguin, animated with an idle bounce  |
| Tagline      | *Have fun and be yourself*                          |
| Sections     | Quest log (projects), Achievements (principles), Press Start (contact) |

## Color tokens

The palette is anchored on **actual values sampled from the banner +
penguin icon** (Pillow color analysis on the original 1920×1080 PNG).
Every family has 3–5 ordered stops so you can ramp depth consistently.

### Day (default)

```css
/* Sky — anchored on real banner #1597F9 (HSL 206, 95%, 53%) */
--sky-light:   #28A1FC;   /* upper sky      */
--sky:         #1597F9;   /* main brand sky */
--sky-mid:     #0E84DD;   /* depth band     */
--sky-deep:    #0A66B5;   /* horizon        */
--sky-ink:     #033B6F;   /* text-on-sky    */

/* Grass — #98D657 lime + #56BB43 mid */
--grass-light: #B0E067;   /* sun-kissed top */
--grass:       #8FCB44;   /* main blade     */
--grass-mid:   #6FBE38;   /* body           */
--grass-deep:  #4A9926;   /* shadow         */
--grass-shadow:#2D6418;   /* root           */

/* Earth/Wood — #C1925A capybara fur + #855332 deep */
--earth-light: #DAB084;   /* highlight  */
--earth:       #C1925A;   /* main wood  */
--earth-deep:  #855332;   /* shadow     */
--earth-dark:  #4A2D1A;   /* deepest    */

/* Penguin orange — #FF8F1C beak/feet */
--orange-light:#FFB36B;   /* peach (hover)  */
--orange:      #FF8F1C;   /* main accent    */
--orange-deep: #D86D00;   /* pressed        */

/* Gold — treasure / coin / pill */
--gold-glow:   #FFE066;
--gold:        #FFC72C;
--gold-deep:   #E0A300;

/* Ink + paper (slight blue tint for cohesion) */
--ink:         #161A28;   /* body text          */
--ink-soft:    #3A4258;   /* secondary          */
--ink-faint:   #6B7488;   /* muted              */
--snow:        #FAFCFF;   /* page bg            */
--paper:       #FFF6E0;   /* warm cream alt-section */
--paper-edge:  #F4E9C8;   /* paper border       */

/* Berry purple — decorative, sparing (bird wings) */
--berry:       #5B5BB5;
```

### Night (`:root[data-theme="dark"]`) — twilight, not muddy

```css
--sky-light:   #1F3270;   /* twilight band */
--sky:         #0F1E4A;   /* midnight      */
--sky-mid:     #091537;
--sky-deep:    #050D26;   /* near horizon  */

--grass-light: #4A8930;   /* moonlit lime  */
--grass:       #2E6020;
--grass-deep:  #15300C;

--earth:       #4D341F;
--earth-deep:  #2E1F11;

--orange:      #FFA445;   /* lifted for dark contrast */
--gold:        #FFD250;

--ink:         #F2F5FB;   /* warm white */
--ink-soft:    #B5BDD0;
--snow:        #161B2A;   /* card bg */
--paper:       #1F2538;   /* alt section */
```

### Contrast (WCAG 2.2)

All measured pairs hit AA or AAA. The vivid sky is bright enough that
**dark text on sky is preferred** (5.63 AA) — never use `--snow` text
on `--sky` (fails at 2.99).

| Pair                       | Ratio  | Grade |
|----------------------------|--------|-------|
| ink on snow                | 16.85  | AAA   |
| ink-soft on paper          |  9.29  | AAA   |
| ink on orange              |  7.59  | AAA   |
| ink on gold                | 11.10  | AAA   |
| ink on grass               |  8.90  | AAA   |
| ink on sky                 |  5.63  | AA    |
| DARK ink on dark snow      | 15.71  | AAA   |
| DARK ink on orange         |  8.78  | AAA   |

In dark mode the **starfield expands** to fill 80vh of the page,
a **moon** appears in the upper right with idle bounce and soft glow,
clouds darken via a `filter: brightness()` overlay, the pixel pigeons
shift to a violet-grey, and the hero penguin gets a moonlit halo
(`drop-shadow(0 0 12px rgba(255,233,168,0.35))`).

All colors sourced from the user's existing pixel-art branding (penguin
avatar + "Thynk Unlimited" banner) plus a hand-mixed night palette.

## Typography

| Family            | Weights | Use                                  |
|-------------------|---------|--------------------------------------|
| Press Start 2P    | 400     | Display, hero title, section labels, button labels |
| Pixelify Sans     | 400–700 | Sign posts, decorative pixel text    |
| Outfit            | 400–700 | Body text, descriptions              |
| VT323             | 400     | Code-ish meta (level pills, footer copy) |

All loaded from Google Fonts with `display=swap`.

## Pixel rules

- **Borders are 3px solid `--ink`.** No rounded corners on cards.
- **Shadows are stepped offsets**, not blurs:
  `--shadow-pixel: 4px 4px 0 0 var(--ink);`
- **Hovers move the element 2–3px toward the upper-left**, growing the
  shadow — that creates a "lifted card" feeling without any blur.
- **Transitions use `steps(2)` or `steps(6)`**, never smooth easing —
  this gives motion the chunky, frame-by-frame feel of a sprite anim.
- **`image-rendering: pixelated`** on every raster (penguin, banner)
  to keep edges sharp at any zoom.
- **Status dots are squares**, not circles.

## Animations

| Animation        | Duration | Purpose                              |
|------------------|----------|--------------------------------------|
| `idle-bounce`    | 2.4s steps(2) | Penguin idles like an NPC       |
| `cloud-drift`    | 80–150s linear | Clouds drift across the sky    |
| `bird-fly`       | 32–42s linear | Pigeons fly across hero        |
| `wing-flap`      | 0.4s steps   | Pixel wings flap                |
| `pop-in`         | 0.6–0.7s steps | Hero elements stagger in       |
| `signpost-sway`  | 4s ease   | Wooden sign rocks gently            |
| `chest-shake`    | 0.4s steps(5) | Chest rattles on hover         |
| `star-blink`     | 0.9–4s steps  | Sparkles, dialog cursor       |
| `coin-spin`      | reserved      | Future use                     |

All wrapped in `@media (prefers-reduced-motion: reduce)` — cloud, bird,
and starfield layers are hidden, every animation is forced to 1 step.

## The fingerprint

Specific touches that make this *not* a generic pixel-art template:

1. **The user's actual penguin** is the avatar in the nav, the hero
   character standing on grass, AND the NPC portrait in the Talk dialog.
   Click the hero penguin to make it hop — a tiny easter egg with a
   floating ★ counter that disappears after 1.8 seconds.
2. **Per-project pixel chests** — each project has a custom 16×16
   SVG chest matching its theme:
   - key64 → wooden chest with golden lock + sparkle (the platform/treasury)
   - clientctl → CRT monitor with traffic-light dots and CPU bars
   - refrain → orange boombox with speakers and floating notes
3. **Sparkles drift around chests on hover** — two ✦ glyphs appear
   in opposite corners and pulse with `steps(4)` motion.
4. **Live version pills** — the "LV …" badges on the clientctl and
   refrain quest cards fetch `tag_name` from
   `api.github.com/repos/{owner}/{repo}/releases/latest` on page load
   and cache the response in localStorage for one hour. If the request
   fails or the rate-limit is hit, the pill is hidden entirely — no
   stale hardcoded fallback. key64 stays at "LV ∞" — it's the platform,
   not a versioned project.
5. **JRPG-style typewriter** — when the Talk dialog scrolls into view,
   the body text types itself out one character at a time, faster on
   spaces and pausing on punctuation. A blinking `▋` caret follows the
   typed text. Runs once per page load. Disabled under reduced-motion.
6. **Hand-drawn pixel achievement icons** — gem · scroll · key · magnifier · cloud · leaf.
7. **Sun ↔ moon theme toggle** — the celestial body IS the toggle.
   Click the pixel sun (day) or moon (night) — the disc itself is a
   native `<button>` positioned top-right inside the hero. Defaults to
   `prefers-color-scheme`, stored in localStorage as `rk:theme` once
   the user clicks.
9. **Cloud parallax** on hover-capable devices — clouds drift gently
   with the mouse, deeper clouds shift further. Off on touch and
   reduced-motion.
10. **The 404 page is a "Game over" screen** on the same world (with the same theme + moon).

## Layout

| Width    | Adjustments                                          |
|----------|------------------------------------------------------|
| > 900px  | 3-col achievements, signpost visible in hero         |
| ≤ 900px  | 2-col achievements, projects collapse to 1-col below |
| ≤ 640px  | Single-column everything, sign hidden, smaller penguin |
| ≤ 400px  | Buttons full-width, social wraps                     |
