# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the website for **Creators ApS**, a Copenhagen-based digital consultancy. It is a static site (`index.html`) deployed to GitHub Pages on every push to `main` via `.github/workflows/static.yml`. There is no build process, package manager, or test suite.

## Serving the site locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Architecture

The entire site is `index.html` + `assets/`. All visual behavior is controlled via `config.js`:

- `background`: `"image"`, `"slider"`, `"youtube"`, `"color"`, or `"kenburns"`
- `overlay`: `0` (both overlays), `1` (subscribe only), `2` (contact only), `3` (none)
- `skin`: `"black"` or `"white"`
- `canvasEffect`, `parallax`: boolean toggles
- Slider images configured in the `sliderBG` array; YouTube URL in `youtubeBG`

Dependencies live in `assets/css/` and `assets/js/`. The main script is `assets/js/scripts.js`.

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which deploys the repo root to GitHub Pages.
