# Techfest — Aetherial Renaissance

An independent, scroll-driven Three.js/WebGL concept experience for Techfest IIT Bombay’s 30th edition.

## Run & Operate

- `pnpm --filter @workspace/techfest-aether run dev` — run the interactive website.
- `pnpm --filter @workspace/techfest-aether run typecheck` — check frontend JavaScript and the Python generator.
- `pnpm --filter @workspace/techfest-aether run build` — generate C/Python particle data and build the static website.
- Build requirements: Python 3 and a C compiler (`cc` or `gcc`).

## Stack

- pnpm workspaces and Vite.
- HTML/CSS and JavaScript with Three.js for browser-side WebGL.
- C11 particle generator, called and validated by a Python 3 build script.

## Where things live

- `artifacts/techfest-aether/` — application, assets, and deployment instructions.
- `artifacts/techfest-aether/src/experience.js` — Three.js scene and camera timeline.
- `artifacts/techfest-aether/src/ui.js` and `src/styles.css` — interactions and presentation.
- `artifacts/techfest-aether/src/engine/aether_particles.c` — deterministic ambient particle field.
- `artifacts/techfest-aether/tools/generate_aether_field.py` — C compilation and JSON validation.

## Architecture decisions

- Keep the experience as a static site; no runtime service or database is needed.
- Generate repeatable scene coordinates with C and Python; Three.js owns the browser renderer and animation.
- The supplied visual pack informs the original scene but is not displayed as a poster gallery.

## Product

Visitors scroll through a connected metallic/celestial world, select technology realms, and reach a personalized Campus Ambassador identity terminal. The page includes reduced-motion and WebGL fallback behavior.

## User preferences

Use C, Python, and HTML; keep JavaScript to browser-required WebGL and interactions. Treat the supplied Techfest imagery as visual references, not webpage content.

## Gotchas

The asset generator compiles C at dev/build time, so Python 3 and `cc`/`gcc` must be available.

## Pointers

- See `artifacts/techfest-aether/README.md` for build and static deployment commands.
