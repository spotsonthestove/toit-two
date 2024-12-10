import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['three', 'troika-three-text']
	},
	optimizeDeps: {
		include: [
			'three',
			'three/examples/jsm/controls/OrbitControls.js',
			'three/examples/jsm/controls/DragControls.js'
		]
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					three: ['three'],
					'three-controls': [
						'three/examples/jsm/controls/OrbitControls.js',
						'three/examples/jsm/controls/DragControls.js'
					]
				}
			}
		}
	}
});
 