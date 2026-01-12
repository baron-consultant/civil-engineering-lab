import Fuse from "./fuse.esm.js";

const fuseOptions = {
  includeScore: true,
  threshold: 0.6,
  ignoreLocation: true,
  minMatchCharLength: 1,
  distance: 200,
  keys: [
    { name: "title", weight: 0.7 },
    { name: "excerpt", weight: 0.3 },
  ],
};

const enhanceResults = (resultsList, term) => {
  if (!resultsList || term.length < 2) return;
  const items = Array.from(
    resultsList.querySelectorAll("li.pagefind-ui__result"),
  );
  if (!items.length) return;

  const entries = items.map((li) => {
    const title =
      li.querySelector(".pagefind-ui__result-title")?.innerText?.trim() ?? "";
    const excerpt =
      li.querySelector(".pagefind-ui__result-excerpt")?.innerText?.trim() ??
      "";
    const href = li.querySelector("a")?.href ?? "";
    return { title, excerpt, href, li };
  });

  const fuse = new Fuse(entries, fuseOptions);
  const results = fuse.search(term);
  if (!results.length) return;

  console.groupCollapsed(`[fuzzy] "${term}" (${results.length})`);
  results.forEach((r) => {
    const score = typeof r.score === "number" ? r.score.toFixed(4) : "n/a";
    console.log(`${score} :: ${r.item.title} :: ${r.item.href}`);
  });
  console.groupEnd();

  // DOM 재배치
  resultsList.innerHTML = "";
  results.forEach((r) => resultsList.appendChild(r.item.li));
};

const attachObserver = () => {
  const input = document.querySelector(".pagefind-ui__search-input");
  const resultsList = document.querySelector(".pagefind-ui__results");
  if (!input || !resultsList) return;

  const run = () => enhanceResults(resultsList, input.value.trim());
  const observer = new MutationObserver(run);
  observer.observe(resultsList, { childList: true, subtree: true });

  input.addEventListener("input", () => {
    // mutation이 없을 때도 강제 실행
    window.setTimeout(run, 200);
  });
};

const boot = () => {
  // dialog 내부가 렌더된 이후에 붙이기 위해 약간의 지연
  window.setTimeout(attachObserver, 300);
};

if (typeof window !== "undefined") {
  window.addEventListener("astro:page-load", boot);
  document.addEventListener("DOMContentLoaded", boot);
}
