// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    plugins: [svelte()],
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
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src', "index.ts"),
            },
            output: {
                name: 'main',
            }
        },
        //构建后是否生成 source map 文件
        sourcemap: false,
        minify: "terser", //terser 构建后文件体积更小
    },
})
