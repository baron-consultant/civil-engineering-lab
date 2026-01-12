//https://starlight.astro.build/getting-started/

// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';

// https://astro.build/config
export default defineConfig({
	site: 'https://civilengineeringlab.org',
	base: '/',
	integrations: [
		starlight({
			title: 'CivilEngineeringLab',
			favicon: '/favicon.svg',
			logo: {
				src: './src/assets/cell_temp.svg',
			},
			defaultLocale: 'ko',
			locales: {
				ko: {
					label: 'Korean',
					lang: 'ko-KR'
				},
			},
			social: [
				{
					icon: 'seti:info',
					label: 'CivilEngineeringLab Home',
					href: 'https://civilengineeringlab.org',
				},
			],
			// sidebar: [
			// 	{
			// 		label: 'EG-BIM 시작하기',
			// 		autogenerate: { directory: 'guides' },
			// 	},
			// 	{
			// 		label: '기본 기능',
			// 		autogenerate: { directory: 'BasicFeatures' },
			// 	},
			// 	{
			// 		label: '명령어',
			// 		autogenerate: { directory: 'commands', collapsed: true },
			// 	},
			// ],
			plugins: [
				starlightThemeNova({

					// nav: [
					// 	{ label: 'Go EG-BIM Home', href:'https://eg-bim.co.kr' }
					// ]
				})
			],
			components: {
				SiteTitle: './src/components/SiteTitleWithSelect.astro',
				Sidebar: './src/components/ContextualSidebar.astro',
			},
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
