// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import eslintPlugin from 'vite-plugin-eslint';
import { replaceCodePlugin } from 'vite-plugin-replace';
import packageJson from './package.json';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
    plugins: [
        svelte(),
        eslintPlugin({
            include: ['src/**/*.ts', 'src/**/*.svelte', 'src/*.ts', 'src/*.svelte'],
        }),
        replaceCodePlugin({
            replacements: [
                {
                    from: '__VERSION__',
                    to: packageJson.version,
                },
            ],
        }),
        cssInjectedByJsPlugin(),
    ],
    lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/index.js'),
        name: 'SiYuan',
        // the proper extensions will be added
        fileName: 'main',
    },
    resolve: {
        alias: {
            '@': resolve('src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 8090,
        watch: {},
        hmr: true,
    },
    build: {
        assetsDir: '',
        emptyOutDir: false,
        lib: {
            entry: process.env.TYPE === 'iife' ? 'src/index.ts' : 'src/export',
            formats: process.env.TYPE === 'iife' ? ['iife'] : ['es'],
            name: 'siyuan-plugin-system',
            fileName: (t, v) => t === 'iife' ? 'main.js' : 'main.esm.js',
        },
        outDir: '',
        rollupOptions: {
            output: {
                name: 'main',
            },
        },
        //构建后是否生成 source map 文件
        sourcemap: 'inline',
        minify: 'terser', //terser 构建后文件体积更小
    },
});
