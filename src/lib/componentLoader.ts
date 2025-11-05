// 상대 경로를 정확하게 맞춰야 합니다
// utils 폴더에서 content/sub로 가는 경로
const allComponents = import.meta.glob("../content/sub/**/*.astro");

export async function loadComponent(path: string) {
  // path 앞에 ../ 추가
  const componentPath = `../content/sub/${path}.astro`;
  const loader = allComponents[componentPath];

  if (!loader) {
    console.error("Available paths:", Object.keys(allComponents));
    console.error("Requested path:", componentPath);
    throw new Error(`Component not found: ${componentPath}`);
  }

  return (await loader()).default;
}
