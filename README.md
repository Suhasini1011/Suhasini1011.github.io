# Suhasini Pillay — Portfolio

A single-page, scroll-driven portfolio. It uses plain HTML, CSS and JS with no build step.
GSAP, ScrollTrigger and Lenis are bundled in `js/vendor/`.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly as a file also works. The GitHub section may hide itself
in that case, because some browsers block requests from `file://` pages.

## What to edit

| You want to change…                       | Edit this file      |
|-------------------------------------------|---------------------|
| Any text, number, link, project, role      | `js/data.js`        |
| Colours and fonts                          | `css/config.css`    |
| Which GitHub repos appear (allowlist)      | top of `js/github.js` |
| Your photo                                 | `assets/` + `about.photo` in `js/data.js` |
| Your CV file                               | put the PDF in `assets/`, set `contact.cv` in `js/data.js` |

- Every chart value in `js/data.js` comes from the README of the matching GitHub repo.
- A link written as `"[...]"` is treated as not set yet: it shows greyed out and does nothing.
- Project screenshots are in `assets/projects/`, and the web CV (phone, address and date of birth removed) is `assets/Suhasini_Pillay_CV.pdf`.

### Add a project
In `js/data.js`, copy one object inside `projects.items`, then change its fields.
Each project has 3–4 `steps`, and each step has a `visual`:

```js
{ type: "bar",   labels: ["A","B"], values: [10, 20], unit: "%" }
{ type: "line",  labels: ["Q1","Q2","Q3"], values: [5, 9, 14], unit: "" }
{ type: "kpi",   items: [{ value: 50, prefix: "−", suffix: "%", label: "Escalations" }] }
{ type: "image", src: "assets/screenshot.webp", alt: "What the screenshot shows" }
```

The pinned scroll animation, step tracker and chart drawing adapt automatically.

### Fonts
The site uses Space Grotesk, Inter and JetBrains Mono from Google Fonts.
To change them, edit the `<link>` in `index.html` and the three `--font-*` lines in `css/config.css`.

## How the motion behaves

| Situation                             | Behaviour |
|---------------------------------------|-----------|
| Desktop / tablet (≥768px)             | Smooth scroll, pinned sections, horizontal gallery, charts that draw as you scroll |
| Mouse or trackpad                     | Custom cursor, 3D card tilt, magnetic contact buttons, field reacts to mouse |
| Phones (<768px)                       | No pinning or horizontal scroll; simple fade-up reveals; no custom cursor |
| `prefers-reduced-motion: reduce`      | No motion at all; all content and charts shown in their final state |
| Keyboard (Tab)                        | Focused items are always scrolled into view and fully visible |
| JS libraries fail to load             | Page still renders fully, just without animation |

## Hosting
Upload the whole folder to any static host, such as GitHub Pages, Netlify or Vercel.
There is no backend: GitHub repos are fetched in the browser.
GitHub allows 60 requests per hour per visitor, and the result is cached per browser session.
