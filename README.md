# Civil Engineering Lab Guide

Astro + Starlight 기반의 토목/건설 엔지니어링 정보 사이트입니다.

## 요구 사항
- Node.js 24+ (LTS 권장)
- npm

## 설치
```bash
npm install
# 필요 시 `.env.example`를 복사해 로컬 환경 변수를 설정하세요.
# Aptabase 트래킹 키(디버그 플래그 포함)와 Playwright 기본 URL 샘플이 포함되어 있습니다.
```

## 스크립트
- `npm run dev`: 로컬 개발 서버(기본 http://localhost:4321) 실행. 베이스 경로는 `/`입니다.
- `npm run build`: 정적 산출물 생성. 결과는 `dist/`에 저장되며 GitHub Actions에서 Pages로 배포합니다. **빌드 전에 `npm run format` → `npm run lint` 순으로 실행하는 것을 기본 절차로 합니다.**
- `npm run preview`: 빌드 결과를 로컬에서 검증.
- `npm run lint`: Biome 기반 린트(`biome check .`).
- `npm run format`: Biome 포맷(`biome format .`).
- `npm run test:e2e`: Playwright E2E 테스트. 내부적으로 `npm run dev -- --host --port 4173` 서버를 띄운 뒤 테스트를 수행합니다. 최초 실행 전 한번 `npx playwright install --with-deps`로 브라우저를 설치하세요.
- `npm run test:e2e:report`: 마지막 Playwright HTML 리포트를 엽니다.
- `npm run astro -- <cmd>`: Astro CLI 직접 사용(예: `npm run astro -- check`).

## UI 메모
- 우측 목차는 데스크톱 해상도(기본 72rem, 약 1152px) 이상에서 표시되며, 목차 왼쪽 경계에 맞춘 토글 버튼(⟫/⟪)으로 접고 펼칠 수 있습니다.

## 프로젝트 구조
- `src/content/docs`: MDX 문서(언어별 하위 폴더 포함, `ko` 사용).
- `src/content/sub` & `src/pages/help`: 상세 도움말 콘텐츠 페이지.
- `src/components`, `src/layouts`: 공통 UI와 레이아웃.
- `src/lib`: 사이드바, 마크다운, 검색 관련 유틸.
- `src/styles`: 전역 스타일과 테마 커스터마이즈.
- `src/assets`, `public`: 이미지/아이콘 등 정적 자산.

## 네비게이션/목차
- 사이드바는 `src/content/docs` 하위의 상위 디렉터리(Civil DX, 기반기술, 설계, 시공, guides, reference)를 자동으로 그룹화합니다. 동일 구조로 문서를 추가하면 네비게이션에 바로 반영됩니다.
- 본문 목차는 `##` 이상의 헤더가 있을 때 자동 생성되므로 깊이 있는 헤더 구조를 유지하세요.
- 페이지네이션은 각 상위 섹션 내부에서만 동작하도록 문서 frontmatter(`sidebar.order`, `prev/next`)로 섹션 첫/마지막 문서를 지정해 두었습니다. 섹션 간 자동 이동은 막혀 있으니, 교차 링크는 필요 시 수동으로 작성하세요.

## 코드 스타일(Biome)
- VS Code: `biomejs.biome` 확장을 추천합니다. `.vscode/settings.json`에 JS/TS/JSON 계열 파일의 기본 포맷터와 format-on-save가 설정돼 있습니다.
- 커맨드:
  - 린트: `npm run lint`
  - 포맷: `npm run format`
- 지원 범위: JS/TS/JSX/TSX/JSON(JSONC) 위주입니다. `.astro`/`.md` 등 비지원 파일은 기존 스타일을 유지하고 필요 시 수동 정리하세요.

## 배포/병합
- GitHub Actions로 자동 배포하며, 콘텐츠 병합은 `main` 브랜치로만 진행합니다.
- 콘텐츠 전용 머지는 `.github/workflows/contents-merge.yml` (수동 `workflow_dispatch`, `CONTENT_PUSH_TOKEN` 필요)을 사용하며 `src/content/` 변경만 허용됩니다. main으로 직접 push는 제한되어 있습니다.

## 배포 플로우(GitHub Pages)
- Actions 기반 자동 배포 `.github/workflows/deploy.yml` 참조. 배포 시 `vars.APTABASE_URL` / `vars.APTABASE_KEY`가 `PUBLIC_APTABASE_URL` / `PUBLIC_APTABASE_KEY`로 주입돼 Aptabase 트래킹 스니펫을 활성화합니다(미설정 시 `APTABASE_URL` / `APTABASE_KEY`도 fallback). 로컬 빌드에서 확인하려면 `.env.example`를 참고해 `.env`에 동일한 키를 설정하세요. `PUBLIC_APTABASE_URL`은 호스트(`https://us.aptabase.com`) 또는 엔드포인트(`/api/v0/event`까지 포함) 모두 허용합니다. `PUBLIC_APTABASE_DEBUG`를 `true`로 두면 로컬/프리뷰에서 디버그 모드로 전송됩니다(배포는 기본 false).

## 참고
- 빌드 시 일부 `.eot` 폰트·마스크 아이콘 경고가 발생할 수 있습니다. 실제 에셋 경로를 확인하거나 불필요하면 참조를 제거하세요.
