//https://starlight.astro.build/getting-started/

// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeNova from "starlight-theme-nova";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");

const aptabaseBaseUrl =
  env.PUBLIC_APTABASE_URL ?? env.APTABASE_URL ?? process.env.PUBLIC_APTABASE_URL ?? process.env.APTABASE_URL ?? "";
const aptabaseKey =
  env.PUBLIC_APTABASE_KEY ?? env.APTABASE_KEY ?? process.env.PUBLIC_APTABASE_KEY ?? process.env.APTABASE_KEY ?? "";
const aptabaseDebug =
  (env.PUBLIC_APTABASE_DEBUG ?? env.APTABASE_DEBUG ?? process.env.PUBLIC_APTABASE_DEBUG ?? process.env.APTABASE_DEBUG ?? "")
    .toLowerCase() === "true";

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
              )}};window.__aptabaseConfig=cfg;var lastPath=null;function getProps(extra){var base={path:window.location.pathname,title:document.title||undefined,ref:document.referrer||undefined,viewport_width:window.innerWidth,viewport_height:window.innerHeight,device_pixel_ratio:window.devicePixelRatio,ua:navigator.userAgent,is_mobile:window.innerWidth<800};if(!extra)return base;for(var k in extra)base[k]=extra[k];return base}function trackPage(api){var path=window.location.pathname;if(path===lastPath)return;lastPath=path;api.trackEvent("page_view",getProps())}function tagHeadings(){document.querySelectorAll("main h2[id], main h3[id]").forEach(function(el){if(el.dataset.analyticsId)return;var id=el.id||el.textContent||"heading";el.dataset.analyticsId="heading-"+id})}function wireBlocks(api){var seen=new Set;var obs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting||entry.intersectionRatio<0.5)return;var id=entry.target.dataset.analyticsId;if(!id||seen.has(id))return;seen.add(id);api.trackEvent("block_view",getProps({block:id}))})},{threshold:0.5});tagHeadings();document.querySelectorAll("[data-analytics-id]").forEach(function(el){obs.observe(el)});document.addEventListener("click",function(ev){var target=ev.target&&ev.target.closest("[data-analytics-id]");if(!target)return;var id=target.dataset.analyticsId;if(!id)return;api.trackEvent("block_click",getProps({block:id}))})}function init(api){var opts={};if(cfg.apiUrl)opts.apiUrl=cfg.apiUrl;opts.isDebug=!!cfg.debug;api.init(cfg.key,opts);trackPage(api);wireBlocks(api);var handler=function(){trackPage(api)};document.addEventListener("astro:page-load",handler);window.addEventListener("popstate",handler)}var s=document.createElement("script");s.src="/aptabase.min.js";s.defer=!0;s.onload=function(){try{var api=window.aptabase;if(!api||typeof api.init!=="function"||typeof api.trackEvent!=="function"){console.warn("Aptabase script missing");return;}init(api)}catch(e){console.warn("Aptabase init failed",e);}};document.head.appendChild(s);}catch(e){console.warn("Aptabase bootstrap failed",e);}})();`,
            },
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
