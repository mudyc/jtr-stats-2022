//import adapter from '@sveltejs/adapter-auto';
//import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	//preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: 'index.html',
			pages: 'docs',
			assets: 'docs',
		}),
		paths: {
			base: dev ? '': '/jtr-stats-2022'
		},
	}
};

export default config;
