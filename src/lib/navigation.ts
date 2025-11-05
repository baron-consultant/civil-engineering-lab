// ✅ /help 경로용 컴포넌트 네비게이션만 정의
export const navigation = [
  {
    label: "인터페이스",
    directory: "interface",
    type: "component" as const,
    items: [
      { slug: "interface01", title: "메인화면구성" },
      { slug: "interface02", title: "홈메뉴" },
    ],
  },
  {
    label: "사용자화",
    directory: "customize",
    type: "component" as const,
    items: [
      { slug: "customize01", title: "명령어아이콘바" },
      { slug: "customize02", title: "시스템설정" },
      { slug: "customize03", title: "작업환경설정" },
      { slug: "customize04", title: "단축키설정" },
    ],
  },
  {
    label: "멀티작업공간",
    directory: "multi",
    type: "component" as const,
    collapsed: true,
    items: [
      { slug: "multi01", title: "파일탭 분리" },
      { slug: "multi02", title: "Layout 탭 분리" },
      { slug: "multi03", title: "3D 작업 전용" },
    ],
  },
  {
    label: "명령어 전체보기",
    directory: "command",
    type: "component" as const,
    collapsed: true,
    items: [
      { slug: "command01", title: "명령어 전체보기 구성" },
      { slug: "command02", title: "토목/도로 특화명령어" },
      { slug: "command03", title: "구조/배근 특화명령어" },
    ],
  },
  {
    label: "스타일 관리",
    directory: "style",
    type: "component" as const,
    items: [
      { slug: "style01", title: "선스타일 상세보기" },
      { slug: "style02", title: "면스타일 상세보기" },
      { slug: "style03", title: "문자스타일 상세보기" },
    ],
  },
  {
    label: "객체특성관리",
    directory: "feature",
    type: "component" as const,
    items: [
      { slug: "feature01", title: "속성바,속성창" },
      { slug: "feature02", title: "색상상세보기" },
    ],
  },
  {
    label: "레이어관리",
    directory: "layer",
    type: "component" as const,
    items: [{ slug: "layer01", title: "레이어 상세보기" }],
  },
  {
    label: "통합블록관리",
    directory: "block",
    type: "component" as const,
    items: [
      { slug: "block01", title: "블록의 종류" },
      { slug: "block02", title: "블록" },
      { slug: "block03", title: "속성블록" },
      { slug: "block04", title: "외부참조" },
      { slug: "block05", title: "블록 라이브러리" },
    ],
  },
  {
    label: "인쇄",
    directory: "print",
    type: "component" as const,
    items: [
      { slug: "print01", title: "인쇄창 화면구성" },
      { slug: "multiprint01", title: "도면 출력 옵션 설정" },
      { slug: "multiprint02", title: "다중 인쇄창 화면 구성" },
    ],
  },
  {
    label: "도면관리",
    directory: "floorplan",
    type: "component" as const,
    items: [
      { slug: "floorplan01", title: "도면탐색 및 정보열람" },
      { slug: "floorplan02", title: "도면정보 수정" },
      { slug: "floorplan03", title: "도면정보항목선택" },
    ],
  },
];

// ✅ component 라우트만 생성
export const pageRoutes = navigation.flatMap((section) =>
  section.items.map((item) => ({
    slug: item.slug,
    title: `가이드-${item.title}`,
    type: section.type,
    path: `${section.directory}/${item.slug}`,
    group: section.directory,
    sectionLabel: section.label,
  }))
);

export const defaultPage = pageRoutes[0];
