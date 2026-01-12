# Repository Guidelines

## Project Structure & Module Organization
- Astro + Starlight static docs. `src/content/docs` holds MDX docs (localized under `ko/`), `src/content/sub` and `src/pages/help` contain the detailed help pages, `src/components` shared UI, `src/layouts` templates, `src/lib` utilities (markdown, sidebar, search helpers), `src/styles` global styles, and `src/assets` images/icons. Static files live in `public/`. Build output goes to `dist/`, which is tracked for now. Site/base is `/` per `astro.config.mjs`.

## Build, Test, and Development Commands
- `npm install` once to fetch dependencies.
- `npm run dev` starts the Astro dev server (defaults to http://localhost:4321) with the `/` base.
- `npm run build` generates the static site into `dist/`; commit the updated `dist/` until CI-based deploys exist.
- `npm run preview` serves the built output for final checks.
- `npm run astro -- <cmd>` for ad-hoc Astro tooling (e.g., `npm run astro -- check`).

## Coding Style & Naming Conventions
- JS/TS/MDX generally use 2-space indentation; keep the existing style of the file you touch (tabs appear in a few configs). Maintain current semicolon usage.
- Keep route and asset paths prefixed with `/` (e.g., `/help/feature01`). Prefer helper constants such as `BASE_PATH` in `src/lib/sidebarConfig.ts` or `resolveImagePath` in `src/lib/markdownUtils.js` instead of hard-coding.
- Use lower-kebab-case for routes and filenames; preserve locale folder names (e.g., `ko`).

## Testing Guidelines
- No automated test suite. Treat `npm run build` as the regression gate and resolve warnings about missing assets/fonts before pushing.
- After content edits, run `npm run preview` and spot-check navigation, search (Pagefind), and images under the base path.

## Commit & Pull Request Guidelines
- Follow the repo’s history: concise, imperative-style subjects that state scope (e.g., `Add Korean docs for ...`).
- PRs should include a short summary, linked issue if available, build result notes, and screenshots/GIFs for visual/content changes.
- Until Actions-based deploys exist, include the freshly built `dist/` in commits to keep GitHub Pages current and leave the base in `astro.config.mjs` set to `/`.
