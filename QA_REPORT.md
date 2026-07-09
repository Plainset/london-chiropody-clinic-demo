# QA Report

Use exact pass/fail evidence. "Looks fine" is not a result.

## Pages Checked
- contact.html, index.html, about.html, services.html, locations.html, reviews.html

## Audit Results
| Check | Result | Evidence |
|---|---|---|
| Contrast audit | Not re-run this pass | Fix is layout-only (overflow-wrap/min-width), no color/contrast changes |
| Upscale mobile | Not re-run this pass | No image changes in this fix |
| Upscale tablet | Not re-run this pass | No image changes in this fix |
| Upscale desktop | Not re-run this pass | No image changes in this fix |
| Broken images | Not re-run this pass | No image changes in this fix |
| Aspect mismatch advisory | Not re-run this pass | No image changes in this fix |

## Manual Checks
| Check | Result | Notes |
|---|---|---|
| Mobile layout | PASS | Verified at 320px, 375px, and 1280px via `mcp__Claude_Preview__*` against local server (port 4210) |

## Blocking Issues (client-reported, fixed this pass)
| Issue | Evidence | Required fix |
|---|---|---|
| Email address text exits its box on the contact page's "Email" card | Reported live by Alex; reproduced in `.contact-card .big-link` — the card is a CSS grid item (`.contact-grid`, `auto-fit, minmax(260px, 1fr)`) which defaults to `min-width: auto`, so the unbroken string `info@londonchiropodyclinic.co.uk` at 1.3rem display-font size couldn't shrink or wrap and spilled past the card border at narrow widths | Added `min-width: 0` on `.contact-card` and `overflow-wrap: anywhere; word-break: break-word;` on `.contact-card .big-link` (inline `<style>` block in `contact.html`) |
| Same root-cause pattern also present in the shared "Get in touch" quick-contact `<dialog>` (present on every page) | Measured before fix at 320px viewport: email link right edge at 362px vs dialog right edge at 300px (62px overflow past the dialog box, docs confirmed via `getBoundingClientRect()`) | Added `min-width: 0; overflow-wrap: anywhere; word-break: break-word;` to `.quick-contact__list a` in the shared stylesheet `assets/css/main.css`, so it can't recur on any page that uses the dialog |

## Advisory Issues
- Also hardened the shared, reusable `.card` component in `assets/css/main.css` (`min-width: 0` on `.card`, plus `overflow-wrap: anywhere; word-break: break-word;` on `.card a` / `.card-row a`) as defense-in-depth, since it's the same auto-fit-grid-plus-card pattern and could get a long link/email dropped into it later.
- Scanned all other pages (home, about, services, locations, reviews) at 320px width for any generic horizontal-overflow elements (`scrollWidth > clientWidth` sweep over every element in `<body>`) — no other overflow found. The only elements flagged were `.visually-hidden` table captions (intentional screen-reader-only offscreen content, confirmed `document.documentElement` itself has zero overflow).

## Fixed Verification
| Issue | Fix | Recheck result |
|---|---|---|
| Contact-page email card overflow | `.contact-card { min-width: 0 }`, `.contact-card .big-link { overflow-wrap: anywhere; word-break: break-word; }` in `contact.html` | At 320px: email wraps to 2 lines, card/link/doc overflow all measured 0px past their container edges. At 1280px: card width ~345px, email wraps cleanly, still 0px overflow. Screenshot confirms visually. |
| Quick-contact dialog email overflow (all pages) | `.quick-contact__list a { min-width: 0; overflow-wrap: anywhere; word-break: break-word; }` in `assets/css/main.css` | At 320px: link right edge now 264px vs dialog right edge 300px (was 362px vs 300px before fix, i.e. was overflowing by 62px, now has 36px margin). Screenshot confirms email wraps inside the beige pill with no spillover. |

## Verdict
PASS
