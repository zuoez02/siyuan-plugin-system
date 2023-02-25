import "reflect-metadata";
import { injectable } from "inversify";
import { getLocalStorage, setStorageVal } from "../worker/server-api";
import { defaultConfig } from "./config";

@injectable()
class StorageManager {
    private config: any;

    public initialized;

    constructor() {
        this.config = Object.assign({}, defaultConfig);
        this.initialized = false;
    }

    public get(key: string) {
        return this.config[key];
    }

    public async set(key: string, val: any) {
        this.config[key] = val;
        return setStorageVal(key, val);
    }

    async initStorage() {
        if (this.initialized) {
            return this;
        }
        const all = await getLocalStorage();
        const configKeys = Object.keys(defaultConfig);
        for (const key of configKeys) {
            if (all[key] !== undefined) {
                this.config[key] = all[key];
            } else {
                await setStorageVal(key, defaultConfig[key]);
            }
        }
        this.initialized = true;
        return this;
    }
}

export { StorageManager }