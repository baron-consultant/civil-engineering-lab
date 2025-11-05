//https://starlight.astro.build/getting-started/

// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova  from 'starlight-theme-nova';

// https://astro.build/config
export default defineConfig({
	site: 'https://baron-consultant.github.io',
	base: '/eg-bim_guide/',
	integrations: [
		starlight({
			title: '',
			favicon:'/favicon.svg',
			logo: {
				src: './src/assets/egbim_k.svg',
				replacesTitle: true,
			},
			defaultLocale: 'ko',
			locales: {
				ko: {
					label: 'Korean',
					lang:'ko-KR'
				},
			},
			social: [
				{
					icon: 'seti:info',
					label: 'EG-BIM HOME',
					href: 'https://eg-bim.co.kr',
				},
			],
			sidebar:[
				{
					label: 'EG-BIM 시작하기',
					autogenerate: { directory: 'guides' },
				},
				{
					label: '기본 기능',
					autogenerate: { directory: 'BasicFeatures' },
				},
				{
					label: '명령어',
					autogenerate: { directory: 'commands', collapsed: true },
				},
			],
			plugins: [
				starlightThemeNova({
					
					// nav: [
					// 	{ label: 'Go EG-BIM Home', href:'https://eg-bim.co.kr' }
					// ]
				})
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
