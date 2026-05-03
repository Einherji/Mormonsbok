import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: '#0f0d0b',
				surface: {
					DEFAULT: '#1a1917',
					elevated: '#252320',
					overlay: '#2e2b28'
				},
				accent: {
					DEFAULT: '#d4a853',
					hover: '#e0b96a',
					muted: '#8a6a2e'
				},
				text: {
					primary: '#f0ebe2',
					secondary: '#a89f92',
					muted: '#6b6560'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
} satisfies Config;
