// vite.config.js
import packageJson from './package.json';
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/index.js'),
        name: 'SiYuan',
        // the proper extensions will be added
        fileName: 'main',
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
