# Civil Engineering Lab Guide

Astro + Starlight 기반의 토목/건설 엔지니어링 정보 사이트입니다.

## 요구 사항
- Node.js 24+ (LTS 권장)
- npm

## 설치
```bash
npm install
```

## 스크립트
- `npm run dev`: 로컬 개발 서버(기본 http://localhost:4321) 실행. 베이스 경로가 `/civil-engineering-lab/`이므로 링크·에셋 경로를 확인하세요.
- `npm run build`: 정적 산출물 생성. 결과는 `dist/`에 저장되며 현재는 저장소에 커밋합니다.
- `npm run preview`: 빌드 결과를 로컬에서 검증.
- `npm run lint`: Biome 기반 린트(`biome check .`).
- `npm run format`: Biome 포맷(`biome format .`).
- `npm run astro -- <cmd>`: Astro CLI 직접 사용(예: `npm run astro -- check`).

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
 Actions 기반 자동 배포 `.github/workflows/deploy.yml` 참조.

## 참고
- 빌드 시 일부 `.eot` 폰트·마스크 아이콘 경고가 발생할 수 있습니다. 실제 에셋 경로를 확인하거나 불필요하면 참조를 제거하세요.
