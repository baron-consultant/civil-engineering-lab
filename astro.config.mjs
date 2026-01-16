//https://starlight.astro.build/getting-started/

// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeNova from "starlight-theme-nova";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");

const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  const v = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(v)) return true;
  if (["false", "0", "no", "n"].includes(v)) return false;
  return fallback;
};

const aptabaseBaseUrl =
  env.PUBLIC_APTABASE_URL ??
  env.APTABASE_URL ??
  process.env.PUBLIC_APTABASE_URL ??
  process.env.APTABASE_URL ??
  "";
const aptabaseKey =
  env.PUBLIC_APTABASE_KEY ??
  env.APTABASE_KEY ??
  process.env.PUBLIC_APTABASE_KEY ??
  process.env.APTABASE_KEY ??
  "";
const aptabaseDebug = parseBool(
  env.PUBLIC_APTABASE_DEBUG ??
    env.APTABASE_DEBUG ??
    process.env.PUBLIC_APTABASE_DEBUG ??
    process.env.APTABASE_DEBUG,
  mode !== "production",
);
const commitSha =
  env.PUBLIC_COMMIT_SHA ??
  env.GITHUB_SHA ??
  process.env.PUBLIC_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  "";
const pdfDownloadUrl = env.PUBLIC_PDF_DOWNLOAD_URL ?? process.env.PUBLIC_PDF_DOWNLOAD_URL ?? "";
const pdfIconEnabled = parseBool(
  env.PUBLIC_PDF_ICON_ENABLED ?? process.env.PUBLIC_PDF_ICON_ENABLED,
  false,
);

const aptabaseApiUrl =
  aptabaseBaseUrl.length === 0
    ? ""
    : aptabaseBaseUrl.includes("/api/")
      ? aptabaseBaseUrl.replace(/\/+$/, "")
      : `${aptabaseBaseUrl.replace(/\/+$/, "")}/api/v0/event`;

// https://astro.build/config
export default defineConfig({
  site: "https://civilengineeringlab.org",
  base: "/",
  integrations: [
    starlight({
      title: "CivilEngineeringLab",
      favicon: "/favicon.svg",
      logo: {
        src: "./src/assets/cell_temp.svg",
      },
      defaultLocale: "root",
      locales: {
        root: {
          label: "Korean",
          lang: "ko-KR",
        },
      },
      pagination: true,
      // social: [
      //   {
      //     icon: "seti:info",
      //     label: "CivilEngineeringLab Home",
      //     href: "https://civilengineeringlab.org",
      //   },
      // ],
      sidebar: [
        { label: "Civil DX", autogenerate: { directory: "Civil DX" } },
        { label: "기반기술", autogenerate: { directory: "기반기술" } },
        { label: "설계", autogenerate: { directory: "설계" } },
        { label: "시공", autogenerate: { directory: "시공" } },
        { label: "Guides", autogenerate: { directory: "guides" } },
        { label: "Reference", autogenerate: { directory: "reference", collapsed: true } },
      ],
      head: aptabaseKey
        ? [
            {
              tag: "script",
              attrs: { defer: true },
              content: `(function(){try{var cfg={key:${JSON.stringify(
                aptabaseKey,
              )},apiUrl:${JSON.stringify(aptabaseApiUrl)},debug:${JSON.stringify(
                aptabaseDebug,
              )},apiUrl:${JSON.stringify(aptabaseApiUrl)},debug:${JSON.stringify(
                aptabaseDebug,
              )},commit:${JSON.stringify(commitSha.slice(0, 8))}};window.__aptabaseConfig=cfg;var lastPath=null;var sessionKey="__aptabase_session_info_"+cfg.key;function getProps(extra){var base={path:window.location.pathname,title:document.title||undefined,ref:document.referrer||undefined,viewport_width:window.innerWidth,viewport_height:window.innerHeight,device_pixel_ratio:window.devicePixelRatio,ua:navigator.userAgent,is_mobile:window.innerWidth<800};if(!extra)return base;for(var k in extra)base[k]=extra[k];return base}function detectOS(){var ua=navigator.userAgent;if(/Windows/i.test(ua))return"Windows";if(/Mac OS X/i.test(ua))return"macOS";if(/Android/i.test(ua))return"Android";if(/iPhone|iPad|iPod/i.test(ua))return"iOS";if(/Linux/i.test(ua))return"Linux";return"Other"}function detectBrowser(){var ua=navigator.userAgent;if(/Edg\\//i.test(ua))return"Edge";if(/Chrome\\//i.test(ua)&&!/Edg\\//i.test(ua)&&!/OPR\\//i.test(ua))return"Chrome";if(/Safari/i.test(ua)&&!/Chrome/i.test(ua))return"Safari";if(/Firefox/i.test(ua))return"Firefox";return"Other"}function deviceCategory(){var w=window.innerWidth;if(w<640)return"mobile";if(w<1024)return"tablet";return"desktop"}function sendSessionInfo(api){try{if(typeof sessionStorage!=="undefined"&&sessionStorage.getItem(sessionKey))return;if(typeof sessionStorage!=="undefined")sessionStorage.setItem(sessionKey,"1");api.trackEvent("session_info",{device_category:deviceCategory(),device_os:detectOS(),browser:detectBrowser(),screen_width:window.screen.width,screen_height:window.screen.height,viewport_width:window.innerWidth,viewport_height:window.innerHeight,device_pixel_ratio:window.devicePixelRatio,ua:navigator.userAgent,language:navigator.language||undefined})}catch(e){console.warn("Aptabase session_info failed",e)}}function trackPage(api){var path=window.location.pathname;if(path===lastPath)return;lastPath=path;api.trackEvent("page_view",getProps())}function tagHeadings(){document.querySelectorAll("main h2[id], main h3[id]").forEach(function(el){if(el.dataset.analyticsId)return;var id=el.id||el.textContent||"heading";el.dataset.analyticsId="heading-"+id})}function wireBlocks(api){var seen=new Set;var obs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting||entry.intersectionRatio<0.5)return;var id=entry.target.dataset.analyticsId;if(!id||seen.has(id))return;seen.add(id);api.trackEvent("block_view",getProps({block:id}))})},{threshold:0.5});tagHeadings();document.querySelectorAll("[data-analytics-id]").forEach(function(el){obs.observe(el)});document.addEventListener("click",function(ev){var target=ev.target&&ev.target.closest("[data-analytics-id]");if(!target)return;var id=target.dataset.analyticsId;if(!id)return;api.trackEvent("block_click",getProps({block:id}))})}function init(api){var opts={};if(cfg.apiUrl)opts.apiUrl=cfg.apiUrl;opts.isDebug=!!cfg.debug;var res=window.screen.width+"x"+window.screen.height;var ver=(cfg.commit||"local").toString().slice(0,8);opts.appVersion=res+" "+ver;api.init(cfg.key,opts);sendSessionInfo(api);trackPage(api);wireBlocks(api);var handler=function(){trackPage(api)};document.addEventListener("astro:page-load",handler);window.addEventListener("popstate",handler)}var s=document.createElement("script");s.src="/aptabase.min.js";s.defer=!0;s.onload=function(){try{var api=window.aptabase;if(!api||typeof api.init!=="function"||typeof api.trackEvent!=="function"){console.warn("Aptabase script missing");return;}init(api)}catch(e){console.warn("Aptabase init failed",e);}};document.head.appendChild(s);}catch(e){console.warn("Aptabase bootstrap failed",e);}})();`,
            },
            ...(pdfIconEnabled && pdfDownloadUrl
              ? [
                  {
                    tag: "script",
                    attrs: { defer: true },
                    content: `(function(){try{const url=${JSON.stringify(
                      pdfDownloadUrl,
                    )};if(!url)return;const render=()=>{const container=document.querySelector(".nova-header-actions-lg");if(!container)return;const existing=container.querySelector(".pdf-download-btn");if(existing)return;const btn=document.createElement("a");btn.className="pdf-download-btn nova-icon-button";btn.href=url;btn.target="_blank";btn.rel="noopener";btn.title="PDF 다운로드";btn.setAttribute("data-pdf-download","true");btn.innerHTML='<img src="/pdf_download.svg" alt="PDF" width="24" height="24" loading="lazy" />';const theme=document.querySelector(".nova-theme-select");if(theme?.parentElement===container){container.insertBefore(btn,theme);}else{container.appendChild(btn);}};const init=()=>{render();const mo=new MutationObserver(()=>render());mo.observe(document.body,{childList:true,subtree:true});};if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}}catch(e){console.warn("PDF download button init failed",e);}})();`,
                  },
                ]
              : []),
          ]
        : [],
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      plugins: [
        starlightThemeNova({
          // nav: [
          //  { label: 'Go EG-BIM Home', href:'https://eg-bim.co.kr' }
          // ]
        }),
      ],
      components: {
        SiteTitle: "./src/components/SiteTitleWithSelect.astro",
        Sidebar: "./src/components/ContextualSidebar.astro",
        TableOfContents: "./src/components/CustomTableOfContents.astro",
        MobileTableOfContents: "./src/components/CustomMobileTableOfContents.astro",
      },
      customCss: ["./src/styles/custom.css"],
      pagefind: true,
    }),
  ],
});
