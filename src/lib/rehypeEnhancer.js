// src/utils/rehypeEnhancer.js
import { visit } from "unist-util-visit";
import { resolveImagePath, isExternalLink } from "./markdownUtils.js";

export default function rehypeEnhancer() {
  return (tree) => {
    visit(tree, "element", (node) => {
      // 이미지 경로 처리
      if (node.tagName === "img" && node.properties?.src) {
        node.properties.src = resolveImagePath(node.properties.src);
        node.properties.loading = "lazy";
      }

      // 외부 링크 처리
      if (node.tagName === "a" && isExternalLink(node.properties?.href)) {
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer";
      }
    });
  };
}
