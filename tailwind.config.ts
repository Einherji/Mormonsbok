import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: '#080f1c',
				surface: {
					DEFAULT: '#0d1829',
					elevated: '#132238',
					overlay: '#1a2d45'
				},
				accent: {
					DEFAULT: '#d4a853',
					hover: '#e0b96a',
					muted: '#8a6a2e'
				},
				primary: {
					DEFAULT: '#2b6cb8',
					hover: '#3a7dd0',
					muted: '#1a4a8a'
				},
				text: {
					primary: '#e8f0f8',
					secondary: '#7a99b8',
					muted: '#4a6580'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
} satisfies Config;
