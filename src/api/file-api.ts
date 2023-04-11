import { serverApi } from '../api';
import { log } from '../util';
import { Stats } from 'fs';
import semver from 'semver';

export class FileClient {
    static fileClient: FileClient;

    getVersion() {
        return window.siyuan.config.system.kernelVersion;
    }

    fileApi: {
        readDir: (path: string) => Promise<Array<{ isDir: boolean; name: string }>>;
        getFile: (path: string, type?: 'json' | 'text') => Promise<any>;
        putFile: (path, filedata, isDir?: boolean, modTime?: number) => Promise<any>;
        removeFile: (path: string) => Promise<void>;
    };

    private constructor() {
        const v = this.getVersion();
        if (semver.compare(v, '2.8.1') < 0) {
            // old version, electron api support
            this.fileApi = this.electronApi;
        } else {
            // new api, file api support
            this.fileApi = this.serverApi;
        }
    }

    static getInstanceApi() {
        if (!this.fileClient) {
            this.fileClient = new FileClient();
        }
        return this.fileClient;
    }

    electronApi = {
        readDir(p: string): Promise<Array<{ isDir: boolean; name: string }>> {
            const fs = window.require('fs');
            const path = window.require('path');
            const SIYUAN_WORKSPACE = path.join(window.siyuan.config.system.dataDir, '..');
            return new Promise((resolve) => {
                fs.readdir(path.join(SIYUAN_WORKSPACE, p), (err, files: string[]) => {
                    if (err) {
                        resolve([]);
                        return;
                    }
                    const result = files.map<{ isDir: boolean; name: string }>((f: string) => ({
                        isDir: (fs.statSync(path.join(SIYUAN_WORKSPACE, p, f)) as Stats).isDirectory(),
                        name: f,
                    }));
                    resolve(result);
                });
            });
        },
        getFile(f: string, type: 'json' | 'text' = 'text') {
            return new Promise((resolve, reject) => {
                const fs = window.require('fs');
                const path = window.require('path');
                const SIYUAN_WORKSPACE = path.join(window.siyuan.config.system.dataDir, '..');
                fs.readFile(path.join(SIYUAN_WORKSPACE, f), (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const text = data.toString('utf8');
                    if (type === 'json') {
                        try {
                            return resolve(JSON.parse(text));
                        } catch (e) {
                            reject(e);
                            return;
                        }
                    }
                    return resolve(text);
                });
            });
        },
        putFile: serverApi.putFile,
        removeFile(f: string): Promise<void> {
            return new Promise((resolve, reject) => {
                const fs = window.require('fs');
                const path = window.require('path');
                const SIYUAN_WORKSPACE = path.join(window.siyuan.config.system.dataDir, '..');
                const p = path.join(SIYUAN_WORKSPACE, f);
                log('Remove files from', p);
                fs.rm(p, { recursive: true, force: true }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(null);
                });
            });
        },
    };

    serverApi = {
        readDir: serverApi.readDir,
        getFile: serverApi.getFile,
        putFile: serverApi.putFile,
        removeFile: serverApi.removeFile,
    };
}
