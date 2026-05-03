import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Mormónsbók',
				short_name: 'Mormónsbók',
				description: 'Mormónsbók á íslensku — hljóðbók',
				lang: 'is',
				theme_color: '#0f0d0b',
				background_color: '#0f0d0b',
				display: 'standalone',
				start_url: '/',
				icons: [
					{ src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
					{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
					{ src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
				navigateFallback: 'index.html',
				runtimeCaching: [] // audio is streamed from R2, never cached
			}
		}),
		{
			name: 'audio-dev-server',
			configureServer(server) {
				server.middlewares.use('/audio', (req, res, next) => {
					const audioDir = path.resolve(process.cwd(), 'Audio');
					const reqPath = decodeURIComponent((req as { url?: string }).url || '');
					const filePath = path.join(audioDir, reqPath);

					// Security: ensure the path stays within Audio/
					if (!filePath.startsWith(audioDir + path.sep) && filePath !== audioDir) {
						next();
						return;
					}

					if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
						next();
						return;
					}

					const stat = fs.statSync(filePath);
					const range = (req as any).headers.range as string | undefined;

					if (range) {
						const parts = range.replace(/bytes=/, '').split('-');
						const start = parseInt(parts[0], 10);
						const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
						const chunksize = end - start + 1;
						res.writeHead(206, {
							'Content-Range': `bytes ${start}-${end}/${stat.size}`,
							'Accept-Ranges': 'bytes',
							'Content-Length': chunksize,
							'Content-Type': 'audio/mpeg'
						});
						fs.createReadStream(filePath, { start, end }).pipe(res);
					} else {
						res.writeHead(200, {
							'Content-Length': stat.size,
							'Content-Type': 'audio/mpeg',
							'Accept-Ranges': 'bytes'
						});
						fs.createReadStream(filePath).pipe(res);
					}
				});
			}
		}
	]
});
