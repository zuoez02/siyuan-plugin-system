const fs = window.require('fs');
const path = window.require('path');

const pluginScriptPosition = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, '.siyuan', 'plugin.js');

export function saveToLocal(path: string, content: string) {
    return new Promise((resolve, reject) => {
        const { writeFile } = fs;
        const { Buffer } = require('buffer');
        const data = new Uint8Array(Buffer.from(content));
        writeFile(path, data, (err) => {
            if (err) return reject(err);
            resolve('The file has been saved!');
        });
    })

}

export function createFile(p: string) {
    return new Promise((resolve, reject) => {
        

        fs.mkdir(path.dirname(p),
            { recursive: true }, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve('Directory created successfully!');
            });
    })
}

export async function localCacheInit() {
    try {
        fs.statSync(pluginScriptPosition)
        return;
    } catch (e) {
        console.info('[local.ts] Plugin system not found');
    }
    const script = window.siyuanPluginScript;
    if (!script) {
        return;
    }
    await createFile(pluginScriptPosition);
    await saveToLocal(pluginScriptPosition, script);
}