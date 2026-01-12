# Civil Engineering Lab Guide

Astro + Starlight 기반의 토목/건설 CAD 도움말 사이트입니다. GitHub Pages에 `/civil-engineering-lab/` 베이스로 배포하며, 현재는 `dist/`를 함께 커밋해 정적 결과물을 직접 관리합니다.

## 요구 사항
- Node.js 18+ (LTS 권장)
- npm

## 설치
```bash
npm install
```

## 스크립트
- `npm run dev`: 로컬 개발 서버(기본 http://localhost:4321) 실행. 베이스 경로가 `/civil-engineering-lab/`이므로 링크·에셋 경로를 확인하세요.
- `npm run build`: 정적 산출물 생성. 결과는 `dist/`에 저장되며 현재는 저장소에 커밋합니다.
- `npm run preview`: 빌드 결과를 로컬에서 검증.
- `npm run astro -- <cmd>`: Astro CLI 직접 사용(예: `npm run astro -- check`).

## 프로젝트 구조
- `src/content/docs`: MDX 문서(언어별 하위 폴더 포함, `ko` 사용).
- `src/content/sub` & `src/pages/help`: 상세 도움말 콘텐츠 페이지.
- `src/components`, `src/layouts`: 공통 UI와 레이아웃.
- `src/lib`: 사이드바, 마크다운, 검색 관련 유틸.
- `src/styles`: 전역 스타일과 테마 커스터마이즈.
- `src/assets`, `public`: 이미지/아이콘 등 정적 자산.
- `dist`: `npm run build` 결과물(GitHub Pages에 푸시).

## 배포 플로우(GitHub Pages)
1. `npm run build`로 정적 사이트 생성.
2. `dist/`를 포함해 커밋/푸시하면 GitHub Pages가 `/civil-engineering-lab/` 경로로 제공.
3. Actions 기반 자동 배포로 전환하기 전까지는 `dist/`를 항상 최신 상태로 유지하세요.

## 참고
- 경로 프리픽스는 `/civil-engineering-lab`을 사용합니다. 하드코딩 대신 `src/lib/sidebarConfig.ts`의 `BASE_PATH` 등 헬퍼를 우선 사용하세요.
- 빌드 시 일부 `.eot` 폰트·마스크 아이콘 경고가 발생할 수 있습니다. 실제 에셋 경로를 확인하거나 불필요하면 참조를 제거하세요.
