import { Container, interfaces } from "inversify";
import { StorageManager } from './plugin/storage-manager';
import { PluginSystem } from "./plugin";
import { TYPES } from "./types";
import { PluginSystemLocalManager } from "./worker/plugin-system-local-manager";

const container = new Container();
container.bind<StorageManager>(TYPES.StorageManager).to(StorageManager).inSingletonScope();
container.bind<interfaces.Provider<StorageManager>>(TYPES.StorageManagerProvider).toProvider<StorageManager>((context) => {
    return () => {
        return new Promise<StorageManager>((resolve) => {
            const storageManger = context.container.get<StorageManager>(TYPES.StorageManager);
            storageManger.initStorage().then(() => {
                resolve(storageManger);
            })
        })
    }
});
container.bind<PluginSystemLocalManager>(TYPES.PluginSystemLocalManager).to(PluginSystemLocalManager).inSingletonScope();
container.bind<PluginSystem>(TYPES.PluginSystem).to(PluginSystem).inSingletonScope();


export { container };