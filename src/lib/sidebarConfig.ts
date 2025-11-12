import { getCollection } from "astro:content";

const BASE_PATH = "/eg-bim_guide/help";

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
  order?: number;
}

export interface MenuGroup {
  title: string;
  icon: string;
  items: MenuItem[];
}

export interface SidebarTab {
  id: string;
  label: string;
  icon?: string;
  groups: MenuGroup[];
}

// 그리미 탭 설정
export const grimmiTab: SidebarTab = {
  id: "grimmi",
  label: "가이드",
  icon: "ico-grimmy",
  groups: [
      {
      title: "공통",
      icon: "ico-ggurumi",
      items: [
        {
          id: "common",
          label: "",
          children: [
            {
              id: "information",
              label: "로그인/로그아웃",
              href: `${BASE_PATH}/information`,
            },
          ],
        },
      ]
      },
    {
      title: "그리미",
      icon: "ico-grimmy",
      items: [
        {
          id: "main",
          label: "",
          children: [
            {
              id: "interface03",
              label: "메인화면구성",
              href: `${BASE_PATH}/interface01`,
            },
          ],
        },
        {
          id: "interface",
          label: "홈메뉴",
          children: [
            {
              id: "interface01",
              label: "기본기능",
              href: `${BASE_PATH}/interface02`,
            },
            {
              id: "interface02",
              label: "사용자 설정 백업 & 복원",
              href: `${BASE_PATH}/interface03`,
            },
          ],
        },
        {
          id: "customize",
          label: "사용자화",
          children: [
            {
              id: "customize01",
              label: "명령어아이콘바",
              href: `${BASE_PATH}/customize01`,
            },
            {
              id: "customize02",
              label: "시스템설정",
              href: `${BASE_PATH}/customize02`,
            },
            {
              id: "customize03",
              label: "작업환경설정",
              href: `${BASE_PATH}/customize03`,
            },
            {
              id: "customize04",
              label: "단축키(별칭,단축키) 설정",
              href: `${BASE_PATH}/customize04`,
            },
          ],
        },
        {
          id: "multi",
          label: "멀티작업공간",
          children: [
            {
              id: "multi01",
              label: "파일탭 분리(Read Only)",
              href: `${BASE_PATH}/multi01`,
            },
            {
              id: "multi02",
              label: "Layout(도면공간) 탭 분리",
              href: `${BASE_PATH}/multi02`,
            },
            {
              id: "multi03",
              label: "3D 작업 전용",
              href: `${BASE_PATH}/multi03`,
            },
          ],
        },
        {
          id: "command",
          label: "명령어 전체보기",
          children: [
            {
              id: "command01",
              label: "명령어 전체보기 구성",
              href: `${BASE_PATH}/command01`,
            },
            {
              id: "command02",
              label: "토목/도로 특화명령어",
              href: `${BASE_PATH}/command02`,
            },
            {
              id: "command03",
              label: "구조/배근 특화명령어",
              href: `${BASE_PATH}/command03`,
            },
          ],
        },
        {
          id: "style",
          label: "스타일 관리",
          children: [
            {
              id: "style01",
              label: "선스타일 상세보기",
              href: `${BASE_PATH}/style01`,
            },
            {
              id: "style02",
              label: "문자스타일 상세보기",
              href: `${BASE_PATH}/style02`,
            },
            {
              id: "style03",
              label: "치수스타일 상세보기",
              href: `${BASE_PATH}/style03`,
            },
          ],
        },
        {
          id: "feature",
          label: "객체특성관리",
          children: [
            {
              id: "feature01",
              label: "속성바, 속성창(Properties)",
              href: `${BASE_PATH}/feature01`,
            },
            {
              id: "feature02",
              label: "색상상세보기",
              href: `${BASE_PATH}/feature02`,
            },
          ],
        },
        {
          id: "layer",
          label: "레이어관리",
          children: [
            {
              id: "layer01",
              label: "레이어 상세보기",
              href: `${BASE_PATH}/layer01`,
            },
          ],
        },
        {
          id: "block",
          label: "통합블록관리",
          children: [
            {
              id: "block01",
              label: "블록의 종류",
              href: `${BASE_PATH}/block01`,
              children: [
                {
                  id: "block02",
                  label: "블록",
                  href: `${BASE_PATH}/block02`,
                },
                {
                  id: "block03",
                  label: "속성블록",
                  href: `${BASE_PATH}/block03`,
                },
                {
                  id: "block04",
                  label: "외부참조",
                  href: `${BASE_PATH}/block04`,
                },
              ],
            },
            {
              id: "block05",
              label: "블록 라이브러리",
              href: `${BASE_PATH}/block05`,
            },
          ],
        },
        {
          id: "print",
          label: "인쇄",
          children: [
            {
              id: "print01",
              label: "인쇄창 화면 구성",
              href: `${BASE_PATH}/print01`,
            },
          ],
        },
      ],
    },
    {
      title: "꾸러미",
      icon: "ico-ggurumi",
      items: [
        {
          id: "floorplan",
          label: "",
          children: [
            {
              id: "floorplan01",
              label: "도면탐색 및 정보열람",
              href: `${BASE_PATH}/floorplan01`,
            },
          ],
        },
        {
          id: "floorplan-edit",
          label: "도면 정보 수정",
          children: [
            {
              id: "floorplan02",
              label: "도면 정보 수정",
              href: `${BASE_PATH}/floorplan02`,
            },
            {
              id: "floorplan03",
              label: "도면 정보 항목 선택",
              href: `${BASE_PATH}/floorplan03`,
            },
          ],
        },
        {
          id: "multiprint",
          label: "다중 출력",
          children: [
            {
              id: "multiprint01",
              label: "도면 출력 옵션 설정",
              href: `${BASE_PATH}/multiprint01`,
            },
            {
              id: "multiprint02",
              label: "다중 인쇄창 화면 구성",
              href: `${BASE_PATH}/multiprint02`,
            },
          ],
        },
      ],
    },
  ],
};

// 🔹 폴더명을 표시용 라벨로 변환하는 함수
function formatFolderLabel(folderName: string): string {
  // 하이픈(-)으로 시작하면 ".etc"로 표시
  if (folderName.startsWith('_')) {
    return 'etc.';
  }
  return folderName;
}

// docs 명령어 문서 생성
export async function generateDocsTab(): Promise<SidebarTab> {
  try {
    const docsEntries = await getCollection("docs");

    // ko/commands 폴더의 문서들 필터링 및 정렬
    const commandDocs = docsEntries
      .filter((entry) => entry.id.startsWith("ko/commands/"))
      .sort((a, b) => {
        const pathA = a.id.toLowerCase();
        const pathB = b.id.toLowerCase();
        return pathA.localeCompare(pathB, "en", {
          numeric: true,
          sensitivity: "base",
        });
      });

    if (commandDocs.length === 0) {
      console.warn("No command docs found in ko/commands/!");
    }

    // 하위 폴더별로 그룹화
    const grouped = commandDocs.reduce((acc, entry) => {
      const parts = entry.id.split("/");
      // ko/commands/drawing/line.md -> parts[2] = 'drawing'
      const subFolder = parts[2] || "general";

      if (!acc[subFolder]) {
        acc[subFolder] = [];
      }

      acc[subFolder].push({
        id: entry.id,
        label: entry.data.title,
        href: `${BASE_PATH}/${entry.id.replace(/\.mdx?$/, "")}`,
        order: entry.data.sidebar?.order || 999,
      });

      return acc;
    }, {} as Record<string, MenuItem[]>);

    // 🔹 폴더명을 알파벳 순으로 정렬한 후 메뉴 그룹 생성
    const sortedFolders = Object.keys(grouped).sort((a, b) =>
      a
        .toLowerCase()
        .localeCompare(b.toLowerCase(), "en", {
          numeric: true,
          sensitivity: "base",
        })
    );

    const items: MenuItem[] = sortedFolders.map((folder) => ({
      id: `commands-${folder}`,
      label: formatFolderLabel(folder), // 🔹 폴더명 변환 적용
      children: grouped[folder].sort((a, b) => (a.order || 0) - (b.order || 0)),
    }));

    return {
      id: "commands",
      label: "명령어",
      icon: "ico-docs",
      groups: [
        {
          title: "명령어",
          icon: "ico-docs",
          items: items,
        },
      ],
    };
  } catch (error) {
    console.error("Failed to load docs:", error);
    return {
      id: "commands",
      label: "명령어 문서",
      icon: "ico-docs",
      groups: [],
    };
  }
}

// 전체 탭 설정
export async function getSidebarTabs(): Promise<SidebarTab[]> {
  const docsTab = await generateDocsTab();
  return [grimmiTab, docsTab];
}