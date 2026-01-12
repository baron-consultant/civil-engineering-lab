import Fuse from "./fuse.esm.js";

const defaultFuseOptions = {
  includeScore: true,
  threshold: 0.66,
  ignoreLocation: true,
  minMatchCharLength: 1,
  distance: 200,
  keys: [
    { name: "title", weight: 0.7 },
    { name: "excerpt", weight: 0.3 },
  ],
};
let currentFuseOptions = { ...defaultFuseOptions };

const getFuseOptions = (overrides = {}) => ({
  ...currentFuseOptions,
  ...overrides,
});

const setFuseOptions = (overrides = {}) => {
  currentFuseOptions = { ...currentFuseOptions, ...overrides };
  return currentFuseOptions;
};

const resetFuseOptions = () => {
  currentFuseOptions = { ...defaultFuseOptions };
  return currentFuseOptions;
};

let observerAttached = false;
let consoleHelperAttached = false;
let pagefindModulePromise = null;
let pagefindClient = null;
const STORAGE_KEY = "celFuzzyEnabled";
let fuzzyEnabled = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return true; // 기본 on
  return saved === "true";
})();

const escapeHtml = (str = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const cleanText = (text = "") =>
  text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

const boldMatches = (text = "", query = "") => {
  const safe = escapeHtml(cleanText(text));
  const q = query.trim();
  if (!q) return safe;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "gi");
  return safe.replace(re, "<strong>$1</strong>");
};

const loadPagefind = async () => {
  if (pagefindModulePromise) return pagefindModulePromise;
  pagefindModulePromise = import("/pagefind/pagefind.js").catch((err) => {
    console.error("[fuzzy] Pagefind 모듈 로드 실패:", err);
    pagefindModulePromise = null;
    throw err;
  });
  return pagefindModulePromise;
};

const ensurePagefind = async () => {
  if (pagefindClient) return pagefindClient;
  const pagefind = await loadPagefind();
  // 기본 옵션은 Pagefind 내부에서 초기화됨
  pagefindClient = pagefind;
  return pagefindClient;
};

const pagefindSearch = async (pagefind, term) => {
  if (!term || !term.trim()) return [];
  const res = await pagefind.search(term.trim());
  if (!res?.results?.length) return [];
  const data = await Promise.all(res.results.map((r) => r.data()));
  return data.map((item) => ({
    title: item.meta?.title ?? "",
    excerpt: item.excerpt ?? "",
    href: item.url ?? item.meta?.url ?? "",
  }));
};

const collectFallbackTerms = (query) => {
  const terms = new Set();
  const tokens = query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  tokens.forEach((t) => {
    if (t.length >= 2) terms.add(t);
    if (t.length >= 2) terms.add(t.slice(1)); // 앞 글자 탈락
    if (t.length >= 2) terms.add(t.slice(0, -1)); // 뒷 글자 탈락
  });
  return Array.from(terms).filter((t) => t.length >= 2);
};

const headlessFuzzy = async (term, overrides) => {
  if (!fuzzyEnabled) {
    console.info("[fuzzy] fuzzy_search가 비활성화되어 headless를 건너뜁니다.");
    return [];
  }
  const query = (term ?? "").trim();
  if (query.length < 2) {
    console.warn("[fuzzy] 검색어를 2자 이상 입력하세요.");
    return [];
  }

  const pagefind = await ensurePagefind();

  let entries = await pagefindSearch(pagefind, query);
  let usedFallback = false;

  if (!entries.length) {
    usedFallback = true;
    const fallbackTerms = collectFallbackTerms(query);
    const results = await Promise.all(
      fallbackTerms.map((t) => pagefindSearch(pagefind, t)),
    );
    entries = results.flat();
  }

  if (!entries.length) {
    console.info(`[fuzzy] "${query}" 결과가 없습니다.`);
    return [];
  }

  // dedup by href
  const seenHref = new Set();
  const uniqueEntries = entries.filter((e) => {
    if (!e.href) return false;
    if (seenHref.has(e.href)) return false;
    seenHref.add(e.href);
    return true;
  });

  const fuse = new Fuse(uniqueEntries, getFuseOptions(overrides));
  const ranked = fuse.search(query);
  console.groupCollapsed(
    `[fuzzy/headless] "${query}" (${ranked.length} / pagefind ${uniqueEntries.length})${usedFallback ? " [fallback]" : ""}`,
  );
  ranked.forEach((r) => {
    const score =
      typeof r.score === "number" ? r.score.toFixed(4) : "n/a";
    console.log(`${score} :: ${r.item.title} :: ${r.item.href}`);
  });
  console.groupEnd();

  return ranked.map((r) => ({
    score: r.score,
    title: r.item.title,
    href: r.item.href,
    excerpt: r.item.excerpt,
  }));
};

const findSearchNodes = () => {
  const input = document.querySelector(".pagefind-ui__search-input");
  const resultsList = document.querySelector(".pagefind-ui__results");
  if (input && resultsList) return { input, resultsList };
  return null;
};

const waitForSearchNodes = (timeout = 5000) =>
  new Promise((resolve) => {
    const found = findSearchNodes();
    if (found) return resolve(found);

    const observer = new MutationObserver(() => {
      const nodes = findSearchNodes();
      if (nodes) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(nodes);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(findSearchNodes());
    }, timeout);
  });

const attachObserver = async () => {
  if (observerAttached) return;
  const nodes = await waitForSearchNodes();
  if (!nodes) return;
  const { input, resultsList } = nodes;
  observerAttached = true;
  let running = false;

  const run = () => {
    if (!fuzzyEnabled) return;
    if (running) return;
    const value = input.value.trim();
    if (value.length < 2) return;
    running = true;
    runFuzzyFromConsole(value)
      .catch((err) => console.error("[fuzzy] run error", err))
      .finally(() => {
        running = false;
      });
  };

  let lastFallbackQuery = "";
  let lastFallbackAt = 0;

  const listObserver = new MutationObserver(() => {
    const hasResults =
      resultsList.querySelectorAll("li.pagefind-ui__result").length > 0;
    if (hasResults) return;
    const q = input.value.trim();
    if (q.length < 2) return;

    const now = Date.now();
    if (lastFallbackQuery === q && now - lastFallbackAt < 500) return;

    lastFallbackQuery = q;
    lastFallbackAt = now;
    runFuzzyFromConsole(q).catch((err) =>
      console.error("[fuzzy] fallback run error", err),
    );
  });
  listObserver.observe(resultsList, { childList: true, subtree: true });

  input.addEventListener("input", () => {
    window.setTimeout(run, 100);
  });

  // 입력값이 미리 채워져 있으면 즉시 시도
  if (input.value.trim().length >= 2) {
    run();
  }
};

const renderFallbackList = (resultsList, ranked, query) => {
  if (!resultsList) return;
  clearPagefindMessages();

  if (!ranked.length) {
    resultsList.innerHTML = `
      <div class="pagefind-ui__message fuzzy-empty">
        입력한 검색어에 대한 fuzzy 결과를 찾지 못했습니다.
      </div>
    `;
    console.info("[fuzzy] 결과 없음");
    return;
  }

  resultsList.innerHTML = ranked
    .map(
      (r) => `
      <li class="pagefind-ui__result fuzzy-fallback">
        <div class="pagefind-ui__result-inner">
          <p class="pagefind-ui__result-title">
            <a class="pagefind-ui__result-link" href="${r.href}">
              ${boldMatches(r.title || r.href, query)}
            </a>
          </p>
          <p class="pagefind-ui__result-excerpt">${boldMatches(
            r.excerpt || "",
            query,
          )}</p>
        </div>
      </li>
    `,
    )
    .join("");
  console.info("[fuzzy] fuzzy 결과를 리스트에 표시했습니다.");
};

const runFuzzyFromConsole = async (term, overrides) => {
  const input = document.querySelector(".pagefind-ui__search-input");
  const resultsList = document.querySelector(".pagefind-ui__results");
  const query = (term ?? input?.value ?? "").trim();
  if (query.length < 2) {
    console.warn("[fuzzy] 검색어를 2자 이상 입력하세요.");
    return [];
  }
  if (!fuzzyEnabled) {
    console.info("[fuzzy] fuzzy_search가 비활성화되어 실행하지 않습니다.");
    return [];
  }
  const ranked = await headlessFuzzy(query, overrides);
  if (resultsList) {
    renderFallbackList(resultsList, ranked, query);
  }
  return ranked;
};

const attachConsoleHelper = () => {
  if (consoleHelperAttached || typeof window === "undefined") return;
  consoleHelperAttached = true;
  window.celFuzzy = {
    run: runFuzzyFromConsole,
    headless: headlessFuzzy,
    pagefind: headlessFuzzy,
    setOptions: setFuseOptions,
    resetOptions: resetFuseOptions,
    getOptions: () => ({ ...currentFuseOptions }),
    setEnabled: (enabled) => {
      fuzzyEnabled = !!enabled;
      localStorage.setItem(STORAGE_KEY, fuzzyEnabled ? "true" : "false");
      return fuzzyEnabled;
    },
    toggleEnabled: () => {
      fuzzyEnabled = !fuzzyEnabled;
      localStorage.setItem(STORAGE_KEY, fuzzyEnabled ? "true" : "false");
      return fuzzyEnabled;
    },
    status: () => ({
      inputReady: !!document.querySelector(".pagefind-ui__search-input"),
      resultsReady: !!document.querySelector(".pagefind-ui__results"),
      pagefindLoaded: !!pagefindModulePromise,
      fuzzyEnabled,
    }),
  };
  console.info(
    '[fuzzy] window.celFuzzy.run("검색어", { threshold: 0.5 }) 또는 window.celFuzzy.headless("검색어", { threshold: 0.5 }) 사용 가능',
  );
};

const boot = () => {
  resetFuseOptions();
  // dialog 내부가 렌더된 이후에 붙이기 위해 약간의 지연
  window.setTimeout(attachObserver, 300);
  window.setTimeout(attachConsoleHelper, 100);
};

if (typeof window !== "undefined") {
  window.addEventListener("astro:page-load", boot);
  document.addEventListener("DOMContentLoaded", boot);
}
const clearPagefindMessages = () => {
  document
    .querySelectorAll(".pagefind-ui__message, .pagefind-ui__result-group")
    .forEach((el) => el.remove());
};
