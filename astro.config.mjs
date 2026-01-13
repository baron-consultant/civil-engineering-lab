//https://starlight.astro.build/getting-started/

// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeNova from "starlight-theme-nova";

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
      social: [
        {
          icon: "seti:info",
          label: "CivilEngineeringLab Home",
          href: "https://civilengineeringlab.org",
        },
      ],
      sidebar: [
        { label: "Civil DX", autogenerate: { directory: "Civil DX" } },
        { label: "기반기술", autogenerate: { directory: "기반기술" } },
        { label: "설계", autogenerate: { directory: "설계" } },
        { label: "시공", autogenerate: { directory: "시공" } },
        { label: "Guides", autogenerate: { directory: "guides" } },
        { label: "Reference", autogenerate: { directory: "reference", collapsed: true } },
      ],
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
