# Repository Guidelines

## Project Structure & Module Organization
- Astro + Starlight static docs. `src/content/docs` holds MDX docs (localized under `ko/`), `src/content/sub` and `src/pages/help` contain the detailed help pages, `src/components` shared UI, `src/layouts` templates, `src/lib` utilities (markdown, sidebar, search helpers), `src/styles` global styles, and `src/assets` images/icons. Static files live in `public/`. Build output goes to `dist/`, which is tracked for now. Site/base is `/` per `astro.config.mjs`.

## Build, Test, and Development Commands
- `npm install` once to fetch dependencies.
- `npm run dev` starts the Astro dev server (defaults to http://localhost:4321) with the `/` base.
- `npm run build` generates the static site into `dist/`; Pages deploy runs via GitHub Actions (no need to commit `dist/`).
- `npm run preview` serves the built output for final checks.
- `npm run astro -- <cmd>` for ad-hoc Astro tooling (e.g., `npm run astro -- check`).

## Coding Style & Naming Conventions
- JS/TS/MDX generally use 2-space indentation; keep the existing style of the file you touch (tabs appear in a few configs). Maintain current semicolon usage.
- Keep route and asset paths prefixed with `/` (e.g., `/help/feature01`). Prefer helper constants such as `BASE_PATH` in `src/lib/sidebarConfig.ts` or `resolveImagePath` in `src/lib/markdownUtils.js` instead of hard-coding.
- Use lower-kebab-case for routes and filenames; preserve locale folder names (e.g., `ko`).

## Testing Guidelines
- No automated test suite. Treat `npm run build` as the regression gate and resolve warnings about missing assets/fonts before pushing.
- After content edits, run `npm run preview` and spot-check navigation, search (Pagefind), and images under the base path.
- Aptabase tracking uses `PUBLIC_APTABASE_URL` / `PUBLIC_APTABASE_KEY` (set from GitHub Actions vars); set locally in `.env` to exercise analytics loading during builds/previews. `PUBLIC_APTABASE_URL`는 호스트나 `/api/v0/event`까지의 전체 엔드포인트 모두 허용합니다. `PUBLIC_APTABASE_DEBUG=true`로 두면 로컬/프리뷰에서 디버그 모드로 전송되고, 배포 기본은 false(릴리즈 모드).
- Fallback: `APTABASE_URL` / `APTABASE_KEY` / `APTABASE_DEBUG`도 인식하므로 Actions Variables나 Secrets에 어느 쪽을 써도 됩니다.

## Commit & Pull Request Guidelines
- Follow the repo’s history: concise, imperative-style subjects that state scope (e.g., `Add Korean docs for ...`).
- PRs should include a short summary, linked issue if available, build result notes, and screenshots/GIFs for visual/content changes.
- Until Actions-based deploys exist, include the freshly built `dist/` in commits to keep GitHub Pages current and leave the base in `astro.config.mjs` set to `/`.
