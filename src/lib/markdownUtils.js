// /src/utils/markdownUtils.js
const imageCache = new Map();

export function resolveImagePath(src) {
  if (!src) return src;
  if (src.startsWith("@img/")) {
    return src.replace("@img/", "/eg-bim_guide/images/");
  }
  if (src.startsWith("../assets/images/")) {
    return src.replace("../assets/images/", "/eg-bim_guide/images/");
  }
  return src;
}

/**
 * href가 외부 링크인지 확인
 * - http://, https://, // 로 시작하면 외부 링크로 판단
 */
export function isExternalLink(href) {
  if (!href) return false;
  return /^https?:\/\//.test(href) || href.startsWith("//");
}
