import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeEnhancer from "./rehypeEnhancer.js";
import { resolveImagePath } from "./markdownUtils.js";

export async function markdownToHtml(raw) {
  const cleaned = raw
    .replace(/^import\s+.*from\s+['"].*['"];?$/gm, "")
    // 🔹 참조 스타일 이미지 정의를 저장
    .replace(
      /\[([^\]]+)\]:\s*\.\.\/.*assets\/images\/(.+)/g,
      (_, ref, path) => `[${ref}]: /eg-bim_guide/images/${path}`
    )
    // 🔹 참조 스타일 이미지 사용 시 클래스 추가
    .replace(
      /!\[\]\[([^\]]+)\]\{\.([a-zA-Z0-9-_]+)\}/g,
      (match, ref, className) => {
        // ![][image1]{.my-class} → HTML로 변환
        return `<img data-ref="${ref}" class="${className}" />`;
      }
    )
    .replace(
      /!\[([^\]]*)\]\((@img\/[^)]+)\)/g,
      (_, alt, path) => `![${alt}](${resolveImagePath(path)})`
    );

  return String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeEnhancer)
      .use(rehypeStringify)
      .process(cleaned)
  );
}
