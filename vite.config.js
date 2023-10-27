import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni'
export default defineConfig({
	plugins: [uni()],
	server: {
		proxy: {
			'/api': {
				 target: 'http://127.0.0.19', //php本地启动端口
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},

});

