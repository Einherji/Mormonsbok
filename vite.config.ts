import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
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
